import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout'; // Import added
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

export function MemberProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        try {
          const data = await api.member.getProfile(user.id);
          setProfile(data);
          setFormData({
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || ''
          });
        } catch (error) {
          console.error("Failed to load profile", error);
        }
      }
    };
    loadProfile();
  }, [user?.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      await api.member.updateProfile(user.id, formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      const updated = await api.member.getProfile(user.id);
      setProfile(updated);
    } catch (err: any) {
      setMessage(err.message || 'Update failed');
    }
  };

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="p-8 text-white animate-pulse">Loading profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-slate-400">Manage your personal information and contact details</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 flex flex-col items-center p-8">
            <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mb-4 border-2 border-slate-600">
              <User size={64} className="text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-white text-center">{profile.full_name}</h2>
            <p className="text-emerald-500 font-medium">{profile.current_plan || 'No Active Plan'}</p>
            <p className="text-slate-500 text-sm mt-2">Member ID: #{profile.member_id}</p>
          </Card>

          <Card title="Contact Information" className="md:col-span-2">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex items-center gap-4 p-2 rounded-lg bg-slate-800/50">
                <Mail className="text-emerald-500" size={20} />
                <div className="flex-1">
                  <label className="text-xs text-slate-500 uppercase font-semibold">Email Address</label>
                  {isEditing ? (
                    <input 
                      className="w-full bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  ) : (
                    <p className="text-white">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 p-2 rounded-lg bg-slate-800/50">
                <Phone className="text-emerald-500" size={20} />
                <div className="flex-1">
                  <label className="text-xs text-slate-500 uppercase font-semibold">Phone Number</label>
                  {isEditing ? (
                    <input 
                      className="w-full bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  ) : (
                    <p className="text-white">{profile.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-2 rounded-lg bg-slate-800/50">
                <MapPin className="text-emerald-500 mt-1" size={20} />
                <div className="flex-1">
                  <label className="text-xs text-slate-500 uppercase font-semibold">Residential Address</label>
                  {isEditing ? (
                    <textarea 
                      className="w-full bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 h-24 focus:outline-none focus:border-emerald-500"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  ) : (
                    <p className="text-white leading-relaxed">{profile.address || 'No address provided'}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition mt-6"
                >
                  <Save size={20} /> Save Changes
                </button>
              )}
              {message && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded text-center text-emerald-400 font-medium">
                  {message}
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}