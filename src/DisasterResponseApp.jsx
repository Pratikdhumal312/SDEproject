// src/DisasterResponseApp.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const socket = io('http://localhost:5000'); // Adjust to your backend URL

export default function DisasterResponseApp() {
  const [disasters, setDisasters] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [tags, setTags] = useState('');
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchDisasters();
    socket.on('disaster_updated', fetchDisasters);
    socket.on('social_media_updated', fetchReports);
    return () => {
      socket.off('disaster_updated');
      socket.off('social_media_updated');
    }
  }, []);

  const fetchDisasters = async () => {
    const res = await fetch('http://localhost:5000/disasters');
    const data = await res.json();
    setDisasters(data);
  };

  const fetchReports = async () => {
    const res = await fetch('http://localhost:5000/mock-social-media');
    const data = await res.json();
    setReports(data);
  };

  const handleSubmit = async () => {
    await fetch('http://localhost:5000/disasters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        location_name: locationName,
        tags: tags.split(','),
        owner_id: 'netrunnerX'
      })
    });
    setTitle('');
    setDescription('');
    setLocationName('');
    setTags('');
  };

  const submitReport = async (disasterId) => {
    await fetch(`http://localhost:5000/disasters/${disasterId}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'citizen1',
        content: newReport,
        image_url: imageUrl,
        verification_status: 'pending'
      })
    });
    setNewReport('');
    setImageUrl('');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Disaster Response Coordination Platform</h1>

      <Card className="mb-6 p-4">
        <h2 className="text-xl font-semibold mb-2">Create Disaster</h2>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-2" />
        <Input placeholder="Location Name" value={locationName} onChange={(e) => setLocationName(e.target.value)} className="mb-2" />
        <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="mb-2" />
        <Input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="mb-2" />
        <Button onClick={handleSubmit}>Submit</Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {disasters.map((d) => (
          <Card key={d.id} className="p-4 bg-white">
            <CardContent>
              <h3 className="text-lg font-bold mb-2">{d.title}</h3>
              <p><strong>Location:</strong> {d.location_name}</p>
              <p><strong>Description:</strong> {d.description}</p>
              <p><strong>Tags:</strong> {d.tags?.join(', ')}</p>

              <div className="mt-4">
                <Input placeholder="Report content" value={newReport} onChange={(e) => setNewReport(e.target.value)} className="mb-2" />
                <Input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mb-2" />
                <Button onClick={() => submitReport(d.id)}>Submit Report</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-4">
        <h2 className="text-xl font-semibold mb-2">Social Media Reports</h2>
        {reports.map((r, i) => (
          <div key={i} className="border-b py-2">
            <p><strong>{r.user}:</strong> {r.post}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}