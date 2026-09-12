import Offer from '../models/Offer.js';
import Application from '../models/Application.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createOffer = async (req, res, next) => {
  try {
    const { applicationId, jobTitle, salary, joiningDate, location } = req.body;
    
    const application = await Application.findById(applicationId).populate({
      path: 'driveId',
      populate: { path: 'companyId' }
    });
    
    if (!application) return errorResponse(res, 404, 'Application not found');
    
    if (application.driveId.companyId.recruiterId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized');
    }
    
    const offer = await Offer.create({
      applicationId,
      studentId: application.studentId,
      jobTitle,
      salary,
      joiningDate,
      location,
    });
    
    application.status = 'Selected';
    await application.save();
    
    successResponse(res, 201, 'Offer created successfully', offer);
  } catch (error) {
    next(error);
  }
};

export const getOffersForDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const applications = await Application.find({ driveId });
    const appIds = applications.map(app => app._id);
    
    const offers = await Offer.find({ applicationId: { $in: appIds } })
      .populate({ path: 'studentId' });
      
    successResponse(res, 200, 'Offers fetched', offers);
  } catch (error) {
    next(error);
  }
};

export const studentUpdateOfferStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const offer = await Offer.findById(id).populate('studentId');
    if (!offer) return errorResponse(res, 404, 'Offer not found');
    
    if (offer.studentId.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized');
    }
    
    offer.status = status;
    await offer.save();
    
    successResponse(res, 200, 'Offer status updated', offer);
  } catch (error) {
    next(error);
  }
};
