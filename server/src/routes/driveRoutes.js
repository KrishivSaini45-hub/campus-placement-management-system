import express from 'express';
import { getAllActiveDrives } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.get('/', getAllActiveDrives);

export default router;
