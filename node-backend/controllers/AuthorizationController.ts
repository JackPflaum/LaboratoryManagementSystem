import { Request, Response } from 'express';
import User from '../src/database/models/User';
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyRefreshToken } from '../src/middleware/cookieJwtAuth';

dotenv.config();

// handles requests related to user and admin authorization
export class AuthorizationController {

    // verify authentication token.
    // mainly used on page refresh to send back user data for react state global context.
    static async verifyToken(req: Request, res: Response) {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken) {
            if (refreshToken) {
                try {
                    // try refresh access token
                    const { accessToken, user } = await verifyRefreshToken(refreshToken);

                    // attach to response cookie if successful
                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 15 * 60 * 1000
                    });

                    // respond with user details
                    return res.status(200).json({
                        user: {
                            id: user.id,
                            fullName: `${user.firstName} ${user.lastName}`,
                            permissions: user.permissions
                        }
                    });
                } catch (error) {
                    res.clearCookie("accessToken");
                    res.clearCookie("refreshToken");
                    return res.status(403).json({ error: "Invalid refresh token", user: null });
                };
            } else {
                return res.status(401).json({ error: "No access token or refresh token provided.", user: null });
            }
        } else {
            try {
                // access token is available for verification
                const decoded = jwt.verify(accessToken, process.env.JWT_SECRET ?? "default_secret_key") as { id: string, email: string };

                const user = await User.findOne({ where: { id: decoded.id } });

                if (!user) {
                    return res.status(404).json({ error: "User was not found.", user: null });
                };

                // token is valid, send back user details
                return res.status(200).json({
                    user: {
                        id: user.id,
                        fullName: `${user.firstName} ${user.lastName}`,
                        permissions: user.permissions
                    }
                });
            } catch (error) {
                // if access token is expired then attempt to refresh
                if (error instanceof jwt.TokenExpiredError && refreshToken) {
                    try {
                        const { accessToken, user } = await verifyRefreshToken(refreshToken);

                        res.cookie("accessToken", accessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            maxAge: 15 * 60 * 1000
                        });

                        return res.status(200).json({
                            user: {
                                id: user.id,
                                fullName: `${user.firstName} ${user.lastName}`,
                                permissions: user.permissions
                            }
                        });
                    } catch (error) {
                        res.clearCookie("accessToken");
                        res.clearCookie("refreshToken");
                        return res.status(403).json({ error: "Invalid access token", user: null });
                    };
                } else {
                    res.clearCookie("accessToken");
                    res.clearCookie("refreshToken");
                    return res.status(403).json({ error: "Invalid access token", user: null });
                }
            }
        };
    };


    // handles user login
    static async userlogin(req: Request, res: Response) {
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

            // generate JWT access token
            const accessToken = jwt.sign(
                { id: user.id, email: user.workEmail },
                process.env.JWT_SECRET ?? "default_secret_key",
                { expiresIn: "15m" }
            );

            // generate refresh token
            const refreshToken = jwt.sign(
                { id: user.id, email: user.workEmail },
                process.env.REFRESH_SECRET_KEY ?? "default_secret_key",
                { expiresIn: "1d" }
            );

            // store access token in cookie
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",    // uses https if in production mode
                maxAge: 15 * 60 * 1000,    // 15 minutes
            });

            // store refresh token in cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,    // 1 day
            });

            return res.status(200).json({
                id: user.id,
                fullName: `${user.firstName} ${user.lastName}`,
                permissions: user.permissions,
            });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }


    // handles admin login
    static async adminLogin(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
                return res.status(401).json({ error: "Invalid email or password." })
            };

            // // generate JWT access token
            // const accessToken = jwt.sign(
            //     { id: process.env.ADMIN_ID, email: process.env.ADMIN_EMAIL },
            //     process.env.JWT_SECRET ?? "default_secret_key",
            //     { expiresIn: "15m" }
            // );

            // // generate refresh token
            // const refreshToken = jwt.sign(
            //     { id: process.env.ADMIN_ID, email: process.env.ADMIN_EMAIL },
            //     process.env.REFRESH_SECRET_KEY ?? "default_secret_key",
            //     { expiresIn: "1d" }
            // );

            // // store access token in cookie
            // res.cookie("accessToken", accessToken, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",    // uses https if in production mode
            //     maxAge: 15 * 60 * 1000,    // 15 minutes
            // });

            // // store refresh token in cookie
            // res.cookie("refreshToken", refreshToken, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     maxAge: 24 * 60 * 60 * 1000,    // 1 day
            // });

            return res.status(200).json({ isAuthorized: true });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        };
    };


    // handles user and admin logout
    static async logout(req: Request, res: Response) {
        try {
            // invalidate access token and refresh token from user cookies
            res.clearCookie("accessToken");
            res.clearCookie("refrechToken");

            return res.status(200).json({ success: "User has been logged out succefully." });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        };
    };
};