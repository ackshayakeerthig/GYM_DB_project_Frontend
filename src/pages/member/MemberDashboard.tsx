import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card, StatCard, Badge } from '../../components/Card';
import { Calendar, Dumbbell, TrendingUp, Users } from 'lucide-react';
import { Member } from '../../types';

export function MemberDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Member | null>(null);
  const [bookings, setBookings] = useState<any[]>([]); // Default to empty array
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        // Your backend has /member/{id}/profile which includes the current plan
        const profileData = await api.member.getProfile(user.id);
        setProfile(profileData);

        // Safety: If these endpoints aren't in your Python code yet, 
        // we wrap them in a try-catch so the dashboard still loads.
        try {
          const bks = await api.booking.getByMember(user.id);
          setBookings(bks || []);
        } catch (e) {
          console.warn("Bookings endpoint not found yet");
          setBookings([]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  // Filters for upcoming classes based on current time
  const upcomingClasses = bookings.filter(
    (b) => b.start_time && new Date(b.start_time) > new Date() && !b.attended
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}!</h1>
        <p className="text-slate-400 mt-2">Your fitness journey at GymTech Pro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Current Plan"
          // Your backend returns 'current_plan' in the profile query
          value={profile?.current_plan || 'No Active Plan'}
          icon={<Dumbbell />}
        />
        <StatCard
          label="Upcoming Classes"
          value={upcomingClasses.length}
          icon={<Calendar />}
        />
        <StatCard
          label="Member Since"
          // Using join_date from the profile fetch
          value={profile?.join_date ? new Date(profile.join_date).toLocaleDateString() : 'N/A'}
          icon={<Users />}
        />
        <StatCard
          label="Profile Status"
          value={profile ? 'Active' : 'Missing'}
          trend={{ value: 100, direction: 'up' }}
          icon={<TrendingUp />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Subscription Details">
          {profile?.current_plan ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <p className="text-emerald-400 text-sm font-medium">Plan: {profile.current_plan}</p>
                <p className="text-slate-300 text-sm mt-2">
                  Contact Email: {profile.email}
                </p>
                <p className="text-slate-400 text-xs mt-2">Member ID: #{profile.member_id}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">No active subscription found.</p>
              <p className="text-xs text-slate-500 mt-1">Visit the front desk to enroll.</p>
            </div>
          )}
        </Card>

        <Card title="Upcoming Classes">
          {upcomingClasses.length > 0 ? (
            <div className="space-y-3">
              {upcomingClasses.slice(0, 3).map((booking) => (
                <div key={booking.booking_id} className="flex items-start gap-4 p-3 bg-slate-700/30 rounded">
                  <div className="flex-1">
                    <p className="text-white font-medium">{booking.class_name}</p>
                    <p className="text-slate-400 text-sm">
                      {new Date(booking.start_time).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="success">Booked</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No upcoming classes booked</p>
          )}
        </Card>
      </div>

      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/member/classes" className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition">
            <Calendar className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Book Classes</p>
          </a>
          <a href="/member/fitness" className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition">
            <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Fitness Journey</p>
          </a>
          <a href="/member/profile" className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition">
            <Users className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Profile</p>
          </a>
          <a href="/member/equipment" className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition">
            <Dumbbell className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Equipment</p>
          </a>
        </div>
      </Card>
    </div>
  );
}