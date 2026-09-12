import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

export default function Profile() {
  const [formData, setFormData] = useState({
    rollNumber: '',
    phone: '',
    college: '',
    branch: '',
    cgpa: '',
    graduationYear: '',
    backlogs: 0,
    skills: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/students/profile');
        if (res.data.data) {
          const data = res.data.data;
          setFormData({
            ...data,
            skills: data.skills.join(', '),
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      await api.put('/students/profile', payload);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && <div className="text-sm font-medium text-green-600 mb-4">{message}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Roll Number</Label>
                <Input value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>College</Label>
                <Input value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Input value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>CGPA</Label>
                <Input type="number" step="0.01" value={formData.cgpa} onChange={(e) => setFormData({...formData, cgpa: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Graduation Year</Label>
                <Input type="number" value={formData.graduationYear} onChange={(e) => setFormData({...formData, graduationYear: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Backlogs</Label>
                <Input type="number" value={formData.backlogs} onChange={(e) => setFormData({...formData, backlogs: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Skills (comma separated)</Label>
              <Input value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
            </div>
            <Button type="submit">Save Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
