import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card, Badge } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Calendar, Users, Clock, Search, Loader2, Plus, X, Save } from 'lucide-react';

export function MyClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRosterLoading, setIsRosterLoading] = useState(false);

  // --- NEW: Modal & Form State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    class_name: '',
    start_time: '',
    capacity: 20
  });

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const data = await api.class.getTrainerSchedule(user.id);
      setClasses(data || []);
    } catch (err) {
      console.error("Fetch Schedule Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleSelectClass = async (cls: any) => {
    setSelectedClass(cls);
    setIsRosterLoading(true);
    try {
      const list = await api.class.getAttendees(cls.schedule_id);
      setAttendees(list || []);
    } catch (error) {
      console.error("Roster Fetch Error:", error);
    } finally {
      setIsRosterLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        trainer_id: user.id,
        // Ensure the time is in a format PostgreSQL understands
        start_time: new Date(formData.start_time).toISOString()
      };

      await api.class.create(payload);
      alert("Class scheduled successfully!");
      setIsModalOpen(false);
      setFormData({ class_name: '', start_time: '', capacity: 20 });
      loadData(); // Refresh the list
    } catch (err) {
      alert("Failed to create class. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAttendance = async (bookingId: number, currentStatus: boolean) => {
    try {
      await api.booking.markAttendance(bookingId, !currentStatus);
      setAttendees(prev => prev.map(a => 
        a.booking_id === bookingId ? { ...a, attended: !currentStatus } : a
      ));
    } catch (err) {
      alert("Attendance update failed");
    }
  };

  // Grouping logic
  const pastClasses = classes.filter(c => new Date(c.start_time) < new Date(new Date().setHours(0,0,0,0)));
  const todayClasses = classes.filter(c => {
    const d = new Date(c.start_time);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
  });
  const upcomingClasses = classes.filter(c => new Date(c.start_time) > new Date(new Date().setHours(23,59,59,999)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Class Roster Management</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold transition shadow-lg shadow-emerald-500/20"
          >
            <Plus size={20} /> Schedule New Class
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <ClassSection title="Today" items={todayClasses} color="text-emerald-400" onSelect={handleSelectClass} activeId={selectedClass?.schedule_id} />
            <ClassSection title="Upcoming" items={upcomingClasses} color="text-blue-400" onSelect={handleSelectClass} activeId={selectedClass?.schedule_id} />
            <ClassSection title="History" items={pastClasses} color="text-slate-500" onSelect={handleSelectClass} activeId={selectedClass?.schedule_id} />
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full min-h-[500px] flex flex-col border-slate-800">
              {isRosterLoading ? (
                <div className="flex-grow flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>
              ) : selectedClass ? (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
                    {selectedClass.class_name} - Members
                  </h2>
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-800/50 text-slate-400 font-bold uppercase">
                        <tr>
                          <th className="p-4">Name</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendees.map(member => (
                          <tr key={member.booking_id} className="border-t border-slate-800">
                            <td className="p-4 text-white font-medium">{member.full_name}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => toggleAttendance(member.booking_id, member.attended)}
                                className={`px-4 py-1.5 rounded-lg font-bold transition ${
                                  member.attended ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                                }`}
                              >
                                {member.attended ? 'Present' : 'Absent'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-700">
                  <Search size={64} className="opacity-10 mb-4" />
                  <p>Select a class session to view the roster</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* --- NEW: CREATE CLASS MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-700 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="text-emerald-500" size={24} /> Schedule New Class
              </h2>
              <p className="text-slate-400 text-sm mt-1">Add a new session to the GDBMS-AQBAS registry.</p>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Class Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Morning Yoga"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                  value={formData.class_name} 
                  onChange={e => setFormData({...formData, class_name: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Time</label>
                  <input 
                    required
                    type="datetime-local" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                    value={formData.start_time} 
                    onChange={e => setFormData({...formData, start_time: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Max Capacity</label>
                  <input 
                    required
                    type="number" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                    value={formData.capacity} 
                    onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {isSubmitting ? "Syncing..." : "Schedule Class"}
              </button>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

// Sub-component Helper
function ClassSection({ title, items, onSelect, activeId, color }: any) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className={`text-xs font-bold uppercase ${color}`}>{title}</h3>
      {items.map((c: any) => (
        <div key={c.schedule_id} onClick={() => onSelect(c)} className="cursor-pointer group">
          <Card 
            className={`transition-all border-l-4 p-4 ${
              activeId === c.schedule_id ? 'border-emerald-500 bg-slate-800' : 'border-transparent hover:bg-slate-800/40'
            }`}
          >
            <div className="text-white font-bold group-hover:text-emerald-400 transition-colors">
              {c.class_name}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1 uppercase font-mono">
              <Clock size={10} /> {new Date(c.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}