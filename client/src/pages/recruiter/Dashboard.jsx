import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import api from '../../services/api';

export default function Dashboard() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const drivesRes = await api.get('/recruiters/drives');
        setDrives(drivesRes.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Recruiter Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Drives</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{drives.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Drives</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {drives.filter(d => d.status === 'Active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Drives</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {drives.filter(d => d.status === 'Pending Approval').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
