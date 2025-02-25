import { Request, Response } from 'express';
import User from "../src/database/models/User";
import Profile from '../src/database/models/Profile';
import { handleSequelizeErrors } from '../src/custom/SequelizeErrorHandler';

// handles request related to User Profile
export class UserController {

    // get user profile
    static async getUser(req: Request, res: Response) {
        const userId = req.params.id as string;

        try {
            const user = await User.findByPk(userId, {
                include: {
                    model: Profile,
                    as: "profile"
                }
            });

            return res.status(200).json(user);
        } catch (error) {
            return handleSequelizeErrors(error, res);
        };
    };


    // update user password
    static async updatePassword(req: Request, res: Response) {
        // get id from url
        // get password payload
        const { id } = req.params;
        const { data: password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        };

        try {
            const user = await User.findOne({ where: { id: id } });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            };

            // update password (password is hashed on update for security)
            user.password = await User.hashPassword(password);
            await user.save();

            return res.status(200).json({ success: "User password has been updated." });
        } catch (error) {
            return handleSequelizeErrors(error, res);
        };
    };
};
