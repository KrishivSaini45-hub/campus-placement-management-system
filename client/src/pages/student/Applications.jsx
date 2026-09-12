import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/students/applications');
      setApplications(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'Selected': return 'success';
      case 'Rejected': return 'destructive';
      case 'Shortlisted':
      case 'Interview Scheduled': return 'warning';
      default: return 'outline';
    }
  };

  if (loading) return <div>Loading applications...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Applications</h2>
      
      {applications.length === 0 ? (
        <Card><CardContent className="p-6 text-center text-gray-500">You haven't applied to any drives yet.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map(app => (
            <Card key={app._id}>
              <CardContent className="flex justify-between items-center p-6">
                <div>
                  <h3 className="font-bold text-lg">{app.driveId?.companyId?.name || 'Company'}</h3>
                  <div className="text-gray-600">{app.driveId?.jobTitle}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusVariant(app.status)} className="text-sm px-3 py-1">
                    {app.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
