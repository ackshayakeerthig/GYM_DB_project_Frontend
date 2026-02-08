import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

interface WorkoutCalendarProps {
  activities: any[];
  onDateClick: (date: string) => void;
  selectedDate: string | null;
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ activities, onDateClick, selectedDate }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const workoutDates = activities
    .filter(a => a.activity_type === 'Workout')
    .map(a => new Date(a.recorded_at));

  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-inner">
      <div className="text-center mb-4">
        <h3 className="text-white font-bold text-lg">{format(today, 'MMMM yyyy')}</h3>
      </div>
      
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-slate-500 pb-2">
            {day}
          </div>
        ))}
        
        {days.map((day, idx) => {
          const isWorkoutDay = workoutDates.some(wd => isSameDay(wd, day));
          const dateStr = day.toDateString();
          const isSelected = selectedDate === dateStr;
          const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);

          return (
            <button
              key={idx}
              onClick={() => onDateClick(dateStr)}
              className={`
                aspect-square w-full rounded-lg flex flex-col items-center justify-center transition-all relative
                ${!isCurrentMonth ? 'opacity-20 cursor-default' : 'cursor-pointer'}
                ${isWorkoutDay ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800/40 text-slate-500 hover:bg-slate-700/50'}
                ${isSelected ? 'ring-2 ring-emerald-400 scale-105 z-10' : ''}
                ${isToday(day) ? 'font-black' : ''}
              `}
            >
              <span className="text-xs">{format(day, 'd')}</span>
              {isWorkoutDay && (
                <div className="absolute bottom-1 w-1 h-1 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 flex gap-4 justify-center text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-emerald-500/20 border border-emerald-500/30" />
          <span className="text-slate-400">Workout Day</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-slate-800/40" />
          <span className="text-slate-400">Rest Day</span>
        </div>
      </div>
    </div>
  );
};