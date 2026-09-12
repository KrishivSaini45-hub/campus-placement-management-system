import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    shortlisted: 0,
    upcomingInterviews: 0,
    offers: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviewsList, setUpcomingInterviewsList] = useState([]);
  const [activeDrives, setActiveDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profRes, appsRes, intRes, offRes, drivesRes] = await Promise.all([
          api.get('/students/profile'),
          api.get('/students/applications'),
          api.get('/students/interviews'),
          api.get('/students/offers'),
          api.get('/drives')
        ]);

        const profileData = profRes.data.data;
        const appsData = appsRes.data.data;
        const intData = intRes.data.data;
        const offData = offRes.data.data;
        const drivesData = drivesRes.data.data;

        setProfile(profileData);
        setStats({
          totalApplications: appsData.length,
          shortlisted: appsData.filter(a => ['Shortlisted', 'Interview Scheduled', 'Selected'].includes(a.status)).length,
          upcomingInterviews: intData.filter(i => i.status === 'Scheduled').length,
          offers: offData.length
        });

        setRecentApplications(appsData.slice(0, 3));
        setUpcomingInterviewsList(intData.filter(i => i.status === 'Scheduled').slice(0, 2));
        setActiveDrives(drivesData.slice(0, 3));

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusVariant = (status) => {
    switch(status) {
      case 'Selected': return 'success';
      case 'Rejected': return 'destructive';
      case 'Shortlisted':
      case 'Interview Scheduled': return 'warning';
      default: return 'outline';
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
        <div className="text-sm text-gray-500">
          Profile Completion: <span className="font-bold text-blue-600">{profile?.profileCompleted || 0}%</span>
        </div>
      </div>
      
      {/* Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-800">Total Applications</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-blue-900">{stats.totalApplications}</div></CardContent>
        </Card>
        <Card className="bg-orange-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-orange-800">Shortlisted</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-orange-900">{stats.shortlisted}</div></CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-purple-800">Upcoming Interviews</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-purple-900">{stats.upcomingInterviews}</div></CardContent>
        </Card>
        <Card className="bg-green-50">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-green-800">Job Offers</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-900">{stats.offers}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Interviews */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Upcoming Interviews</CardTitle>
              <Link to="/student/interviews"><Button variant="ghost" size="sm">View All</Button></Link>
            </CardHeader>
            <CardContent>
              {upcomingInterviewsList.length === 0 ? (
                <div className="text-gray-500 text-sm py-4">No upcoming interviews scheduled.</div>
              ) : (
                <div className="space-y-4">
                  {upcomingInterviewsList.map(int => (
                    <div key={int._id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-semibold">{int.applicationId?.driveId?.jobTitle}</div>
                        <div className="text-sm text-gray-500">{int.round}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{new Date(int.scheduledAt).toLocaleString()}</div>
                        <div className="text-xs text-blue-600 mt-1"><a href={int.meetingLink} target="_blank" rel="noreferrer">Join Meeting</a></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Applications</CardTitle>
              <Link to="/student/applications"><Button variant="ghost" size="sm">View All</Button></Link>
            </CardHeader>
            <CardContent>
              {recentApplications.length === 0 ? (
                <div className="text-gray-500 text-sm py-4">You haven't applied to any drives yet.</div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map(app => (
                    <div key={app._id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-semibold">{app.driveId?.companyId?.name}</div>
                        <div className="text-sm text-gray-500">{app.driveId?.jobTitle}</div>
                      </div>
                      <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Active Drives Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Active Drives</CardTitle>
              <Link to="/student/drives"><Button variant="ghost" size="sm">View All</Button></Link>
            </CardHeader>
            <CardContent>
              {activeDrives.length === 0 ? (
                <div className="text-gray-500 text-sm py-4">No active drives available right now.</div>
              ) : (
                <div className="space-y-4">
                  {activeDrives.map(drive => (
                    <div key={drive._id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="font-semibold">{drive.companyId?.name}</div>
                      <div className="text-sm">{drive.jobTitle}</div>
                      <div className="text-xs text-gray-500 mt-1">Package: {drive.salary}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
