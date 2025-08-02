import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../db/db.prisma";
import { EncodeToken } from "../utility/TokenHelper";
import { Country, Language } from "@prisma/client";
import SendEmailUtility from "../utility/SendEmailUtility";

export const register = async (req:Request, res:Response) => {
    try {
            let {name, email, password, country, language} = req.body;

            if (!Object.values(Country).includes(country)) {
                return res.status(400).json({
                    message: `Invalid country. Allowed values: ${Object.values(Country).join(", ")}`,
                });
            }
            else if (!Object.values(Language).includes(language)) {
                return res.status(400).json({ message: `Invalid language. Allowed values: ${Object.values(Language).join(", ")}` });
            }

            let hashedPassword = await bcrypt.hash(password, 10);

            const  data = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    country,
                    language,
                }
            })
            if(data) {
                res.status(201).json({ message: "User registered successfully!", data:data });
            }
            else{
                res.status(400).json({ message: "User registration failed!" });
            }
            
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.status(500).json({ message: "Something went wrong", error: e.message });
        } else {
            console.error(e);
            return res.status(500).json({ message: "Something went wrong", error: String(e) });
        }
    }
}

export const login = async (req:Request, res:Response) => {
   try {
            let {email, password} = req.body;
            const data = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })
            if (!data) {
                return res.json({status:false, message: "No User Exist With this Email" });
            }
            else{
                let comparePassword = await bcrypt.compare(password, data.password);
                if( !comparePassword ) {
                    return res.json({status:false, message: "Invalid email or password" });
                }
                let token = EncodeToken(data['email'],data['id'])
                res.json({status:true, message: "Login Success!", token:token, data: data });
            }
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({status:false, message: "Internal server error", error: e.message });
        } else {
            console.error(e);
            return res.json({status:false, message: "Internal server error", error: String(e) });
        }
    }
}

export const profile = async (req:Request, res:Response) => {
   try {
            let email = req.headers.email as string
            const data = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })
            return res.json({status:true, message: "User profile fetched successfully", data: data });
            
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({status:false, message: "Internal server error", error: e.message });
        } else {
            console.error(e);
            return res.json({status:false, message: "Internal server error", error: String(e) });
        }
    }
}

export const profileUpdate = async (req:Request, res:Response) => {
   try {
            let email = req.headers.email as string
            let {name,country,birthday} = req.body;
            const data = await prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    name,
                    country,
                    birthday
                }
            })
            return res.json({status:true, message: "User profile updated", data: data });
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({status:false, message: "Internal server error", error: e.message });
        } else {
            console.error(e);
            return res.json({status:false, message: "Internal server error", error: String(e) });
        }
    }
}

export const changePassword = async (req:Request, res:Response) => {
   try {
            let email = req.headers.email as string
            let {password, newPassword}:string | any = req.body;
            
            const data:any = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })
            console.log(data);
            let comparePassword = await bcrypt.compare(password, data.password);
            if( !comparePassword ) {
                return res.json({status:false, message: "Password doesn't matched!" });
            }
            else{
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        password: hashedNewPassword
                    }
                })
                return res.json({status:true, message: "User Password updated"});
            }
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({status:false, message: "Internal server error", error: e.message });
        } else {
            console.error(e);
            return res.json({status:false, message: "Internal server error", error: String(e) });
        }
    }
}

export const recoverVerifyEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const email: string = req.params.email;
    const OTPCode: number = Math.floor(100000 + Math.random() * 900000);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      // Create OTP
      await prisma.otp.create({
        data: {
          email: email,
          otp: OTPCode.toString(),
        },
      });

      // Send OTP Email
      const sendEmail = await SendEmailUtility(email, "FreeMinder PIN Verification", `Your PIN Code is ${OTPCode}`);
      
      return res.status(200).json({ status: true, message: "OTP sent to your email" });
    } else {
      return res.status(200).json({ status: false, message: "No User Found" });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      return res.json({ status: false, message: "Internal server error", error: e.message });
    } else {
      console.error(e);
      return res.json({ status: false, message: "Internal server error", error: String(e) });
    }
  }
};
 
export const recoverVerifyOTP = async (req: Request, res: Response): Promise<Response> => {
  try {
    const email: string = req.params.email;
    const OTPCode: string = req.params.otp; // OTP is typically a string
    const status: number = 0;
    const statusUpdate: number = 1;

    // Check if OTP exists and is not used yet
    const otpCount = await prisma.otp.count({
      where: {
        email: email,
        otp: OTPCode,
        status: status,
      },
    });

    if (otpCount > 0) {
      // Update OTP status to used
      const otpUpdate = await prisma.otp.updateMany({
        where: {
          email: email,
          otp: OTPCode,
          status: status,
        },
        data: {
          status: statusUpdate,
        },
      });
      return res.status(200).json({ status: true, message: "OTP Verification Success", data: otpUpdate });
    } else {
      return res.status(200).json({ status: false, message: "Invalid OTP Code" });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      return res.json({ status: false, message: "Internal server error", error: e.message });
    } else {
      console.error(e);
      return res.json({ status: false, message: "Internal server error", error: String(e) });
    }
  }
};
 
interface ResetPass{
    email: string;
    OTPCode: string;
    NewPass: string;
}
export const recoverResetPass = async (req: Request, res: Response): Promise<Response> => {
  const { email, OTPCode, NewPass }: ResetPass = req.body;
  const statusUpdate: number = 1;
  const OTPpassReset: number = 999;

  try {
    // Check if OTP has been used
    const otpUsedCount = await prisma.otp.count({
      where: {
        email: email,
        otp: OTPCode,
        status: statusUpdate,
      },
    });

    if (otpUsedCount > 0) {
      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(NewPass, 10);

      // Update the user's password
      const passUpdate = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          password: hashedPassword, // Ensure the password is hashed
        },
      });

      // Mark OTP as used (reset status)
      await prisma.otp.updateMany({
        where: {
          email: email,
          otp: OTPCode,
        },
        data: {
          status: OTPpassReset,
        },
      });

      return res.status(200).json({ status: true, message: "Password Updated", data: passUpdate });
    } else {
      return res.status(200).json({ status: false, message: "Invalid Request" });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
      return res.json({ status: false, message: "Internal server error", error: e.message });
    } else {
      console.error(e);
      return res.json({ status: false, message: "Internal server error", error: String(e) });
    }
  }
};