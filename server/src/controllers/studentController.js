import Student from '../models/Student.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Offer from '../models/Offer.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await Student.findOne({ userId: req.user._id });
    successResponse(res, 200, 'Profile fetched', profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updateData = req.body;
    let profile = await Student.findOne({ userId: req.user._id });

    if (profile) {
      profile = await Student.findOneAndUpdate(
        { userId: req.user._id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      updateData.userId = req.user._id;
      profile = await Student.create(updateData);
    }
    
    // Recalculate profile completion
    const requiredFields = ['rollNumber', 'phone', 'college', 'branch', 'cgpa', 'graduationYear'];
    let filled = 0;
    requiredFields.forEach(field => {
      if (profile[field]) filled++;
    });
    profile.profileCompleted = Math.round((filled / requiredFields.length) * 100);
    await profile.save();

    successResponse(res, 200, 'Profile updated successfully', profile);
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'Please upload a file');
    }
    
    let profile = await Student.findOne({ userId: req.user._id });
    if (!profile) {
      return errorResponse(res, 404, 'Profile not found. Please create profile first.');
    }

    profile.resume = req.file.path; // Cloudinary URL
    await profile.save();
    
    successResponse(res, 200, 'Resume uploaded successfully', { resume: profile.resume });
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 404, 'Student profile not found');
    
    const applications = await Application.find({ studentId: student._id }).populate('driveId');
    successResponse(res, 200, 'Applications fetched', applications);
  } catch (error) {
    next(error);
  }
};

export const getMyInterviews = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 404, 'Student profile not found');
    
    const applications = await Application.find({ studentId: student._id });
    const appIds = applications.map(app => app._id);
    
    const interviews = await Interview.find({ applicationId: { $in: appIds } }).populate({
      path: 'applicationId',
      populate: { path: 'driveId' }
    });
    
    successResponse(res, 200, 'Interviews fetched', interviews);
  } catch (error) {
    next(error);
  }
};

export const getMyOffers = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return errorResponse(res, 404, 'Student profile not found');
    
    const offers = await Offer.find({ studentId: student._id }).populate('applicationId');
    successResponse(res, 200, 'Offers fetched', offers);
  } catch (error) {
    next(error);
  }
};
