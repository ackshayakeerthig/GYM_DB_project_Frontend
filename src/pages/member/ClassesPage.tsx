import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card, Badge } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Clock, Users, BookOpen, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export function ClassesPage() {
  const { user } = useAuth();
  const [availableFromDb, setAvailableFromDb] = useState<any[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = async () => {
    if (!user?.id) return;
    try {
      const [available, booked] = await Promise.all([
        api.class.getAvailable(), 
        api.booking.getByMember(user.id)
      ]);
      setAvailableFromDb(available || []);
      setUserBookings(booked || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, [user?.id]);

  const now = new Date();

  // 1. "Already Booked" (Future classes user is enrolled in)
  const myUpcoming = userBookings.filter(b => new Date(b.start_time) > now);

  // 2. "Available to Book" (Future classes user has NOT booked yet)
  const myBookedIds = new Set(userBookings.map(b => b.schedule_id));
  const trulyAvailable = availableFromDb.filter(c => !myBookedIds.has(c.schedule_id));

  // 3. "Over Classes" (Past classes user was enrolled in)
  const pastClasses = userBookings.filter(b => new Date(b.start_time) <= now);

  const handleBook = async (id: number) => {
    try {
      await api.booking.create(user!.id, id);
      loadAllData();
    } catch (e: any) { alert(e.message); }
  };

  const handleCancel = async (bookingId: number) => {
    try {
      await api.booking.delete(bookingId);
      loadAllData();
    } catch (e: any) { alert(e.message); }
  };

  if (isLoading) return <DashboardLayout><div className="text-white p-8 animate-pulse">Loading Schedule...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-10">
        
        {/* SECTION 1: BOOKED CLASSES (CANCEL OPTION) */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" /> My Current Bookings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myUpcoming.map(b => (
              <Card key={b.booking_id} className="border-t-4 border-emerald-500">
                <h3 className="text-white font-bold">{b.class_name}</h3>
                <p className="text-slate-400 text-sm mb-4">{format(new Date(b.start_time), 'PPp')}</p>
                <button 
                  onClick={() => handleCancel(b.booking_id)}
                  className="w-full flex items-center justify-center gap-2 text-red-400 bg-red-400/10 py-2 rounded hover:bg-red-400/20"
                >
                  <Trash2 size={16} /> Cancel Booking
                </button>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 2: NEW CLASSES (BOOK OPTION) */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="text-blue-500" /> Explore Available Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trulyAvailable.map(c => (
              <Card key={c.schedule_id}>
                <h3 className="text-white font-bold">{c.class_name}</h3>
                <p className="text-slate-400 text-sm mb-4">{format(new Date(c.start_time), 'PPp')}</p>
                <div className="flex justify-between items-center mb-4">
                   <span className="text-xs text-slate-500">{c.spots_left} spots left</span>
                   <span className="text-xs text-emerald-500">Trainer: {c.trainer_name}</span>
                </div>
                <button 
                  onClick={() => handleBook(c.schedule_id)}
                  className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 font-bold"
                >
                  Book Class
                </button>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION 3: PAST HISTORY (ATTENDANCE) */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Class History & Attendance</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-800 text-slate-400 text-xs">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Attendance</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {pastClasses.map(p => (
                  <tr key={p.booking_id} className="border-t border-slate-800">
                    <td className="p-4">{format(new Date(p.start_time), 'MMM d, yyyy')}</td>
                    <td className="p-4 font-bold">{p.class_name}</td>
                    <td className="p-4">
                      {p.attended ? (
                        <Badge variant="success">Attended</Badge>
                      ) : (
                        <Badge variant="error">Missed</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}