import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { ClientController } from '../controllers/ClientController';
import { JobController } from '../controllers/JobController';
import { SampleController } from '../controllers/SampleController';
import { AuthorizationController } from '../controllers/AuthorizationController';
import { UserController } from '../controllers/UserController';
import { AdminController } from '../controllers/AdminController';
import { ProfileController } from '../controllers/ProfileController';
import { TestController } from '../controllers/TestController';


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
router.get('/clients/confirm-client-exists', ClientController.confirmClientExists);

// Job related requests
router.get('/jobs', JobController.getJobs);
router.get('/jobs/:id', JobController.getJobDetails);
router.post('/jobs/add-new-job', JobController.addNewJob);
router.put('/jobs/:id/update-job-details', JobController.updateJobDetails);
router.get('/jobs/:id/delete', JobController.deleteJob);

// Sample related requests
router.get('/samples', SampleController.getSamples);
router.get('/sample/:id', SampleController.getSampleDetails);
router.post('/sample/add-new-sample', SampleController.addNewSample);
router.put('/sample/:id/update-sample-details', SampleController.updateSampleDetails);
router.delete('/sample/:id/delete-sample', SampleController.deleteSample);

// Tests related requests
router.get('/tests', TestController.getTests);
router.get('/tests/:id', TestController.getTestDetails);
router.post('/tests/add-new-test', TestController.addNewTest);
router.put('/tests/:id/update-test-details', TestController.updateTestDetails);
router.delete('/tests/:id/delete-test', TestController.deleteTest);

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
