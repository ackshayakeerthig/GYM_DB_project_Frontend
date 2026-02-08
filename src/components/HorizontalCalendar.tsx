import React, { useEffect, useRef } from 'react';
import { format, eachDayOfInterval, subDays, addDays } from 'date-fns';

interface HorizontalCalendarProps {
  activities: any[];
  selectedDate: string | null;
  onDateClick: (date: string) => void;
}

export const HorizontalCalendar: React.FC<HorizontalCalendarProps> = ({ 
  activities, 
  selectedDate, 
  onDateClick 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate date range: 90 days back and 30 days forward
  const days = eachDayOfInterval({
    start: subDays(new Date(), 90),
    end: addDays(new Date(), 30),
  });

  const workoutDates = new Set(
    activities
      .filter((a) => a.activity_type === 'Workout')
      .map((a) => new Date(a.recorded_at).toDateString())
  );

  // Auto-scroll to center on Today when component loads
  useEffect(() => {
    if (scrollRef.current) {
      const todayElement = scrollRef.current.querySelector('[data-today="true"]');
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [activities]);

  const handleJumpToToday = () => {
    const todayEl = scrollRef.current?.querySelector('[data-today="true"]');
    todayEl?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  };

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
          onClick={handleJumpToToday}
          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-1 rounded-full border border-slate-700 transition"
        >
          Jump to Today
        </button>
      </div>
    </div>
  );
};