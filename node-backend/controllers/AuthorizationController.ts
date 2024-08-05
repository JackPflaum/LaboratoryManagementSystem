import { Request, Response } from 'express';

// handles requests related to user authorization(login)
export class AuthorizationController {

    // handles user login
    static async login(req: Request, res: Response) {
        try {
            res.status(200).json({"success": "User has successfully logged in."});
        } catch (error) {
            res.status(500).json({"error": "Internal server error"});
        }
    }
}