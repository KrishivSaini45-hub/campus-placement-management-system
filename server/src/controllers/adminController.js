import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const activeDrives = await PlacementDrive.countDocuments({ status: 'Active' });
    const totalApplications = await Application.countDocuments();
    const studentsPlaced = await Application.countDocuments({ status: 'Selected' });
    
    const placementRate = totalStudents > 0 ? ((studentsPlaced / totalStudents) * 100).toFixed(2) : 0;
    
    // Some chart data placeholders
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    successResponse(res, 200, 'Stats fetched', {
      totalStudents,
      totalCompanies,
      activeDrives,
      totalApplications,
      studentsPlaced,
      placementRate,
      applicationsByStatus,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    successResponse(res, 200, 'Users fetched', users);
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found');
    user.isActive = !user.isActive;
    await user.save();
    successResponse(res, 200, 'User status updated', user);
  } catch (error) {
    next(error);
  }
};

export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().populate('recruiterId', 'name email');
    successResponse(res, 200, 'Companies fetched', companies);
  } catch (error) {
    next(error);
  }
};

export const updateCompanyStatus = async (req, res, next) => {
  try {
    const { approved } = req.body;
    const company = await Company.findByIdAndUpdate(req.params.id, { approved }, { new: true });
    successResponse(res, 200, 'Company status updated', company);
  } catch (error) {
    next(error);
  }
};

export const getAllDrives = async (req, res, next) => {
  try {
    const drives = await PlacementDrive.find().populate('companyId');
    successResponse(res, 200, 'Drives fetched', drives);
  } catch (error) {
    next(error);
  }
};

export const updateDriveStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, { status }, { new: true });
    successResponse(res, 200, 'Drive status updated', drive);
  } catch (error) {
    next(error);
  }
};
