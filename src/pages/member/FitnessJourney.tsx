import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { Activity, Weight, Info, Target } from 'lucide-react';
// Required for the Horizontal Calendar logic
import { format, eachDayOfInterval, subDays, addDays } from 'date-fns';
// import {HorizontalCalendar} from '../../components/HorizontalCalendar'; 


const HorizontalCalendar = ({ activities, selectedDate, onDateClick }: any) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Generate a wider range: 90 days back and until the end of the current year
  const days = eachDayOfInterval({
    start: subDays(new Date(), 90),
    end: addDays(new Date(), 30), // Shows a month into the future
  });

  const workoutDates = new Set(
    activities
      .filter((a: any) => a.activity_type === 'Workout')
      .map((a: any) => new Date(a.recorded_at).toDateString())
  );

  // Auto-scroll to today on mount
  useEffect(() => {
    if (scrollRef.current) {
      const todayElement = scrollRef.current.querySelector('[data-today="true"]');
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [activities]);

  return (
    <div className="w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-6">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 pb-4 no-scrollbar scroll-smooth"
      >
        {days.map((day, idx) => {
          const dateStr = day.toDateString();
          const isSelected = selectedDate === dateStr;
          const hasWorkout = workoutDates.has(dateStr);
          const isToday = new Date().toDateString() === dateStr;

          return (
            <button
              key={idx}
              data-today={isToday}
              onClick={() => onDateClick(dateStr)}
              className={`flex-shrink-0 w-16 py-3 rounded-xl flex flex-col items-center transition-all
                ${isSelected ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                ${isToday && !isSelected ? 'ring-2 ring-emerald-500/50' : ''}
                ${hasWorkout && !isSelected ? 'border border-emerald-500' : 'border border-transparent'}
              `}
            >
              <span className="text-[9px] font-bold opacity-60">{format(day, 'yyyy')}</span>
              <span className="text-[10px] uppercase font-bold">{format(day, 'MMM')}</span>
              <span className="text-xl font-black">{format(day, 'd')}</span>
              <span className="text-[10px]">{format(day, 'EEE')}</span>
              {hasWorkout && (
                <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-center mt-2">
        <button 
          onClick={() => {
             const todayEl = scrollRef.current?.querySelector('[data-today="true"]');
             todayEl?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
          }}
          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full border border-slate-700 transition"
        >
          Jump to Today
        </button>
      </div>
    </div>
  );
};


export function FitnessJourney() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        const logs = await api.member.getActivityLogs(user.id);
        setActivities(logs.sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()));
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const healthData = activities
    .filter(a => a.activity_type === 'Health_Check')
    .reverse()
    .map(a => ({
      date: format(new Date(a.recorded_at), 'MMM d'),
      current: a.details.current_weight,
      target: a.details.target_weight
    }));

  const latestHealth = activities.find(a => a.activity_type === 'Health_Check');
  
  const filteredFeed = selectedDate 
    ? activities.filter(a => new Date(a.recorded_at).toDateString() === selectedDate)
    : activities.slice(0, 5);

  if (isLoading) return <DashboardLayout><div className="p-8 text-white animate-pulse">Loading Progress...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Fitness Journey</h1>
            <p className="text-slate-400">Track your metrics and daily consistency</p>
          </div>
        </div>

        <HorizontalCalendar 
          activities={activities} 
          selectedDate={selectedDate} 
          onDateClick={setSelectedDate} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Weight Progress" className="lg:col-span-2">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    domain={['dataMin - 3', 'dataMax + 3']} 
                    tickFormatter={(val) => `${val}kg`}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fill="url(#colorWeight)" 
                  />
                  <Line type="step" dataKey="target" stroke="#f43f5e" strokeDasharray="5 5" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Current Status">
            {latestHealth ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Weight className="text-emerald-500" size={24} />
                      <span className="text-slate-300">Weight</span>
                    </div>
                    <span className="text-white font-bold text-2xl">{latestHealth.details.current_weight} <small className="text-sm font-normal text-slate-500">kg</small></span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 p-3 rounded text-center border border-slate-700">
                      <p className="text-xs text-slate-500 uppercase font-bold">Body Fat</p>
                      <p className="text-emerald-400 font-bold text-xl">{latestHealth.details.body_composition.fat}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded text-center border border-slate-700">
                      <p className="text-xs text-slate-500 uppercase font-bold">Muscle</p>
                      <p className="text-blue-400 font-bold text-xl">{latestHealth.details.body_composition.muscle}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-amber-500">
                      <Info size={16} />
                      <span className="text-xs font-bold uppercase">Coach's Note</span>
                    </div>
                    <p className="text-sm text-slate-300 italic">"{latestHealth.details.description}"</p>
                  </div>
                </div>
            ) : <p className="text-slate-500">No health logs found.</p>}
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity size={20} className="text-emerald-500" />
              Activity Logs {selectedDate && `for ${selectedDate}`}
            </h2>
            {selectedDate && (
              <button onClick={() => setSelectedDate(null)} className="text-xs text-emerald-500 underline">
                Show all history
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {filteredFeed.map((activity, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 
                  ${activity.activity_type === 'Workout' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {activity.activity_type === 'Workout' ? <Activity size={24} /> : <Target size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <h3 className="text-white font-bold truncate">{activity.activity_type.replace('_', ' ')}</h3>
                    <span className="text-slate-500 text-xs">{format(new Date(activity.recorded_at), 'MMM d, p')}</span>
                  </div>
                  <p className="text-slate-400 text-sm truncate">
                    {activity.activity_type === 'Workout' 
                      ? `Finished ${activity.details.duration} of ${activity.details.workouts?.join(', ')}`
                      : `BMI: ${activity.details.bmi} | Target: ${activity.details.target_weight}kg`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}