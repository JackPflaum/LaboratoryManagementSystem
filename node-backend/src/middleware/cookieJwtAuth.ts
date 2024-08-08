import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const cookieJwtAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        // verify JWT token 
        jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");

        // token is valid, proceed forward with request
        next();
    } catch (error) {
        // TODO: Handle refreshing expired token
        res.clearCookie("token");
        return res.status(401).json({ error: "Invalid access token" });
    }
};