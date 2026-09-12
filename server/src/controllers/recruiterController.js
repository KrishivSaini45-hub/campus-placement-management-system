import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createCompany = async (req, res, next) => {
  try {
    const existing = await Company.findOne({ recruiterId: req.user._id });
    if (existing) {
      return errorResponse(res, 400, 'You already have a company profile');
    }
    const company = await Company.create({ ...req.body, recruiterId: req.user._id });
    successResponse(res, 201, 'Company profile created', company);
  } catch (error) {
    next(error);
  }
};

export const getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiterId: req.user._id });
    if (!company) return errorResponse(res, 404, 'Company not found');
    successResponse(res, 200, 'Company fetched', company);
  } catch (error) {
    next(error);
  }
};

export const createDrive = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiterId: req.user._id });
    if (!company) return errorResponse(res, 404, 'You must create a company profile first');
    if (!company.approved) return errorResponse(res, 403, 'Your company is pending admin approval');
    
    const drive = await PlacementDrive.create({ ...req.body, companyId: company._id });
    successResponse(res, 201, 'Placement drive created and pending approval', drive);
  } catch (error) {
    next(error);
  }
};

export const getMyDrives = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiterId: req.user._id });
    if (!company) return successResponse(res, 200, 'No drives', []);
    const drives = await PlacementDrive.find({ companyId: company._id });
    successResponse(res, 200, 'Drives fetched', drives);
  } catch (error) {
    next(error);
  }
};
