import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Client from '../src/database/models/Client';
import { ClientAttributes } from '../src/database/types/models-interface';


// handles requests related to client information
export class ClientController {

    // retrieve all clients from database
    static async getClients(req: Request, res: Response) {
        try {
            const clients = await Client.findAll({
                attributes: [
                    "id",
                    "name",
                    "email",
                    "phoneNumber",
                    "purchaseOrderNumber",
                    "addressLine",
                    "suburb",
                    "state",
                    "postcode",
                    "fullAddress"
                ]
            });

            // convert to plain javascript objects to remove Sequelize meta data
            const formattedClients = clients.map(client => client.get({ plain: true }));

            return res.status(200).json(formattedClients);
        } catch (error) {
            console.log('getClients() Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };


    // retrieve client from database with specified id
    static async getClientDetails(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const client = await Client.findByPk(id);

            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }

            // respond with retieved client details
            return res.status(200).json(client);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        };
    };


    // add new client details to database 
    static async addNewClient(req: Request, res: Response) {
        // get form data from request body
        const {
            name,
            email,
            phoneNumber,
            addressLine,
            suburb,
            state,
            postcode,
            purchaseOrderNumber
        }: ClientAttributes = req.body;

        try {
            // create client and send back newly created client in json response
            await Client.create({ name, email, phoneNumber, addressLine, suburb, state, postcode, purchaseOrderNumber });
            return res.status(201).json({ success: "New Client has been created" });
        } catch (error) {
            console.log('addNewClient() Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };


    // update an existing client in the database
    static async updateClientDetails(req: Request, res: Response) {
        const { clientId } = req.params;
        const {
            name,
            email,
            phoneNumber,
            addressLine,
            suburb,
            state,
            postcode,
            purchaseOrderNumber
        }: ClientAttributes = req.body;

        try {
            const client = await Client.findByPk(clientId);

            if (!client) {
                return res.status(404).json({ error: "Client not found." });
            }

            await client.update({
                name: name !== "" ? name : client.name,
                email: email !== "" ? email : client.email,
                phoneNumber: phoneNumber !== "" ? phoneNumber : client.phoneNumber,
                addressLine: addressLine !== "" ? addressLine : client.addressLine,
                suburb: suburb !== "" ? suburb : client.suburb,
                state: state !== "" ? state : client.state,
                postcode: postcode !== "" ? postcode : client.postcode,
                purchaseOrderNumber: purchaseOrderNumber !== "" ? purchaseOrderNumber : client.purchaseOrderNumber,
            });

            return res.status(201).json({ success: "Client Details updated" });
        } catch (error) {
            console.log('updateClientDetails() Error:', error);
        };
    };


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
                return res.status(200).json({ result: true });
            } else {
                return res.status(200).json({ result: false });
            };
        } catch (error) {
            console.log('confirmClientExists() Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
};
