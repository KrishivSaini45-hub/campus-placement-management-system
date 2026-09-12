import Application from '../models/Application.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Student from '../models/Student.js';
import { checkEligibility } from '../services/eligibilityService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const applyForDrive = async (req, res, next) => {
  try {
    const { driveId } = req.body;
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 404, 'Student profile not found');
    
    const drive = await PlacementDrive.findById(driveId);
    if (!drive) return errorResponse(res, 404, 'Drive not found');
    
    if (drive.status !== 'Active') {
      return errorResponse(res, 400, 'Drive is not active');
    }
    
    if (new Date(drive.applicationDeadline) < new Date()) {
      return errorResponse(res, 400, 'Application deadline has passed');
    }

    const eligibility = checkEligibility(student, drive);
    if (!eligibility.eligible) {
      return errorResponse(res, 403, 'You are not eligible for this drive');
    }

    const application = await Application.create({
      studentId: student._id,
      driveId: drive._id,
    });

    successResponse(res, 201, 'Application submitted successfully', application);
  } catch (error) {
    next(error);
  }
};

export const getApplicantsForDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    // ensure drive belongs to the recruiter
    const drive = await PlacementDrive.findById(driveId).populate('companyId');
    if (drive.companyId.recruiterId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized');
    }

    const applications = await Application.find({ driveId }).populate('studentId');
    successResponse(res, 200, 'Applicants fetched', applications);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const application = await Application.findById(id).populate({
      path: 'driveId',
      populate: { path: 'companyId' }
    });
    
    if (!application) return errorResponse(res, 404, 'Application not found');
    
    if (application.driveId.companyId.recruiterId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized');
    }

    application.status = status;
    await application.save();
    
    successResponse(res, 200, 'Application status updated', application);
  } catch (error) {
    next(error);
  }
};

export const checkStudentEligibility = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 404, 'Student profile not found');
    
    const drive = await PlacementDrive.findById(driveId);
    if (!drive) return errorResponse(res, 404, 'Drive not found');
    
    const eligibility = checkEligibility(student, drive);
    successResponse(res, 200, 'Eligibility checked', eligibility);
  } catch (error) {
    next(error);
  }
};

export const getAllActiveDrives = async (req, res, next) => {
  try {
    const drives = await PlacementDrive.find({ status: 'Active' }).populate('companyId');
    successResponse(res, 200, 'Active drives fetched', drives);
  } catch (error) {
    next(error);
  }
};
