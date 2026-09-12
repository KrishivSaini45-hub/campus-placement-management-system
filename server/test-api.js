import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api';

const log = (msg) => console.log(`[TEST] ${msg}`);
const assert = (condition, msg) => {
  if (!condition) {
    console.error(`[FAIL] ${msg}`);
    throw new Error(msg);
  } else {
    console.log(`[PASS] ${msg}`);
  }
};

const runTests = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.collection('applications').deleteMany({});
    await mongoose.connection.db.collection('interviews').deleteMany({});
    await mongoose.connection.db.collection('offers').deleteMany({});

    // 1. Authentication
    log('Testing Authentication...');
    
    // Login Admin
    let res = await axios.post(`${API_URL}/auth/login`, { email: 'admin@college.edu', password: 'password123' });
    const adminToken = res.data.data.token;
    assert(adminToken, 'Admin login returns JWT');
    
    // Login Recruiter
    res = await axios.post(`${API_URL}/auth/login`, { email: 'recruiter@techcorp.com', password: 'password123' });
    const recruiterToken = res.data.data.token;
    assert(recruiterToken, 'Recruiter login returns JWT');
    
    // Login Student
    res = await axios.post(`${API_URL}/auth/login`, { email: 'student@college.edu', password: 'password123' });
    const studentToken = res.data.data.token;
    assert(studentToken, 'Student login returns JWT');
    assert(!res.data.data.password, 'Password hash is NOT returned');

    // 2. Security / Authorization
    log('Testing Security & Authorization...');
    try {
      await axios.get(`${API_URL}/admin/dashboard`, { headers: { Authorization: `Bearer ${studentToken}` } });
      assert(false, 'Student should not access admin endpoint');
    } catch (e) {
      assert(e.response.status === 403, 'Student blocked from admin endpoint with 403');
    }
    
    try {
      await axios.get(`${API_URL}/admin/dashboard`, { headers: { Authorization: `Bearer ${recruiterToken}` } });
      assert(false, 'Recruiter should not access admin endpoint');
    } catch (e) {
      assert(e.response.status === 403, 'Recruiter blocked from admin endpoint with 403');
    }

    try {
      await axios.get(`${API_URL}/admin/dashboard`);
      assert(false, 'Unauthenticated user should not access protected endpoints');
    } catch (e) {
      assert(e.response.status === 401, 'Unauthenticated user blocked with 401');
    }

    // 3. Student Workflow
    log('Testing Student Workflow...');
    res = await axios.get(`${API_URL}/students/profile`, { headers: { Authorization: `Bearer ${studentToken}` } });
    assert(res.data.data.rollNumber === 'CS2024001', 'Fetch student profile');
    
    res = await axios.put(`${API_URL}/students/profile`, { rollNumber: 'CS2024001', cgpa: 8.6, backlogs: 1 }, { headers: { Authorization: `Bearer ${studentToken}` } });
    assert(res.data.data.cgpa === 8.6, 'Update student profile');
    
    res = await axios.get(`${API_URL}/drives`, { headers: { Authorization: `Bearer ${studentToken}` } });
    assert(Array.isArray(res.data.data), 'Fetch available placement drives');
    const driveId = res.data.data[0]._id;
    
    // 4. Eligibility Engine
    log('Testing Eligibility Engine...');
    // Currently student cgpa 8.6, backlogs 1. Drive expects minimumCGPA 8.0, maximumBacklogs 0.
    res = await axios.get(`${API_URL}/applications/${driveId}/eligibility`, { headers: { Authorization: `Bearer ${studentToken}` } });
    let elig = res.data.data;
    assert(elig.eligible === false, 'Student correctly identified as ineligible due to backlogs');
    assert(elig.checks.backlogs.passed === false, 'Backlogs check correctly marked false');
    assert(elig.checks.cgpa.passed === true, 'CGPA check correctly marked true');

    // Try applying while ineligible
    try {
      await axios.post(`${API_URL}/applications`, { driveId }, { headers: { Authorization: `Bearer ${studentToken}` } });
      assert(false, 'Ineligible student applied successfully (should fail)');
    } catch (e) {
      assert(e.response.status === 403, 'Ineligible student prevented from applying');
    }
    
    // Fix student backlogs to be eligible
    await axios.put(`${API_URL}/students/profile`, { rollNumber: 'CS2024001', backlogs: 0 }, { headers: { Authorization: `Bearer ${studentToken}` } });
    res = await axios.get(`${API_URL}/applications/${driveId}/eligibility`, { headers: { Authorization: `Bearer ${studentToken}` } });
    assert(res.data.data.eligible === true, 'Student is now eligible');

    // Apply
    res = await axios.post(`${API_URL}/applications`, { driveId }, { headers: { Authorization: `Bearer ${studentToken}` } });
    assert(res.data.data._id, 'Applied to eligible drive successfully');
    
    // Prevent duplicate
    try {
      await axios.post(`${API_URL}/applications`, { driveId }, { headers: { Authorization: `Bearer ${studentToken}` } });
      assert(false, 'Duplicate application succeeded (should fail)');
    } catch (e) {
      assert(e.response.status === 400, 'Duplicate application prevented');
    }

    // 5. Recruiter Workflow
    log('Testing Recruiter Workflow...');
    res = await axios.get(`${API_URL}/recruiters/company`, { headers: { Authorization: `Bearer ${recruiterToken}` } });
    assert(res.data.data.name === 'TechCorp', 'Fetch company profile');
    
    // View applicants
    res = await axios.get(`${API_URL}/applications/drive/${driveId}`, { headers: { Authorization: `Bearer ${recruiterToken}` } });
    assert(res.data.data.length > 0, 'View applicants for drive');
    const appId = res.data.data[0]._id;
    
    // Shortlist applicant
    res = await axios.put(`${API_URL}/applications/${appId}/status`, { status: 'Shortlisted' }, { headers: { Authorization: `Bearer ${recruiterToken}` } });
    assert(res.data.data.status === 'Shortlisted', 'Shortlist an applicant');
    
    // Schedule interview
    res = await axios.post(`${API_URL}/interviews`, {
      applicationId: appId,
      round: 'Technical Interview',
      scheduledAt: new Date(Date.now() + 86400000),
      mode: 'Online',
      meetingLink: 'link',
      interviewer: 'John Doe'
    }, { headers: { Authorization: `Bearer ${recruiterToken}` } });
    const interviewId = res.data.data._id;
    assert(interviewId, 'Schedule an interview');
    
    // Update interview result
    res = await axios.put(`${API_URL}/interviews/${interviewId}`, { result: 'Passed', status: 'Completed' }, { headers: { Authorization: `Bearer ${recruiterToken}` } });
    assert(res.data.data.result === 'Passed', 'Update interview result');
    
    // Create offer
    res = await axios.post(`${API_URL}/offers`, {
      applicationId: appId,
      jobTitle: 'SDE',
      salary: '15 LPA',
      joiningDate: new Date('2026-07-01'),
      location: 'Bangalore'
    }, { headers: { Authorization: `Bearer ${recruiterToken}` } });
    assert(res.data.data._id, 'Create an offer');

    // 6. Admin Workflow
    log('Testing Admin Workflow...');
    res = await axios.get(`${API_URL}/admin/dashboard`, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.data.data.totalStudents >= 0, 'Fetch dashboard statistics');
    
    res = await axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(Array.isArray(res.data.data), 'View users');
    
    res = await axios.get(`${API_URL}/admin/companies`, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(Array.isArray(res.data.data), 'View companies');
    const compId = res.data.data[0]._id;
    
    res = await axios.put(`${API_URL}/admin/companies/${compId}/status`, { approved: false }, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.data.data.approved === false, 'Approve/reject companies');
    
    res = await axios.get(`${API_URL}/admin/drives`, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(Array.isArray(res.data.data), 'View placement drives');
    const dId = res.data.data[0]._id;
    
    res = await axios.put(`${API_URL}/admin/drives/${dId}/status`, { status: 'Completed' }, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert(res.data.data.status === 'Completed', 'Approve/reject placement drives');

    console.log('\n✅ ALL TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED');
    if (err.response) {
      console.error(err.response.data);
    } else {
      console.error(err);
    }
  }
};

runTests();
