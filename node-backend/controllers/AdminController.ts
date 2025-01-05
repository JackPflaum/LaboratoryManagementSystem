import { Request, Response } from "express";
import User from "../src/database/models/User";
import { UserAttributes } from '../src/database/types/models-interface';
import { Op } from 'sequelize';
import sequelize from "../src/database/models/db";
import Profile from "../src/database/models/Profile";
import { handleSequelizeErrors } from "../src/custom/SequelizeErrorHandler";

// handles Admin requests
export class AdminController {

    // get list of Users
    static async getUsers(req: Request, res: Response) {
        const searchFilter = req.query.search as string;
        let isActiveUser = req.query.isActiveUser as string | boolean;

        if (isActiveUser !== undefined) {
            isActiveUser = isActiveUser === "true";    // convert to boolean (true or false)
        };

        try {
            const whereCondition: any = {};

            if (searchFilter) {
                whereCondition.workEmail = {
                    [Op.iLike]: `%${searchFilter}%`
                };
            };

            // if defined, filter users based on active or not status
            if (typeof isActiveUser === 'boolean') {
                whereCondition.activeEmployee = isActiveUser;
            }

            const users = await User.findAll({
                where: whereCondition,
                order: [["lastName", "ASC"]]
            });

            if (!users) {
                return res.status(404).json({ error: "Users not found" });
            };

            return res.status(200).json(users);
        } catch (error) {
            return handleSequelizeErrors(error, res);
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
            // create User and associated Profile at the same time.
            await sequelize.transaction(async (t) => {
                const user = await User.create(
                    {
                        firstName,
                        lastName,
                        workEmail,
                        position,
                        permissions,
                        dateStarted,
                        password,
                        activeEmployee: true
                    },
                    { transaction: t }
                );

                await Profile.create(
                    { userId: user.id },
                    { transaction: t }
                );
            });

            return res.status(201).json({ success: "New User has been created" });
        } catch (error) {
            return handleSequelizeErrors(error, res);
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
            }, { validate: true });

            return res.status(200).json({ success: "User has been updated" });
        } catch (error) {
            return handleSequelizeErrors(error, res);
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

            // "delete" and "reactivate" employee status
            user.activeEmployee = !user.activeEmployee;
            await user.save();

            return res.status(200).json({ success: "User has been deleted/reactivated" });
        } catch (error) {
            return handleSequelizeErrors(error, res);
        };
    };
};
