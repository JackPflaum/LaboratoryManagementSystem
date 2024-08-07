import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Client from '../src/database/models/Client';

// maybe import from Client
interface ClientAttributes {
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    purchaseOrderNumber: string;
}


// handles requests related to client information
export class ClientController {

    // retrieve all clients from database
    static async getClients(req: Request, res: Response) {
        try {
            const clients = await Client.findAll();
            res.status(200).json(clients);
        } catch (error) {
            console.log('getClients() Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


    // retrieve client from database with specified id
    static async getClientDetails(req: Request, res: Response) {
        const { clientId } = req.params;
        try {
            const client = await Client.findByPk(clientId);

            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }

            // respond with retieved client details
            res.status(200).json(client);
        } catch (error) {
            console.log('getClientDetails() Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


    // add new client details to database 
    static async addNewClient(req: Request, res: Response) {
        // get form data from request body
        const { name, email, phoneNumber, address, purchaseOrderNumber }: ClientAttributes = req.body;
        try {
            // create client and send back newly created client in json response
            const newClient = await Client.create({name, email, phoneNumber, address, purchaseOrderNumber});
            res.status(201).json(newClient);
        } catch (error) {
            console.log('addNewClient() Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


    // update an existing client in the database
    static async updateClientDetails(req: Request, res: Response) {
        try {
            res.send('Client Details updated');
        } catch (error) {
            console.log('updateClientDetails() Error:', error);
        };
    }


    // confirms clients existance in the database (called before addNewClient)
    static async confirmClientExists(req: Request, res: Response) {
        const { name, email } = req.query;
        try {
            // check database for existance of name or email
            const client = await Client.findOne({
                where: {
                    [Op.or]: [
                        { name: name as string },
                        { email: email as string }
                    ]
                }
            });

            // return true or false based on whether name or email was found in database
            if (client) {
                res.status(200).json({ result: true });
            } else {
                res.status(200).json({ result: false });
            };
        } catch (error) {
            console.log('confirmClientExists() Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};
