import React, { useState, useEffect } from 'react';
import { 
  Search, User, Activity, Phone, Mail, Clock, 
  ChevronLeft, Calendar, UserPlus, X, Save 
} from 'lucide-react';
import { api } from '../../services/api';
import { Member, MemberActivityDoc } from '../../types';
import { Card } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [history, setHistory] = useState<MemberActivityDoc[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMember, setNewMember] = useState({
    full_name: '', 
    username: '', 
    password: 'Password@123', // Default password
    email: '', 
    phone: '', 
    address: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await api.employee.getAllMembers();
      setMembers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (member: Member) => {
    setSelectedMember(member);
    setLoadingHistory(true);
    try {
      const logs = await api.member.getActivityLogs(member.member_id);
      setHistory(logs);
    } catch (err) {
      console.error("Failed to load history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Note: Ensure api.employee.addMember is defined in your api.ts
      await api.employee.addMember(newMember);
      alert("Member registered successfully!");
      setShowAddModal(false);
      setNewMember({
        full_name: '', username: '', password: 'Password@123', 
        email: '', phone: '', address: ''
      });
      loadMembers(); // Refresh the list
    } catch (err: any) {
      alert(err.message || "Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMembers = members.filter(m => 
    m.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {!selectedMember ? (
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Member Directory</h1>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <UserPlus className="w-4 h-4" /> Add Member
              </button>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => setSelectedMember(null)} className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition">
            <ChevronLeft className="w-5 h-5" /> Back to Directory
          </button>
        )}

        {!selectedMember ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? <p className="text-slate-500 animate-pulse">Fetching members...</p> : 
              filteredMembers.map((m) => (
                <div key={m.member_id} onClick={() => handleViewDetails(m)} className="cursor-pointer">
                  <Card className="hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-emerald-500 font-bold">
                        {m.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{m.full_name}</h3>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            }
          </div>
        ) : (
          /* DETAILS VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-xl font-bold text-white">{selectedMember.full_name}</h2>
                <p className="text-slate-400 text-sm">Member ID: #{selectedMember.member_id}</p>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Phone className="w-4 h-4 text-emerald-500" /> {selectedMember.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Mail className="w-4 h-4 text-emerald-500" /> {selectedMember.email}
                </div>
                <button 
                  onClick={() => window.location.href=`/employee/log-entry?id=${selectedMember.member_id}&name=${selectedMember.full_name}`}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" /> Add Workout Log
                </button>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="text-emerald-500 w-5 h-5" /> Workout & Health History
              </h3>
              
              <div className="space-y-6">
                {loadingHistory ? <p className="text-slate-500">Loading logs...</p> : 
                 history.length === 0 ? <p className="text-slate-500 italic">No logs found.</p> :
                 history.map((log, idx) => (
                  <div key={idx} className="relative pl-8 border-l-2 border-slate-700 pb-2">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-800 border-2 border-emerald-500 rounded-full" />
                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(log.recorded_at).toLocaleDateString()}
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                      <span className="text-xs font-bold text-emerald-500 uppercase">{log.activity_type}</span>
                      <div className="text-slate-200 text-sm mt-1">
                        {Object.entries(log.details).map(([key, val]) => (
                          <span key={key} className="mr-4 capitalize">
                            <strong className="text-slate-400">{key.replace('_', ' ')}:</strong>{' '}
                            {typeof val === 'object' && val !== null 
                              ? Object.entries(val).map(([subKey, subVal]) => `${subKey}: ${subVal}`).join(', ')
                              : String(val)
                            }
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  ))
                }
              </div>
            </Card>
          </div>
        )}

        {/* ADD MEMBER MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserPlus className="text-emerald-500" /> New Member
                </h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                    placeholder="John Doe"
                    onChange={e => setNewMember({...newMember, full_name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Username</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                      onChange={e => setNewMember({...newMember, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Password</label>
                    <input 
                      type="password" required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                      value={newMember.password}
                      onChange={e => setNewMember({...newMember, password: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
                  <input 
                    type="email" required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                    placeholder="john@example.com"
                    onChange={e => setNewMember({...newMember, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone</label>
                  <input 
                    type="tel" required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                    placeholder="10-digit mobile number"
                    onChange={e => setNewMember({...newMember, phone: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Address</label>
                  <textarea 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                    rows={2}
                    onChange={e => setNewMember({...newMember, address: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? "Processing..." : <><Save className="w-5 h-5" /> Register Member</>}
                </button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}