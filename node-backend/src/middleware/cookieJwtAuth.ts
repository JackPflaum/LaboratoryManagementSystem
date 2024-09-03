import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../database/models/User";

dotenv.config();

// checks whether request path matches any of the excluded paths.
// if there is a match then skip past middleware, otherwise run middleware function.
export const unless = (middleware: RequestHandler, ...paths: string[]) => {
    return function (req: Request, res: Response, next: NextFunction) {
        const pathCheck = paths.some(path => path === req.path);
        pathCheck ? next() : middleware(req, res, next);
    };
};


// checks validity of JWT access token before proceeding with request.
export const cookieJwtAuth = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        if (refreshToken) {
            try {
                // try refresh access token
                const { accessToken } = await verifyRefreshToken(refreshToken);

                // attach to response cookie if successful
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 15 * 60 * 1000
                });

                // continue with request
                next();
            } catch (error) {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.status(403).json({ error: "Invalid refresh token" });
            };
        } else {
            return res.status(401).json({ error: "No access token or refresh token porvided." });
        }
    } else {
        try {
            // access token is available for verification
            jwt.verify(accessToken, process.env.JWT_SECRET ?? "default_secret_key");

            // token is valid, proceed forward with request
            next()
        } catch (error) {
            // if access token is expired then attempt to refresh
            if (error instanceof jwt.TokenExpiredError && refreshToken) {
                try {
                    const { accessToken } = await verifyRefreshToken(refreshToken);

                    res.cookie("accessToken", accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 15 * 60 * 1000
                    });

                    next();

                } catch (error) {
                    res.clearCookie("accessToken");
                    res.clearCookie("refreshToken");
                    return res.status(403).json({ error: "Invalid access token" })
                };
            } else {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.status(403).json({ error: "Invalid access token" })
            }
        }
    }
};


// verify JWT refresh token 
export const verifyRefreshToken = async (refreshToken: string) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY ?? "default_secret_key") as { id: string, email: string };

        const user = await User.findOne({ where: { id: decoded.id } });

        if (!user) {
            throw new Error("User not found.");
        };

        // create new access token
        const accessToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            process.env.JWT_SECRET ?? "default_secret_key",
            { expiresIn: "15m" }
        );

        return { accessToken: accessToken, user: user };

    } catch (error) {
        throw new Error("Invalid refresh token");
    };
};
