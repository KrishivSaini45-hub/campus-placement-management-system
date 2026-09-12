import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import api from '../../services/api';

export default function Applicants() {
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [interviewModal, setInterviewModal] = useState(null);
  const [offerModal, setOfferModal] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await api.get('/recruiters/drives');
      setDrives(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedDrive(res.data.data[0]._id);
        fetchApplicants(res.data.data[0]._id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (driveId) => {
    try {
      const res = await api.get(`/applications/drive/${driveId}`);
      setApplicants(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDriveChange = (e) => {
    setSelectedDrive(e.target.value);
    fetchApplicants(e.target.value);
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      fetchApplicants(selectedDrive);
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/interviews', interviewModal);
      alert('Interview scheduled!');
      setInterviewModal(null);
      fetchApplicants(selectedDrive);
    } catch (error) {
      alert('Failed to schedule interview');
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/offers', offerModal);
      alert('Offer created!');
      setOfferModal(null);
      fetchApplicants(selectedDrive);
    } catch (error) {
      alert('Failed to create offer');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applicants</h2>
        <select 
          className="h-10 rounded-md border border-input bg-white px-3 py-2 text-sm"
          value={selectedDrive}
          onChange={handleDriveChange}
        >
          {drives.map(d => <option key={d._id} value={d._id}>{d.jobTitle}</option>)}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium">Student Name</th>
                  <th className="p-4 font-medium">Branch</th>
                  <th className="p-4 font-medium">CGPA</th>
                  <th className="p-4 font-medium">Applied Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.length === 0 ? (
                  <tr><td colSpan="6" className="p-4 text-center text-gray-500">No applicants found.</td></tr>
                ) : (
                  applicants.map(app => (
                    <tr key={app._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{app.studentId?.rollNumber}</td>
                      <td className="p-4">{app.studentId?.branch}</td>
                      <td className="p-4">{app.studentId?.cgpa}</td>
                      <td className="p-4">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="p-4"><Badge>{app.status}</Badge></td>
                      <td className="p-4 space-x-2">
                        {app.status === 'Applied' && (
                          <>
                            <Button size="sm" onClick={() => updateStatus(app._id, 'Shortlisted')}>Shortlist</Button>
                            <Button size="sm" variant="destructive" onClick={() => updateStatus(app._id, 'Rejected')}>Reject</Button>
                          </>
                        )}
                        {app.status === 'Shortlisted' && (
                          <Button size="sm" variant="outline" onClick={() => setInterviewModal({ applicationId: app._id, round: 'Technical Interview', mode: 'Online', scheduledAt: '', meetingLink: '' })}>
                            Schedule Interview
                          </Button>
                        )}
                        {app.status === 'Interview Scheduled' && (
                          <Button size="sm" variant="outline" onClick={() => setOfferModal({ applicationId: app._id, jobTitle: 'SDE', salary: '', joiningDate: '', location: '' })}>
                            Issue Offer
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interview Modal */}
      {interviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader><CardTitle>Schedule Interview</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleScheduleInterview} className="space-y-4">
                <div className="space-y-2">
                  <Label>Round</Label>
                  <Input value={interviewModal.round} onChange={e => setInterviewModal({...interviewModal, round: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Date & Time</Label>
                  <Input type="datetime-local" value={interviewModal.scheduledAt} onChange={e => setInterviewModal({...interviewModal, scheduledAt: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <select className="flex h-10 w-full rounded-md border px-3" value={interviewModal.mode} onChange={e => setInterviewModal({...interviewModal, mode: e.target.value})}>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Meeting Link / Location</Label>
                  <Input value={interviewModal.meetingLink} onChange={e => setInterviewModal({...interviewModal, meetingLink: e.target.value})} required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Schedule</Button>
                  <Button variant="outline" type="button" onClick={() => setInterviewModal(null)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Offer Modal */}
      {offerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader><CardTitle>Issue Offer</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreateOffer} className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input value={offerModal.jobTitle} onChange={e => setOfferModal({...offerModal, jobTitle: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Salary/Package</Label>
                  <Input value={offerModal.salary} onChange={e => setOfferModal({...offerModal, salary: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Joining Date</Label>
                  <Input type="date" value={offerModal.joiningDate} onChange={e => setOfferModal({...offerModal, joiningDate: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={offerModal.location} onChange={e => setOfferModal({...offerModal, location: e.target.value})} required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Issue Offer</Button>
                  <Button variant="outline" type="button" onClick={() => setOfferModal(null)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
