import { Request, Response } from 'express';
import { ProfileAttributes } from '../src/database/types/models-interface';
import Profile from '../src/database/models/Profile';

export class ProfileController {

    static async updateProfile(req: Request, res: Response) {
        const { personalEmail, phoneNumber } = req.body.data as ProfileAttributes;
        const id = req.params.id;

        try {
            const profile = await Profile.findByPk(id);

            if (!profile) {
                return res.status(404).json({ error: "Profile not found." });
            };

            profile.update({
                personalEmail: personalEmail,
                phoneNumber: phoneNumber
            });

            return res.status(200).json({ success: "Profile updated" });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        };
    };
};