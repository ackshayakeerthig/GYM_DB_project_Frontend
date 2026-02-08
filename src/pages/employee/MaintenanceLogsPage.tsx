import React, { useState, useEffect } from 'react';
import { Wrench, Calendar, User, IndianRupee, FileText, ClipboardList, Plus, X, Save } from 'lucide-react';
import { api } from '../../services/api';
import { Card } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';

export function MaintenanceLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    asset_id: '',
    maintenance_date: new Date().toISOString().split('T')[0],
    repair_cost: '',
    notes: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsData, equipData] = await Promise.all([
        api.equipment.getMaintenanceLogs(),
        api.equipment.getAll()
      ]);
      setLogs(logsData || []);
      setEquipment(equipData || []);
    } catch (err) {
      console.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.equipment.addMaintenanceLog({
        ...formData,
        asset_id: parseInt(formData.asset_id),
        repair_cost: parseFloat(formData.repair_cost)
      });
      setShowModal(false);
      setFormData({ asset_id: '', maintenance_date: new Date().toISOString().split('T')[0], repair_cost: '', notes: '' });
      fetchData(); // Refresh table
    } catch (err: any) {
      alert(err.message || "Failed to add log");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <ClipboardList className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Maintenance History</h1>
              <p className="text-slate-400 text-sm">Detailed logs of equipment repairs and servicing</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Add Log
          </button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Asset / Equipment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Performed By</th>
                  <th className="px-6 py-4 text-right">Repair Cost</th>
                  <th className="px-6 py-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 animate-pulse">Loading logs...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No maintenance records found.</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.log_id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Wrench className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-medium">{log.asset_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(log.maintenance_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {log.staff_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-emerald-400 font-mono">
                        ₹{parseFloat(log.repair_cost).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex items-start gap-2">
                          <FileText className="w-3.5 h-3.5 mt-1 text-slate-500" />
                          <p className="truncate text-slate-400" title={log.notes}>
                            {log.notes || 'No notes available'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ADD LOG MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-slate-800 border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Wrench className="text-blue-500" /> New Maintenance Log
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Select Asset</label>
                  <select 
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    value={formData.asset_id}
                    onChange={e => setFormData({...formData, asset_id: e.target.value})}
                  >
                    <option value="">Choose equipment...</option>
                    {equipment.map(item => (
                      <option key={item.asset_id} value={item.asset_id}>{item.asset_name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Date</label>
                    <input 
                      type="date" required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                      value={formData.maintenance_date}
                      onChange={e => setFormData({...formData, maintenance_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Cost (₹)</label>
                    <input 
                      type="number" required placeholder="0.00"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                      value={formData.repair_cost}
                      onChange={e => setFormData({...formData, repair_cost: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Notes / Description</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    placeholder="Describe the repair..."
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-2 transition-all"
                >
                  {isSubmitting ? "Saving..." : <><Save className="w-5 h-5" /> Save Log</>}
                </button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}