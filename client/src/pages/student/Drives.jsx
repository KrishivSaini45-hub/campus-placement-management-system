import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';

export default function Drives() {
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [checking, setChecking] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [drivesRes, appsRes] = await Promise.all([
        api.get('/drives'),
        api.get('/students/applications')
      ]);
      setDrives(drivesRes.data.data);
      setApplications(appsRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async (driveId) => {
    setChecking(true);
    setEligibility(null);
    try {
      const res = await api.get(`/applications/${driveId}/eligibility`);
      setEligibility(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

  const handleApply = async (driveId) => {
    setApplying(true);
    try {
      const res = await api.post('/applications', { driveId });
      alert('Application submitted successfully!');
      
      // Update local state to reflect the new application immediately
      setApplications(prev => [...prev, res.data.data]);
      
    } catch (error) {
      // Handle potential duplicate or generic errors gracefully
      const backendMessage = error.response?.data?.message || 'Failed to apply';
      if (backendMessage.includes('Duplicate')) {
        alert('You have already applied to this placement drive.');
      } else {
        alert(backendMessage);
      }
    } finally {
      setApplying(false);
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

  if (loading) return <div className="p-8">Loading drives...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Active Placement Drives</h2>
      
      {drives.length === 0 ? (
        <Card><CardContent className="p-6 text-center text-gray-500">No active drives available.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drives.map(drive => {
            const existingApplication = applications.find(app => 
              (app.driveId?._id || app.driveId) === drive._id
            );

            return (
              <Card 
                key={drive._id} 
                className="cursor-pointer hover:shadow-md transition-shadow relative" 
                onClick={() => { setSelectedDrive(drive); setEligibility(null); }}
              >
                {existingApplication && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">Applied</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="pr-16">{drive.companyId?.name}</CardTitle>
                  <div className="text-sm text-gray-500 font-medium">{drive.jobTitle}</div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Salary:</span>
                    <span className="font-medium">{drive.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{drive.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deadline:</span>
                    <span className="font-medium">{new Date(drive.applicationDeadline).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="outline" className="mt-2">{drive.jobType}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal for Drive Details */}
      {selectedDrive && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-xl">{selectedDrive.companyId?.name}</CardTitle>
                <div className="text-gray-500">{selectedDrive.jobTitle}</div>
              </div>
              <button onClick={() => setSelectedDrive(null)} className="text-gray-400 hover:text-black absolute top-4 right-4 text-2xl leading-none">&times;</button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedDrive.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Min CGPA:</span> {selectedDrive.minimumCGPA}</div>
                <div><span className="font-semibold">Max Backlogs:</span> {selectedDrive.maximumBacklogs}</div>
                <div><span className="font-semibold">Branches:</span> {selectedDrive.allowedBranches.join(', ')}</div>
                <div><span className="font-semibold">Batch:</span> {selectedDrive.graduationYears.join(', ')}</div>
              </div>

              <div className="border-t pt-4">
                {(() => {
                  const existingApplication = applications.find(app => 
                    (app.driveId?._id || app.driveId) === selectedDrive._id
                  );

                  if (existingApplication) {
                    return (
                      <div className="space-y-3 bg-gray-50 p-4 rounded-md border border-gray-100">
                        <div className="flex items-center gap-2 text-green-700 font-semibold">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Already Applied
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Current Status:</span>
                          <Badge variant={getStatusVariant(existingApplication.status)}>
                            {existingApplication.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  }

                  if (!eligibility) {
                    return (
                      <Button 
                        onClick={() => handleCheckEligibility(selectedDrive._id)} 
                        disabled={checking} 
                        className="w-full"
                      >
                        {checking ? 'Checking...' : 'Check Eligibility'}
                      </Button>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      <div className="font-semibold">Eligibility Result</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span>CGPA ({eligibility.checks.cgpa.student} / {eligibility.checks.cgpa.required})</span>
                          <Badge variant={eligibility.checks.cgpa.passed ? 'success' : 'destructive'}>
                            {eligibility.checks.cgpa.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Backlogs ({eligibility.checks.backlogs.student} / {eligibility.checks.backlogs.maximum})</span>
                          <Badge variant={eligibility.checks.backlogs.passed ? 'success' : 'destructive'}>
                            {eligibility.checks.backlogs.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Branch ({eligibility.checks.branch.student || 'None'})</span>
                          <Badge variant={eligibility.checks.branch.passed ? 'success' : 'destructive'}>
                            {eligibility.checks.branch.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Batch ({eligibility.checks.graduationYear.student || 'None'})</span>
                          <Badge variant={eligibility.checks.graduationYear.passed ? 'success' : 'destructive'}>
                            {eligibility.checks.graduationYear.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleApply(selectedDrive._id)}
                        disabled={!eligibility.eligible || applying} 
                        className="w-full mt-4"
                        variant={eligibility.eligible ? 'default' : 'secondary'}
                      >
                        {applying ? 'Applying...' : (eligibility.eligible ? 'Apply Now' : 'Not Eligible')}
                      </Button>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
