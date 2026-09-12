import mongoose from 'mongoose';

const placementDriveSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
    },
    location: {
      type: String,
    },
    jobType: {
      type: String, // e.g., Full-time, Internship
    },
    minimumCGPA: {
      type: Number,
      required: true,
    },
    maximumBacklogs: {
      type: Number,
      required: true,
    },
    allowedBranches: {
      type: [String],
      required: true,
    },
    graduationYears: {
      type: [Number],
      required: true,
    },
    requiredSkills: {
      type: [String],
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending Approval', 'Active', 'Completed', 'Cancelled'],
      default: 'Pending Approval',
    },
  },
  { timestamps: true }
);

const PlacementDrive = mongoose.model('PlacementDrive', placementDriveSchema);
export default PlacementDrive;
