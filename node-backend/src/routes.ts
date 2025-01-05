import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { ClientController } from '../controllers/ClientController';
import { JobController } from '../controllers/JobController';
import { SampleController } from '../controllers/SampleController';
import { AuthorizationController } from '../controllers/AuthorizationController';
import { UserController } from '../controllers/UserController';
import { AdminController } from '../controllers/AdminController';
import { ProfileController } from '../controllers/ProfileController';
import { ResultsController } from '../controllers/ResultsController';


const router = Router();

// Admin related requests
router.get('/admin', AdminController.getUsers);
router.post('/admin/add-new-user', AdminController.addNewUser);
router.put('/admin/update-user/:id', AdminController.updateUser);
router.delete('/admin/delete-user/:id', AdminController.deleteUser);

// Dashboard related requests 
router.get('/dashboard', DashboardController.getDashboard);

// Client related requests
router.get('/clients', ClientController.getClients);
router.get('/clients/:id', ClientController.getClientDetails);
router.post('/clients/add-new-client', ClientController.addNewClient);
router.put('/clients/:id/update-client-details', ClientController.updateClientDetails);
router.delete('/clients/:id/delete', ClientController.deleteClient);

// Job related requests
router.get('/jobs', JobController.getJobs);
router.get('/jobs/:jobNumber', JobController.getJobDetails);
router.post('/jobs/add-new-job', JobController.addNewJob);
router.put('/jobs/:id/update-job-details', JobController.updateJobDetails);
router.delete('/jobs/:id/delete', JobController.deleteJob);

// Sample related requests
router.get('/samples', SampleController.getSamples);
router.post('/samples/add-new-sample', SampleController.addNewSample);
router.put('/samples/:id/update-sample-details', SampleController.updateSampleDetails);
router.delete('/samples/:id/delete-sample', SampleController.deleteSample);

// Results related requests
router.put('/results/save-results', ResultsController.saveResults);

// User Authorization requests
router.post('/user-login', AuthorizationController.userlogin);
router.post('/admin-login', AuthorizationController.adminLogin)
router.get('/verify-token', AuthorizationController.verifyToken);
router.post('/logout', AuthorizationController.logout);

// User related requests
router.get('/user/:id', UserController.getUser);
router.put('/user/:id/update-password', UserController.updatePassword);

// Profile related requests
router.put('/profile/:id/update-profile', ProfileController.updateProfile);

export default router;
