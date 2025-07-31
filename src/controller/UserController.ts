import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../db/db.prisma";
import { EncodeToken } from "../utility/TokenHelper";
import { Country, Language } from "@prisma/client";

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