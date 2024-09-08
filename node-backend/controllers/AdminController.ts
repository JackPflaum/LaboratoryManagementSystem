import { Request, Response } from "express";
import User from "../src/database/models/User";
import { UserAttributes } from '../src/database/types/models-interface';

// handles Admin requests
export class AdminController {

    // handles creation of new User
    static async addNewUser(req: Request, res: Response) {
        const {
            firstName,
            lastName,
            workEmail,
            position,
            permissions,
            dateStarted,
            password
        }: UserAttributes = req.body;

        try {
            await User.create({
                firstName,
                lastName,
                workEmail,
                position,
                permissions,
                dateStarted,
                password,
            });

            return res.status(201).json({ success: "New User has been created" });
        } catch (error) {
            console.log("Error: ", error);
            return res.status(500).json({ error: "Internal server error" })
        }
    };
};
