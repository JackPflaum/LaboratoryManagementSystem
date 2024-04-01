import express from 'express';
import { ClientController } from './controllers/ClientController'
import { JobController } from './controllers/JobController';

const router = express.Router();

router.get('/clients', ClientController.getClients);
router.get('/clients/:id', ClientController.getClientDetails);
router.post('/clients', ClientController.addNewClient);
router.put('/clients/:id', ClientController.updateClientDetails);

router.get('/jobs', JobController.getJobs);
router.get('/jobs/:id', JobController.getJobDetails);
router.post('/jobs', JobController.addNewJob);
router.put('/jobs/:id', JobController.updateJobDetails);

export default router;