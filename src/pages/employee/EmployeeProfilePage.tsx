import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card, Badge } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { User, Mail, Phone, Shield, Calendar, Clock, Award } from 'lucide-react';

export function EmployeeProfilePage() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEmployeeData = async () => {
      if (!user?.id) return;
      try {
        // Fetch specific schedule for this employee
        const data = await api.class.getTrainerSchedule(user.id);
        setSchedule(data || []);
      } catch (err) {
        console.error("Profile Load Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEmployeeData();
  }, [user?.id]);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-emerald-500/20">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="info">{user?.role}</Badge>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                  <Shield size={14} /> Verified Staff
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Employee ID</p>
            <p className="text-white font-mono text-xl">#EMP-{user?.id?.toString().padStart(4, '0')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Contact Info */}
          <div className="space-y-6">
            <Card title="Contact Information" className="border-slate-700">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg text-emerald-500"><Mail size={18} /></div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Work Email</p>
                    <p className="text-white text-sm">{user?.email || 'staff@vyamsync.com'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg text-emerald-500"><Phone size={18} /></div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Contact Number</p>
                    <p className="text-white text-sm">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg text-emerald-500"><Award size={18} /></div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Specialization</p>
                    <p className="text-white text-sm">Strength & Conditioning</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-emerald-500/5 border-emerald-500/20">
              <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                <Shield size={16} /> Access Level
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                You have **Semantic RBAC** permissions to manage class rosters, view equipment status, and log member activities.
              </p>
            </Card>
          </div>

          {/* Right Column: Assigned Classes */}
          <div className="lg:col-span-2">
            <Card title="Your Assigned Classes" className="border-slate-700">
              {isLoading ? (
                <div className="py-12 flex justify-center"><Clock className="animate-spin text-emerald-500" /></div>
              ) : schedule.length > 0 ? (
                <div className="space-y-4">
                  {schedule.slice(0, 4).map((cls) => (
                    <div key={cls.schedule_id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="text-white font-bold">{cls.class_name}</p>
                          <p className="text-slate-500 text-xs">
                            {new Date(cls.start_time).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-mono text-sm">
                          {new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-slate-500 text-[10px] uppercase">Start Time</p>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => window.location.href = '/employee/classes'}
                    className="w-full py-3 text-slate-400 hover:text-white text-sm transition-colors border-t border-slate-700 mt-2"
                  >
                    View Full Schedule →
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Calendar size={40} className="mx-auto mb-2 opacity-20" />
                  <p>No classes assigned for this week.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}