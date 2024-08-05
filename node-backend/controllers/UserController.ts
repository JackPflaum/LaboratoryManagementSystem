import { Request, Response } from 'express';
import User from "../src/database/models/User";

// handles request related to User Profile
export class UserController {

    // get user profile
    static async getUser(req: Request, res: Response) {
        const { userId } = req.params;
        try {
            const user = await User.findByPk(userId);
            
            res.status(200).json(user);
        } catch (error) {
            console.log('updateUser() Error:', error);
            res.status(500).json({'error': 'Internal server erorr'});
        }
    }


    // update user profile
    static async updateUser(req: Request, res: Response) {
        const { userId } = req.params;
        try {
            res.status(200).json({'success': 'User profile was successfully updated.'});
        } catch (error) {
            console.log('updateUser() Error:', error);
            res.status(500).json({'error': 'Internal server erorr'});
        }
    }
}
