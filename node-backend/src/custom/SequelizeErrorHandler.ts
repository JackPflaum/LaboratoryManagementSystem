import { Response } from "express";

// handle multiple types of sequelize errors
export function handleSequelizeErrors(error: unknown, res: Response) {
    const genericErrorMessage: string = "Internal server error";

    if (error instanceof Error) {
        const sequelizeError = error as any;
        const message = sequelizeError.errors?.[0]?.message || genericErrorMessage;

        switch (error.name) {
            case "SequelizeUniqueConstraintError":
                return res.status(400).json({ error: message });
            case "SequelizeValidationError":
                return res.status(400).json({ error: message });
            case "SequelizeForeignKeyConstraintError":
                return res.status(400).json({ error: message });
            case "SequelizeDatabaseError":
                return res.status(400).json({ error: message });
            default:
                return res.status(500).json({ error: genericErrorMessage });
        }
    }
    // unexpected errors
    return res.status(500).json({ error: genericErrorMessage });
};
