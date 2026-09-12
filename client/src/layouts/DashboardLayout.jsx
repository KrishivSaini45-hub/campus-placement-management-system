import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = {
    student: [
      { name: 'Dashboard', path: '/student/dashboard' },
      { name: 'My Profile', path: '/student/profile' },
      { name: 'Placement Drives', path: '/student/drives' },
      { name: 'Applications', path: '/student/applications' },
      { name: 'Interviews & Offers', path: '/student/interviews' },
    ],
    recruiter: [
      { name: 'Dashboard', path: '/recruiter/dashboard' },
      { name: 'Company Profile', path: '/recruiter/company' },
      { name: 'Manage Drives', path: '/recruiter/drives' },
      { name: 'Applicants', path: '/recruiter/applicants' },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Manage Users', path: '/admin/users' },
      { name: 'Manage Companies', path: '/admin/companies' },
      { name: 'Manage Drives', path: '/admin/drives' },
    ],
  };

  const links = navLinks[user?.role] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Placement Portal</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <div>
            <span className="text-gray-600">Welcome, </span>
            <span className="font-semibold">{user?.name}</span>
            <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full uppercase">
              {user?.role}
            </span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
