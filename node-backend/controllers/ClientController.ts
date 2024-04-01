import { Request, Response } from 'express';


export class ClientController {
    static getClients(req: Request, res: Response) {
        res.send('List of Clients');
    }

    static getClientDetails(req: Request, res: Response) {
        res.send('Individual Client Details');
    }

    static addNewClient(req: Request, res: Response) {
        res.send('New Client Added');
    }

    static updateClientDetails(req: Request, res: Response) {
        res.send('Client Details updated');
    }
}