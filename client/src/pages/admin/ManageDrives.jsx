import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

export default function ManageDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/admin/drives');
      setDrives(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/drives/${id}/status`, { status });
      fetchDrives();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Drives</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Job Title</th>
                  <th className="p-4 font-medium">Package</th>
                  <th className="p-4 font-medium">Deadline</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drives.map(drive => (
                  <tr key={drive._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{drive.companyId?.name}</td>
                    <td className="p-4">{drive.jobTitle}</td>
                    <td className="p-4">{drive.salary}</td>
                    <td className="p-4">{new Date(drive.applicationDeadline).toLocaleDateString()}</td>
                    <td className="p-4"><Badge variant={drive.status === 'Active' ? 'success' : drive.status === 'Pending Approval' ? 'warning' : 'secondary'}>{drive.status}</Badge></td>
                    <td className="p-4 space-x-2">
                      {drive.status === 'Pending Approval' && (
                        <>
                          <Button size="sm" onClick={() => updateStatus(drive._id, 'Active')}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => updateStatus(drive._id, 'Cancelled')}>Reject</Button>
                        </>
                      )}
                      {drive.status === 'Active' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(drive._id, 'Completed')}>Mark Completed</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
