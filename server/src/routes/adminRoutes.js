import express from 'express';
import { getDashboardStats, getAllUsers, toggleUserStatus, getAllCompanies, updateCompanyStatus, getAllDrives, updateDriveStatus } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.route('/users').get(getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);

router.get('/companies', getAllCompanies);
router.put('/companies/:id/status', updateCompanyStatus);

router.get('/drives', getAllDrives);
router.put('/drives/:id/status', updateDriveStatus);

export default router;
