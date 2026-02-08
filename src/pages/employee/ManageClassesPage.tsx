import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, Badge } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Calendar, Users, Clock, Search, Loader2, Info } from 'lucide-react';

export function ManageClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRosterLoading, setIsRosterLoading] = useState(false);

  useEffect(() => {
    const loadAllClasses = async () => {
      try {
        // Fetches all gym classes regardless of trainer
        const data = await api.class.getAll();
        setClasses(data || []);
      } catch (err) {
        console.error("Fetch Global Schedule Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllClasses();
  }, []);

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

  // Grouping logic for the global schedule
  const today = new Date();
  const pastClasses = classes.filter(c => new Date(c.start_time) < new Date(new Date().setHours(0,0,0,0)));
  const todayClasses = classes.filter(c => {
    const d = new Date(c.start_time);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
  });
  const upcomingClasses = classes.filter(c => new Date(c.start_time) > new Date(new Date().setHours(23,59,59,999)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Gym-Wide Class Schedule</h1>
            <p className="text-slate-400 text-sm mt-1">View attendance and roster details for all gym sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SIDEBAR: Global Schedule */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
            <ClassSection title="Today's Sessions" items={todayClasses} color="text-emerald-400" onSelect={handleSelectClass} activeId={selectedClass?.schedule_id} />
            <ClassSection title="Future Sessions" items={upcomingClasses} color="text-blue-400" onSelect={handleSelectClass} activeId={selectedClass?.schedule_id} />
            <ClassSection title="Archived Sessions" items={pastClasses} color="text-slate-500" onSelect={handleSelectClass} activeId={selectedClass?.schedule_id} />
          </div>

          {/* ATTENDANCE VIEW (Read-Only) */}
          <div className="lg:col-span-2">
            <Card className="h-full min-h-[500px] flex flex-col border-slate-800">
              {isRosterLoading ? (
                <div className="flex-grow flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
              ) : selectedClass ? (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedClass.class_name}</h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><Users size={14}/> {attendees.length} Members</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {new Date(selectedClass.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                    <Badge variant="info">Read Only View</Badge>
                  </div>

                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-800/50 text-slate-400 font-bold uppercase">
                        <tr>
                          <th className="p-4">Member Name</th>
                          <th className="p-4 text-center">Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendees.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="p-8 text-center text-slate-500 italic">No members booked for this session yet.</td>
                          </tr>
                        ) : (
                          attendees.map(member => (
                            <tr key={member.booking_id} className="border-t border-slate-800 hover:bg-slate-800/20 transition-colors">
                              <td className="p-4 text-white font-medium">{member.full_name}</td>
                              <td className="p-4 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                  member.attended 
                                    ? 'bg-emerald-500/10 text-emerald-500' 
                                    : 'bg-slate-700/50 text-slate-500'
                                }`}>
                                  {member.attended ? <Users size={12} /> : null}
                                  {member.attended ? 'Attended' : 'Marked Absent'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-700">
                  <div className="p-6 bg-slate-800/30 rounded-full mb-4">
                    <Calendar size={48} className="opacity-20" />
                  </div>
                  <p className="font-medium">Select a class to view global attendance</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Sub-component for listing classes
function ClassSection({ title, items, onSelect, activeId, color }: any) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2 mb-6">
      <h3 className={`text-xs font-bold uppercase tracking-widest ${color}`}>{title}</h3>
      {items.map((c: any) => (
        <div 
          key={c.schedule_id} 
          onClick={() => onSelect(c)}
          className="cursor-pointer group"
        >
          <Card 
            className={`transition-all border-l-4 pointer-events-none p-4 ${
              activeId === c.schedule_id 
                ? 'border-blue-500 bg-slate-800 translate-x-1' 
                : 'border-transparent hover:bg-slate-800/40'
            }`}
          >
            <div className="text-white font-bold group-hover:text-blue-400 transition-colors">
              {c.class_name}
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono">
                {new Date(c.start_time).toLocaleDateString()}
              </span>
              <span className="text-[10px] text-slate-400 italic">
                {c.trainer_name || 'Assigned Trainer'}
              </span>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}