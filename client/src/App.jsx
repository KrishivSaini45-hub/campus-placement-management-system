import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './layouts/DashboardLayout';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import Drives from './pages/student/Drives';
import Applications from './pages/student/Applications';
import InterviewsOffers from './pages/student/InterviewsOffers';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import CompanyProfile from './pages/recruiter/CompanyProfile';
import ManageDrives from './pages/recruiter/ManageDrives';
import Applicants from './pages/recruiter/Applicants';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCompanies from './pages/admin/ManageCompanies';
import AdminManageDrives from './pages/admin/ManageDrives';

function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/student" element={
          <PrivateRoute allowedRoles={['student']}>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="drives" element={<Drives />} />
          <Route path="applications" element={<Applications />} />
          <Route path="interviews" element={<InterviewsOffers />} />
        </Route>

        {/* Recruiter Routes */}
        <Route path="/recruiter" element={
          <PrivateRoute allowedRoles={['recruiter']}>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="company" element={<CompanyProfile />} />
          <Route path="drives" element={<ManageDrives />} />
          <Route path="applicants" element={<Applicants />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="companies" element={<ManageCompanies />} />
          <Route path="drives" element={<AdminManageDrives />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
