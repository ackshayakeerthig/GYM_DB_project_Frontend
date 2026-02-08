import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Settings, Wrench, CheckCircle, AlertTriangle, Activity, Dumbbell } from 'lucide-react';

export function EquipmentPage() {
  const [summary, setSummary] = useState<any[]>([]);
  const [brokenAssets, setBrokenAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await api.equipment.getStatus();
        // Ensure data exists before setting state
        setSummary(data?.summary || []);
        setBrokenAssets(data?.details || []);
      } catch (error) {
        console.error("Failed to load equipment status", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStatus();
  }, []);

  // Helper function to handle unknown statuses safely
  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'functional') return { color: 'emerald', icon: <CheckCircle size={20} /> };
    if (s === 'under maintenance') return { color: 'amber', icon: <Wrench size={20} /> };
    return { color: 'red', icon: <AlertTriangle size={20} /> }; // Default for 'Broken' or others
  };

  if (isLoading) return <DashboardLayout><div className="p-8 text-white animate-pulse">Scanning gym floor...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Equipment Status</h1>
          <p className="text-slate-400">Real-time health monitor of our fitness assets</p>
        </div>

        {/* Status Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary.map((stat, idx) => {
            const config = getStatusConfig(stat.status);
            return (
              <Card key={idx} className="relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">{stat.status || 'Unknown'}</p>
                    <p className="text-3xl font-black text-white mt-1">{stat.count || 0}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-${config.color}-500/20 text-${config.color}-400`}>
                    {config.icon}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Active Maintenance Alerts" className="lg:col-span-2">
            <div className="space-y-4">
              {brokenAssets.length > 0 ? (
                brokenAssets.map((asset, idx) => {
                  const config = getStatusConfig(asset.status);
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                          <Dumbbell size={18} />
                        </div>
                        <div>
                          <p className="text-white font-bold">{asset.asset_name}</p>
                          <p className="text-slate-500 text-xs italic">Awaiting technical resolution</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-${config.color}-500/10 text-${config.color}-500`}>
                        {asset.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <Activity size={48} className="mx-auto text-emerald-500/20 mb-4" />
                  <p className="text-slate-500 font-medium">All systems operational. No active alerts.</p>
                </div>
              )}
            </div>
          </Card>

          <Card title="Gym Policy">
             <div className="space-y-4 pt-2">
               <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                 <p className="text-xs text-blue-400 leading-relaxed">
                   Report any malfunctioning equipment through our mobile app or notify the front desk immediately.
                 </p>
               </div>
             </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}