import express from 'express';
import { createOffer, getOffersForDrive, studentUpdateOfferStatus } from '../controllers/offerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize('recruiter'), createOffer);
router.get('/drive/:driveId', authorize('recruiter'), getOffersForDrive);

router.put('/:id/status', authorize('student'), studentUpdateOfferStatus);

export default router;
