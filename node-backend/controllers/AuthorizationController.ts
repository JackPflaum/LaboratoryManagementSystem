import { Request, Response } from 'express';
import User from '../src/database/models/User';
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

// handles requests related to user authorization
export class AuthorizationController {

    // handles user login
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            // find user based on email
            const user = await User.findOne({
                where: {
                    workEmail: email,
                }
            })

            if (!user) {
                return res.status(401).json({ error: "Invalid email address." });
            }

            // compare password with hashed password in database
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: "Invalid password." });
            }

            // generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.workEmail },
                process.env.JWT_SECRET || "default_secret_key",
                { expiresIn: "15m" }
            );

            // store token in cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",    // uses https if in production mode
                maxAge: 15 * 60 * 1000    // 15 minutes
            });

            return res.status(200).json({
                fullName: `${user.firstName} ${user.lastName}`,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};