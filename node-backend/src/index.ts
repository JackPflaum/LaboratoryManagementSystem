import express from 'express';
import dotenv from 'dotenv';
import routes from '../routes';

// load up '.env' file into the 'process.env' object of Node.js
dotenv.config();

const app = express();
const port = process.env.PORT;

// converts incoming JSON payloads in request bodies to javascript object which becomes available in request.body object
app.use(express.json());

app.use('api/', routes);

app.listen(port, () => {
    console.log(`Listen for server running on http://localhost:${port}`);
});
