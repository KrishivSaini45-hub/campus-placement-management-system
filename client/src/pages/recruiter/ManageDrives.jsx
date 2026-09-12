import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';

export default function ManageDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    description: '',
    salary: '',
    location: '',
    jobType: 'Full-time',
    minimumCGPA: '',
    maximumBacklogs: '',
    allowedBranches: '',
    graduationYears: '',
    applicationDeadline: '',
  });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/recruiters/drives');
      setDrives(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        minimumCGPA: Number(formData.minimumCGPA),
        maximumBacklogs: Number(formData.maximumBacklogs),
        allowedBranches: formData.allowedBranches.split(',').map(s => s.trim()),
        graduationYears: formData.graduationYears.split(',').map(s => Number(s.trim())),
      };
      await api.post('/recruiters/drives', payload);
      alert('Drive created and pending approval');
      setIsCreating(false);
      fetchDrives();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create drive');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Drives</h2>
        <Button onClick={() => setIsCreating(true)}>Create New Drive</Button>
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create Placement Drive</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input required value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={formData.jobType} onChange={e => setFormData({...formData, jobType: e.target.value})}>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Salary/Package</Label>
                  <Input required value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Minimum CGPA</Label>
                  <Input required type="number" step="0.01" value={formData.minimumCGPA} onChange={e => setFormData({...formData, minimumCGPA: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Backlogs</Label>
                  <Input required type="number" value={formData.maximumBacklogs} onChange={e => setFormData({...formData, maximumBacklogs: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Allowed Branches (comma separated)</Label>
                  <Input required placeholder="CSE, ECE" value={formData.allowedBranches} onChange={e => setFormData({...formData, allowedBranches: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Graduation Years (comma separated)</Label>
                  <Input required placeholder="2024, 2025" value={formData.graduationYears} onChange={e => setFormData({...formData, graduationYears: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <textarea required className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Application Deadline</Label>
                  <Input required type="date" value={formData.applicationDeadline} onChange={e => setFormData({...formData, applicationDeadline: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {drives.map(drive => (
          <Card key={drive._id}>
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <h3 className="font-bold text-lg">{drive.jobTitle}</h3>
                <div className="text-sm text-gray-500">Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}</div>
              </div>
              <div>
                <Badge variant={drive.status === 'Active' ? 'success' : drive.status === 'Pending Approval' ? 'warning' : 'secondary'}>
                  {drive.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
