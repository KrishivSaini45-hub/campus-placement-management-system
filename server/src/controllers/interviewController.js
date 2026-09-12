import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId, round, scheduledAt, mode, meetingLink, interviewer } = req.body;
    
    const application = await Application.findById(applicationId).populate({
      path: 'driveId',
      populate: { path: 'companyId' }
    });
    
    if (!application) return errorResponse(res, 404, 'Application not found');
    
    if (application.driveId.companyId.recruiterId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized');
    }
    
    const interview = await Interview.create({
      applicationId, round, scheduledAt, mode, meetingLink, interviewer
    });
    
    application.status = 'Interview Scheduled';
    await application.save();

    successResponse(res, 201, 'Interview scheduled successfully', interview);
  } catch (error) {
    next(error);
  }
};

export const getInterviewsForDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const applications = await Application.find({ driveId });
    const appIds = applications.map(app => app._id);
    
    const interviews = await Interview.find({ applicationId: { $in: appIds } })
      .populate({ path: 'applicationId', populate: { path: 'studentId' } });
      
    successResponse(res, 200, 'Interviews fetched', interviews);
  } catch (error) {
    next(error);
  }
};

export const updateInterviewResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { result, notes, status } = req.body;
    
    const interview = await Interview.findById(id);
    if (!interview) return errorResponse(res, 404, 'Interview not found');
    
    interview.result = result;
    interview.notes = notes;
    if (status) interview.status = status;
    
    await interview.save();
    successResponse(res, 200, 'Interview result updated', interview);
  } catch (error) {
    next(error);
  }
};
