import express from 'express';
import { scheduleInterview, getInterviewsForDrive, updateInterviewResult } from '../controllers/interviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('recruiter'));

router.post('/', scheduleInterview);
router.get('/drive/:driveId', getInterviewsForDrive);
router.put('/:id', updateInterviewResult);

export default router;
