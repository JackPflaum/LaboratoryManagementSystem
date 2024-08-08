import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import cors from 'cors';
import { cookieJwtAuth } from './middleware/cookieJwtAuth';
import cookieParser from "cookie-parser";

// load up '.env' file into 'process.env' object of Node.js
dotenv.config();

const app = express();
const port = process.env.PORT;

// use CORS (Cross-Origin Resource Sharing) middleware package for secure requests between front and backend.
app.use(cors({ origin: 'http://localhost:3000' }));    // allowing requests from this origin to access backend resources

// converts incoming JSON payloads in request body to javascript object which becomes available in request.body object
app.use(express.json());

app.use(cookieParser())

// apply JWT authentication to all routes
app.use(cookieJwtAuth);

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Listen for server runnin on http://localhost:${port}`);
});
