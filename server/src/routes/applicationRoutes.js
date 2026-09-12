import express from 'express';
import { applyForDrive, checkStudentEligibility, getApplicantsForDrive, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('student'), applyForDrive);
router.get('/:driveId/eligibility', authorize('student'), checkStudentEligibility);

router.get('/drive/:driveId', authorize('recruiter'), getApplicantsForDrive);
router.put('/:id/status', authorize('recruiter'), updateApplicationStatus);

export default router;
