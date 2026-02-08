import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, Badge } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { EquipmentAsset } from '../../types';
import { Wrench, CheckCircle, AlertTriangle, Settings } from 'lucide-react';

export function EquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await api.equipment.getAll();
        setEquipment(data || []);
      } catch (err) {
        console.error('Failed to load equipment');
      } finally {
        setIsLoading(false);
      }
    };
    loadEquipment();
  }, []);

  const handleStatusChange = async (assetId: number, newStatus: string) => {
    try {
      // Hits @app.patch("/equipment/{id}")
      const updated = await api.equipment.update(assetId, newStatus);
      if (updated) {
        setEquipment(prev => prev.map((e) => (e.asset_id === assetId ? updated : e)));
      }
    } catch (err) {
      console.error('Failed to update equipment status');
    }
  };

  if (isLoading) return <DashboardLayout><div className="p-8 animate-pulse text-white">Loading Assets...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Equipment Management</h1>
          <p className="text-slate-400">Track and update gym asset conditions</p>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Equipment</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {equipment.map((item) => (
                  <tr key={item.asset_id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Wrench className={`w-4 h-4 ${item.status === 'Functional' ? 'text-emerald-500' : 'text-red-500'}`} />
                        <span className="text-white font-medium">{item.asset_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(item.purchase_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          item.status === 'Functional' ? 'success' : 
                          item.status === 'Needs Repair' ? 'error' : 'warning'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Dropdown with value set to current item.status */}
                      <select
                        value={item.status} 
                        onChange={(e) => handleStatusChange(item.asset_id, e.target.value)}
                        className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 border border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option value="Functional">Functional</option>
                        <option value="Needs Repair">Needs Repair</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}