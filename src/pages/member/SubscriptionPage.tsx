import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card, Badge } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { CreditCard, History, CheckCircle, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

export function SubscriptionPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        const [subHistory, plans] = await Promise.all([
          api.member.getSubscriptions(user.id),
          api.subscription.getAllPlans()
        ]);
        setHistory(subHistory);
        setAllPlans(plans);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  const activeSub = history.find(s => new Date(s.end_date) >= new Date());

  if (isLoading) return <DashboardLayout><div className="p-8 text-white animate-pulse">Loading Subscriptions...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subscription & Plans</h1>
          <p className="text-slate-400">Manage your membership and view gym offerings</p>
        </div>

        {/* --- SECTION 1: ACTIVE STATUS --- */}
        <Card className="bg-gradient-to-br from-emerald-600/20 to-slate-900 border-emerald-500/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Current Membership</h2>
                <p className="text-emerald-400 font-medium">
                  {activeSub ? activeSub.plan_name : 'No Active Subscription'}
                </p>
              </div>
            </div>
            {activeSub && (
              <div className="text-center md:text-right">
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Valid Until</p>
                <p className="text-white font-mono text-xl">{format(new Date(activeSub.end_date), 'MMMM d, yyyy')}</p>
              </div>
            )}
          </div>
        </Card>

        {/* --- SECTION 2: AVAILABLE PLANS --- */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="text-blue-500" size={20} /> Gym Plan Offerings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allPlans.map(plan => (
              <Card key={plan.plan_id} className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <CreditCard size={64} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{plan.plan_name}</h3>
                <p className="text-slate-500 text-xs mb-4">{plan.duration_months} Months Duration</p>
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">₹{plan.base_price}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="text-slate-300 text-sm flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-500" /> Full Gym Access
                  </li>
                  <li className="text-slate-300 text-sm flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-500" /> Professional Trainers
                  </li>
                </ul>
                <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold transition">
                  Renew / Upgrade
                </button>
              </Card>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: BILLING HISTORY --- */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="text-slate-500" size={20} /> Enrollment History
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">End Date</th>
                  <th className="p-4">Amount Paid</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {history.map((item, idx) => (
                  <tr key={idx} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                    <td className="p-4 font-bold text-white">{item.plan_name}</td>
                    <td className="p-4 text-slate-300">{format(new Date(item.start_date), 'MMM d, yyyy')}</td>
                    <td className="p-4 text-slate-300">{format(new Date(item.end_date), 'MMM d, yyyy')}</td>
                    <td className="p-4 text-emerald-400 font-mono">₹{item.final_price_paid}</td>
                    <td className="p-4 text-center">
                      <Badge variant={new Date(item.end_date) >= new Date() ? 'success' : 'neutral'}>
                        {new Date(item.end_date) >= new Date() ? 'Active' : 'Expired'}
                      </Badge>
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