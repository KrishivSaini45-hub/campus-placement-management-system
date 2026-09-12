import express from 'express';
import { createCompany, getMyCompany, createDrive, getMyDrives } from '../controllers/recruiterController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('recruiter'));

router.route('/company').get(getMyCompany).post(createCompany);
router.route('/drives').get(getMyDrives).post(createDrive);

export default router;
