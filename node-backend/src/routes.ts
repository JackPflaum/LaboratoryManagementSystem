import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { ClientController } from '../controllers/ClientController';
import { JobController } from '../controllers/JobController';
import { SampleController } from '../controllers/SampleController';
import { AuthorizationController } from '../controllers/AuthorizationController';
import { UserController } from '../controllers/UserController';
import { AdminController } from '../controllers/AdminController';


const router = Router();

// Admin related requests
router.post('/admin/add-new-user', AdminController.addNewUser);

// Dashboard related requests 
router.get('/dashboard', DashboardController.getDashboard);

// Client related requests
router.get('/clients', ClientController.getClients);
router.get('/clients/:id', ClientController.getClientDetails);
router.post('/clients/add-new-client', ClientController.addNewClient);
router.put('/clients/:id/update-client-details', ClientController.updateClientDetails);
router.get('/clients/confirm-client-exists', ClientController.confirmClientExists);

// Job related requests
router.get('/jobs', JobController.getJobs);
router.get('/jobs/:id', JobController.getJobDetails);
router.post('/jobs/add-new-job', JobController.addNewJob);
router.put('/jobs/:id/update-job-details', JobController.updateJobDetails);

// Sample related requests
router.get('/sample-details/:id', SampleController.getSampleDetails);
router.put('/sample-details/:id/update-sample-details', SampleController.updateSampleDetails);
router.delete('/sample-details/:id/delete-sample', SampleController.deleteSample);

// User Authorization requests
router.post('/user-login', AuthorizationController.userlogin);
router.post('/admin-login', AuthorizationController.adminLogin)
router.get('/verify-token', AuthorizationController.verifyToken);
router.post('/logout', AuthorizationController.logout);

// User-Profile related requests
router.get('/user/:id', UserController.getUser);
router.put('/user/:id/update-user', UserController.updateUser);
router.put('/user/:id/update-password', UserController.updatePassword);

export default router;

