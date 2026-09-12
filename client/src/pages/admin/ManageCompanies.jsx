import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/admin/companies');
      setCompanies(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, approved) => {
    try {
      await api.put(`/admin/companies/${id}/status`, { approved });
      fetchCompanies();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manage Companies</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium">Company Name</th>
                  <th className="p-4 font-medium">Industry</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Recruiter</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => (
                  <tr key={company._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{company.name}</td>
                    <td className="p-4">{company.industry}</td>
                    <td className="p-4">{company.location}</td>
                    <td className="p-4">{company.recruiterId?.name} ({company.recruiterId?.email})</td>
                    <td className="p-4"><Badge variant={company.approved ? 'success' : 'warning'}>{company.approved ? 'Approved' : 'Pending'}</Badge></td>
                    <td className="p-4 space-x-2">
                      {!company.approved && <Button size="sm" onClick={() => updateStatus(company._id, true)}>Approve</Button>}
                      {company.approved && <Button size="sm" variant="destructive" onClick={() => updateStatus(company._id, false)}>Revoke</Button>}
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
