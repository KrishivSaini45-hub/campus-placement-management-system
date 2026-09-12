import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    round: {
      type: String,
      enum: ['Online Assessment', 'Technical Interview', 'HR Interview', 'Final Interview'],
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline'],
      required: true,
    },
    meetingLink: {
      type: String, // Or physical location
    },
    interviewer: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    result: {
      type: String,
      enum: ['Pending', 'Passed', 'Failed'],
      default: 'Pending',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
