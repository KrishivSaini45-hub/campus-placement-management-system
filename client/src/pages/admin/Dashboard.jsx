import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle>Total Students</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats?.totalStudents}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Companies</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats?.totalCompanies}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Active Drives</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats?.activeDrives}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Applications</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats?.totalApplications}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Students Placed</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-green-600">{stats?.studentsPlaced}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Placement Rate</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-blue-600">{stats?.placementRate}%</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Applications by Status</CardTitle></CardHeader>
        <CardContent className="h-72">
          {stats?.applicationsByStatus?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.applicationsByStatus}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">No application data available.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
