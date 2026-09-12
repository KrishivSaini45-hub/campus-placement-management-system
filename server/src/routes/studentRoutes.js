import express from 'express';
import { getProfile, updateProfile, uploadResume, getMyApplications, getMyInterviews, getMyOffers } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.route('/profile').get(getProfile).put(updateProfile);
router.post('/resume', upload.single('resume'), uploadResume);
router.get('/applications', getMyApplications);
router.get('/interviews', getMyInterviews);
router.get('/offers', getMyOffers);

export default router;
