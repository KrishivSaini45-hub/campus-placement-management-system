import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

export default function InterviewsOffers() {
  const [interviews, setInterviews] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [intRes, offRes] = await Promise.all([
        api.get('/students/interviews'),
        api.get('/students/offers')
      ]);
      setInterviews(intRes.data.data);
      setOffers(offRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferStatus = async (id, status) => {
    try {
      await api.put(`/offers/${id}/status`, { status });
      fetchData(); // refresh
    } catch (error) {
      alert('Failed to update offer');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Interviews Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming Interviews</h2>
        {interviews.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-gray-500">No scheduled interviews.</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map(int => (
              <Card key={int._id}>
                <CardHeader>
                  <CardTitle>{int.applicationId?.driveId?.jobTitle} - {int.round}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Date:</strong> {new Date(int.scheduledAt).toLocaleString()}</div>
                  <div><strong>Mode:</strong> {int.mode}</div>
                  <div><strong>Link/Location:</strong> {int.meetingLink}</div>
                  <div><strong>Status:</strong> <Badge>{int.status}</Badge></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Offers Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Job Offers</h2>
        {offers.length === 0 ? (
          <Card><CardContent className="p-6 text-center text-gray-500">No offers received yet.</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map(offer => (
              <Card key={offer._id}>
                <CardHeader>
                  <CardTitle>{offer.jobTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Salary:</strong> {offer.salary}</div>
                  <div><strong>Location:</strong> {offer.location}</div>
                  <div><strong>Joining Date:</strong> {new Date(offer.joiningDate).toLocaleDateString()}</div>
                  <div className="flex items-center justify-between mt-4">
                    <strong>Status:</strong> 
                    <Badge variant={offer.status === 'Accepted' ? 'success' : offer.status === 'Declined' ? 'destructive' : 'warning'}>
                      {offer.status}
                    </Badge>
                  </div>
                  {offer.status === 'Pending' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Button onClick={() => handleOfferStatus(offer._id, 'Accepted')} className="flex-1" variant="default">Accept</Button>
                      <Button onClick={() => handleOfferStatus(offer._id, 'Declined')} className="flex-1" variant="destructive">Decline</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
