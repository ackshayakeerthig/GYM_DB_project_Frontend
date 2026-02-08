import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Save, Search, Activity, Heart, CheckCircle, ArrowLeft, Clock, MessageSquare, Weight } from 'lucide-react';
import { api } from '../../services/api';
import { Member } from '../../types';
import { Card } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';

const WORKOUT_OPTIONS = ["Back", "Belly", "Upperbody", "Lowerbody", "Cardio", "Full Body"];

export function LogEntryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialId = searchParams.get('id');
  const initialName = searchParams.get('name');

  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialName || '');
  const [selectedMember, setSelectedMember] = useState<Member | null>(
    initialId ? { member_id: parseInt(initialId), full_name: initialName || '' } as Member : null
  );
  
  const [logType, setLogType] = useState<'Workout' | 'Health_Check'>('Workout');
  const [details, setDetails] = useState<any>({
    check_in: "10:00",
    duration: "60 mins",
    workouts: [],
    description: "",
    weight: "",
    bmi: "",
    bp: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await api.employee.getAllMembers();
        setAllMembers(data);
      } catch (err) {
        console.error("Failed to load members", err);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '' || selectedMember?.full_name === searchTerm) {
      setFilteredMembers([]);
    } else {
      const filtered = allMembers.filter(m => 
        m.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setFilteredMembers(filtered);
    }
  }, [searchTerm, allMembers, selectedMember]);

  const toggleWorkoutType = (type: string) => {
    setDetails((prev: any) => {
      const current = prev.workouts || [];
      const next = current.includes(type) 
        ? current.filter((t: string) => t !== type)
        : [...current, type];
      return { ...prev, workouts: next };
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setDetails((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return alert("Please select a member.");

    setIsLoading(true);
    try {
      const logData = {
        ...details,
        timestamp: new Date().toISOString()
      };

      await api.employee.logActivity(
        selectedMember.member_id,
        logType,
        logData
      );
      
      alert(`${logType.replace('_', ' ')} logged successfully!`);
      if (initialId) {
        navigate('/employee/members');
      } else {
        setSelectedMember(null);
        setSearchTerm('');
        setDetails({ check_in: "10:00", duration: "60 mins", workouts: [], description: "", weight: "", bmi: "", bp: "" });
      }
    } catch (err) {
      alert("Error saving log.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 p-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <Card className="border-slate-700 bg-slate-800">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Activity className="text-emerald-500" /> Member Activity Logger
            </h2>
            <p className="text-slate-400 text-sm">Sync biometric and workout data to the NoSQL engine.</p>
          </div>

          {/* STEP 1: MEMBER SEARCH */}
          <div className="mb-8 relative">
            <label className="text-slate-300 text-sm font-medium mb-2 block">1. Select Member</label>
            <input
              type="text"
              placeholder="Search member name..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredMembers.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl">
                {filteredMembers.map(m => (
                  <button key={m.member_id} onClick={() => { setSelectedMember(m); setSearchTerm(m.full_name); setFilteredMembers([]); }}
                    className="w-full text-left px-4 py-3 hover:bg-emerald-500/10 text-slate-200 border-b border-slate-800 last:border-0">
                    {m.full_name}
                  </button>
                ))}
              </div>
            )}
            {selectedMember && <p className="mt-2 text-emerald-400 text-sm flex items-center gap-1"><CheckCircle size={14}/> Active: {selectedMember.full_name}</p>}
          </div>

          {/* STEP 2: LOG TYPE SELECTOR */}
          <div className="mb-8">
            <label className="text-slate-300 text-sm font-medium mb-2 block">2. Log Category</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setLogType('Workout')}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 border-2 transition-all ${logType === 'Workout' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                <Activity size={18} /> Workout Log
              </button>
              <button type="button" onClick={() => setLogType('Health_Check')}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 border-2 transition-all ${logType === 'Health_Check' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                <Heart size={18} /> Health Check
              </button>
            </div>
          </div>

          {/* STEP 3: DYNAMIC FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-700 space-y-6">
              {logType === 'Workout' ? (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block uppercase font-bold flex items-center gap-1"><Clock size={12}/> Check-in</label>
                      <input type="time" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white" value={details.check_in} onChange={e => handleInputChange('check_in', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block uppercase font-bold">Duration</label>
                      <input placeholder="87 mins" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white" value={details.duration} onChange={e => handleInputChange('duration', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-3 block uppercase font-bold">Muscle Groups</label>
                    <div className="grid grid-cols-3 gap-2">
                      {WORKOUT_OPTIONS.map(type => (
                        <button key={type} type="button" onClick={() => toggleWorkoutType(type)}
                          className={`py-2 px-3 rounded-md text-[10px] font-bold border transition-all ${details.workouts?.includes(type) ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-slate-500 mb-2 block uppercase font-bold flex items-center gap-1"><Weight size={12}/> Weight (kg)</label>
                    <input type="number" step="0.1" placeholder="75.5" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white" value={details.weight} onChange={e => handleInputChange('weight', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-2 block uppercase font-bold">BMI Index</label>
                    <input type="number" step="0.1" placeholder="22.4" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white" value={details.bmi} onChange={e => handleInputChange('bmi', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-500 mb-2 block uppercase font-bold">Blood Pressure (mmHg)</label>
                    <input placeholder="120/80" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white" value={details.bp} onChange={e => handleInputChange('bp', e.target.value)} />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-500 mb-2 block uppercase font-bold flex items-center gap-1"><MessageSquare size={12}/> Detailed Notes</label>
                <textarea rows={3} placeholder="e.g. Logged bench press at 90kg" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white" value={details.description} onChange={e => handleInputChange('description', e.target.value)} />
              </div>
            </div>

            <button type="submit" disabled={!selectedMember || isLoading}
              className={`w-full py-4 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${logType === 'Workout' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'} text-white`}>
              {isLoading ? "Syncing..." : <><Save size={20} /> Commit to GDBMS-AQBAS</>}
            </button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}