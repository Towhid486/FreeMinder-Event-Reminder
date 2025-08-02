import prisma from "../db/db.prisma";
import { Request, Response } from "express";


export const addReminder = async (req: Request, res: Response) => {
    try {
            const UserId = req.headers['user_id'] as string | any;
            let {name, date, gender, tags, location, oneWeekBefore, twoWeekBefore, link}:string | any = req.body;
            console.log(UserId)
            const  data = await prisma.reminder.create({
                data: {
                    userId: UserId,
                    name, 
                    date, 
                    gender, 
                    tags, 
                    location, 
                    oneWeekBefore, 
                    twoWeekBefore, 
                    link
                }
            })
            if(data) {
                 res.status(201).json({status:true, message: "Reminder added successfully!", data:data });
            }
            else{
                res.status(400).json({status:false, message: "Failed to create reminder!" });
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

export const allReminder = async (req:Request, res:Response) => {
   try {
            const UserId = req.headers['user_id'] as string | any;
            const data = await prisma.reminder.findMany({
                where: {
                    userId: UserId
                }
            })
            if(data.length>0) {
                return res.json({status:true, message: "Reminder List Found", data: data });
            }
            else{
                 return res.json({status:false, message: "No reminder found for you.", data: data });
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

export const updateReminder = async (req:Request, res:Response) => {
   try {
            const UserId = req.headers['user_id'] as string | any;
            const id = req.params.id;
            let {name, date, gender, tags, location, oneWeekBefore, twoWeekBefore, link}:string | any = req.body;
            const data = await prisma.reminder.update({
                where: {
                    userId: UserId,
                    id: id
                },
                data: {
                    name, 
                    date, 
                    gender, 
                    tags, 
                    location, 
                    oneWeekBefore, 
                    twoWeekBefore, 
                    link
                }
            })
            return res.json({status:true, message: "Reminder updated", data: data });
    } 
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({status:false, message: "Internal server error", error: e.message });
        } else {
            console.error(e);
            return res.json({status:false, message: "Internal server error", error: String(e) });
        }
    }
}


export const addTag = async (req: Request, res: Response) => {
    try {
            let {name}:string | any = req.body;
            const  data = await prisma.tag.create({
                data: {
                    name:name
                }
            })
            if(data) {
                 res.status(201).json({status:true, message: "Tag added successfully!", data:data });
            }
            else{
                res.status(400).json({status:false, message: "Failed to create tag!" });
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

export const updateTag = async (req:Request, res:Response) => {
   try {
            const id = req.params.id;
            let {name}:string | any = req.body;
            const data = await prisma.tag.update({
                where: {
                    id: id
                },
                data: {
                    name
                }
            })
            return res.json({status:true, message: "Tag updated", data: data });
    } 
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            return res.json({status:false, message: "Internal server error", error: e.message });
        } else {
            console.error(e);
            return res.json({status:false, message: "Internal server error", error: String(e) });
        }
    }
}

export const allTags = async (req:Request, res:Response) => {
   try {
            const data = await prisma.tag.findMany()
            if(data.length>0) {
                return res.json({status:true, message: "Tag List Found", data: data });
            }
            else{
                 return res.json({status:false, message: "No tag found.", data: data });
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