import { Request, Response } from 'express';
import { ProfileAttributes } from '../src/database/types/models-interface';
import Profile from '../src/database/models/Profile';

export class ProfileController {

    static async updateProfile(req: Request, res: Response) {
        const { id, personalEmail, phoneNumber } = req.body as ProfileAttributes;
        try {
            const profile = await Profile.findByPk(id);

            if (!profile) {
                return res.status(404).json({ error: "Profile not found." });
            };

            profile.update({
                personalEmail,
                phoneNumber
            });

            return res.status(201).json({ success: "Profile updated" });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        };
    };
};