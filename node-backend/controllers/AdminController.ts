import { Request, Response } from "express";
import User from "../src/database/models/User";
import { UserAttributes } from '../src/database/types/models-interface';
import { Op } from 'sequelize';

// handles Admin requests
export class AdminController {

    // get list of Users
    static async getUsers(req: Request, res: Response) {
        const searchFilter = req.query.search as string;

        try {
            const users = await User.findAll({
                where: searchFilter ? {
                    workEmail: {
                        [Op.iLike]: `%${searchFilter}%`
                    }
                } : {}
            });

            if (!users) {
                return res.status(404).json({ error: "Users not found" });
            };

            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        };
    };


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
            return res.status(500).json({ error: "Internal server error" })
        };
    };


    // handles updating an existing User
    static async updateUser(req: Request, res: Response) {
        const userId = req.params.id;

        const {
            firstName,
            lastName,
            workEmail,
            position,
            permissions,
            dateStarted,
        }: UserAttributes = req.body;

        try {
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            };

            // update user attributes
            await user.update({
                firstName: firstName,
                lastName: lastName,
                workEmail: workEmail,
                position: position,
                permissions: permissions,
                dateStarted: dateStarted,
            });

            return res.status(200).json({ success: "User has been updated" });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" })
        };
    };


    // handles deleting a User from the database
    static async deleteUser(req: Request, res: Response) {
        const userId = req.params.id;

        try {
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            };

            await user.destroy();

            return res.status(200).json({ success: "User has been deleted" });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" })
        };
    };
};
