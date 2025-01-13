import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import routes from "./routes";
import cors from "cors";
import { cookieJwtAuth, unless } from "./middleware/cookieJwtAuth";
import cookieParser from "cookie-parser";
import sequelize from "./database/models/db";
import User from "./database/models/User";
import Profile from "./database/models/Profile";
import Client from "./database/models/Client";
import Job from "./database/models/Job";
import Sample from "./database/models/Sample";
import SamplePhoto from "./database/models/SamplePhoto";
import Test from "./database/models/Test";

const models = {
    User,
    Profile,
    Client,
    Job,
    Sample,
    SamplePhoto,
    Test,
};

// synchronize all models to database.
(async () => {
    try {
        console.log("Starting database synchronization...");

        // initialize model associations
        Object.values(models).forEach(
            (model) => model.associate && model.associate(models)
        );

        await sequelize.sync({ force: false });

        console.log("Database synchronized successfully");
    } catch (error) {
        console.error("Error synchronizing database:", error);
    };
})(); // Added this line to immediately invoke the async function

// load up '.env' file into 'process.env' object of Node.js
dotenv.config();

const corsOptions = {
    origin: "http://localhost:3000",   // allowing requests from this origin to access backend resources
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,    // allow cookies and credentials
}

const app = express();
const server = createServer(app);   // create HTTP server
const io = new Server(server, {
    cors: corsOptions
});

// export the "io" instance
export { io };

const port = process.env.PORT;

// use CORS (Cross-Origin Resource Sharing) middleware package for secure requests between front and backend.
app.use(
    cors(corsOptions)
);

// converts incoming JSON payloads in request body to javascript object which becomes available in request.body object
app.use(express.json());

// parses cookies attached to client requests into req.cookies property
app.use(cookieParser());

// apply JWT authentication to all routes except login pages
app.use(
    unless(
        cookieJwtAuth,
        "/api/",
        "/api/verify-token",
        "/api/user-login",
        "/api/admin-login",
        "/api/admin",
        "/api/admin/add-new-user"
    )
);

app.use("/api", routes);

// setting up websocket connection
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (error) => {
        console.log("Socket error:", error);
    });
})

server.listen(port, () => {
    console.log(`Listen for server running on http://localhost:${port}`);
});
