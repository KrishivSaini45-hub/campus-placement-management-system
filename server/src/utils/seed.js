import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Offer from '../models/Offer.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    // Clear db
    await User.deleteMany();
    await Student.deleteMany();
    await Company.deleteMany();
    await PlacementDrive.deleteMany();
    await Application.deleteMany();
    await Interview.deleteMany();
    await Offer.deleteMany();

    // Users
    const createdAdmin = await User.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin',
    });

    const recruiterTechCorp = await User.create({
      name: 'John Recruiter',
      email: 'recruiter@techcorp.com',
      password: 'password123',
      role: 'recruiter',
    });

    const recruiterCisco = await User.create({
      name: 'Sarah Cisco',
      email: 'recruiter@cisco.com',
      password: 'password123',
      role: 'recruiter',
    });

    const recruiterMicrosoft = await User.create({
      name: 'Mike MSFT',
      email: 'recruiter@microsoft.com',
      password: 'password123',
      role: 'recruiter',
    });

    const createdStudent = await User.create({
      name: 'Alice Student',
      email: 'student@college.edu',
      password: 'password123',
      role: 'student',
    });

    // Student Profile
    const studentProfile = await Student.create({
      userId: createdStudent._id,
      rollNumber: 'CS2027001',
      college: 'Engineering College',
      branch: 'ECE', // Branch: ECE
      cgpa: 8.43,    // CGPA: 8.43
      graduationYear: 2027, // Grad Year: 2027
      backlogs: 0,
      skills: ['C++', 'Python', 'Networking', 'React'],
      profileCompleted: 100,
    });

    // Companies
    const companyTechCorp = await Company.create({
      name: 'TechCorp',
      description: 'A leading tech company',
      website: 'https://techcorp.com',
      industry: 'Software',
      location: 'Bangalore',
      recruiterId: recruiterTechCorp._id,
      approved: true,
    });

    const companyCisco = await Company.create({
      name: 'Cisco',
      description: 'Networking and cybersecurity solutions.',
      website: 'https://cisco.com',
      industry: 'Networking',
      location: 'Pune',
      recruiterId: recruiterCisco._id,
      approved: true,
    });

    const companyMicrosoft = await Company.create({
      name: 'Microsoft',
      description: 'Empowering every person on the planet.',
      website: 'https://microsoft.com',
      industry: 'Software',
      location: 'Hyderabad',
      recruiterId: recruiterMicrosoft._id,
      approved: true,
    });

    // Drives
    const driveTechCorp = await PlacementDrive.create({
      companyId: companyTechCorp._id,
      jobTitle: 'Software Engineer',
      description: 'Looking for full stack developers.',
      salary: '12 LPA',
      location: 'Bangalore',
      jobType: 'Full-time',
      minimumCGPA: 8.0,
      maximumBacklogs: 0,
      allowedBranches: ['CSE', 'ECE', 'ISE'], // ECE allowed, eligible
      graduationYears: [2027], // Eligible
      requiredSkills: ['JavaScript'],
      applicationDeadline: new Date(Date.now() + 30 * 86400000), // 30 days from now
      status: 'Active',
    });

    const driveCisco = await PlacementDrive.create({
      companyId: companyCisco._id,
      jobTitle: 'Network Engineer Intern',
      description: 'Join our elite networking team.',
      salary: '50K/month',
      location: 'Pune',
      jobType: 'Internship',
      minimumCGPA: 7.5,
      maximumBacklogs: 1,
      allowedBranches: ['ECE', 'EEE'], // Eligible
      graduationYears: [2027],
      requiredSkills: ['Networking', 'C++'],
      applicationDeadline: new Date(Date.now() + 15 * 86400000), // 15 days from now
      status: 'Active',
    });

    const driveMicrosoft = await PlacementDrive.create({
      companyId: companyMicrosoft._id,
      jobTitle: 'SDE Intern',
      description: 'Build the future of cloud computing.',
      salary: '1.2 Lakhs/month',
      location: 'Hyderabad',
      jobType: 'Internship',
      minimumCGPA: 8.5, // 8.5 > 8.43 (Student is INELIGIBLE)
      maximumBacklogs: 0,
      allowedBranches: ['CSE', 'ECE'],
      graduationYears: [2027],
      requiredSkills: ['C++', 'Python'],
      applicationDeadline: new Date(Date.now() + 60 * 86400000), // 60 days from now
      status: 'Active',
    });

    // Applications & Workflows
    
    // 1. TechCorp - Selected & Offered (Past Interview)
    const appTechCorp = await Application.create({
      studentId: studentProfile._id,
      driveId: driveTechCorp._id,
      status: 'Selected',
      appliedAt: new Date(Date.now() - 20 * 86400000), // 20 days ago
    });

    await Interview.create({
      applicationId: appTechCorp._id,
      round: 'Technical Interview',
      scheduledAt: new Date(Date.now() - 10 * 86400000), // 10 days ago (Past)
      mode: 'Online',
      meetingLink: 'https://meet.google.com/xyz-abcd-efg',
      interviewer: 'Jane Doe',
      status: 'Completed',
      result: 'Passed',
    });

    await Offer.create({
      applicationId: appTechCorp._id,
      studentId: studentProfile._id,
      jobTitle: 'Software Engineer',
      salary: '12 LPA',
      joiningDate: new Date('2027-07-01'), // Future joining date
      location: 'Bangalore',
      status: 'Pending',
    });

    // 2. Cisco - Interview Scheduled (Future Interview)
    const appCisco = await Application.create({
      studentId: studentProfile._id,
      driveId: driveCisco._id,
      status: 'Interview Scheduled',
      appliedAt: new Date(Date.now() - 5 * 86400000), // 5 days ago
    });

    await Interview.create({
      applicationId: appCisco._id,
      round: 'HR Interview',
      scheduledAt: new Date(Date.now() + 5 * 86400000), // 5 days in future (Scheduled)
      mode: 'Online',
      meetingLink: 'https://webex.com/cisco/interview',
      interviewer: 'Tom Smith',
      status: 'Scheduled',
      result: 'Pending',
    });

    // Note: Microsoft - Not applied because student is ineligible (CGPA < 8.5).
    // Let's create an application for a different fake drive to show a Rejected state.
    const driveStartup = await PlacementDrive.create({
      companyId: companyTechCorp._id, // Just reuse techcorp company
      jobTitle: 'QA Tester',
      description: 'Quality assurance role',
      salary: '6 LPA',
      location: 'Remote',
      jobType: 'Full-time',
      minimumCGPA: 6.0,
      maximumBacklogs: 2,
      allowedBranches: ['ECE'],
      graduationYears: [2027],
      applicationDeadline: new Date(Date.now() - 10 * 86400000), // Deadline passed
      status: 'Completed',
    });

    await Application.create({
      studentId: studentProfile._id,
      driveId: driveStartup._id,
      status: 'Rejected',
      appliedAt: new Date(Date.now() - 30 * 86400000), // 30 days ago
    });

    console.log('Data Imported successfully and consistently!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
