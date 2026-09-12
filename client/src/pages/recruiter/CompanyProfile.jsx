import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

export default function CompanyProfile() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    location: '',
  });

  const [message, setMessage] = useState('');
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get('/recruiters/company');
        if (res.data.data) {
          setFormData(res.data.data);
          setIsExisting(true);
        }
      } catch (error) {
        // Not found is fine
      }
    };
    fetchCompany();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isExisting) {
        // Assume update functionality if needed (currently backend only has create)
        setMessage('Company already registered.');
      } else {
        await api.post('/recruiters/company', formData);
        setMessage('Company registered successfully.');
        setIsExisting(true);
      }
    } catch (err) {
      setMessage('Failed to register company.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && <div className="text-sm font-medium text-green-600 mb-4">{message}</div>}
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={isExisting} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea 
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                rows="4" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                disabled={isExisting} 
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} disabled={isExisting} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} disabled={isExisting} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} disabled={isExisting} />
            </div>
            {!isExisting && <Button type="submit">Create Profile</Button>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
