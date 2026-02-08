import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, Badge } from '../../components/Card';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Users, Edit2, Check, X, Search, IndianRupee, Mail, Loader2 } from 'lucide-react';

export function StaffManagementPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for inline editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ salary: 0, position: '' });

  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = async () => {
    try {
      // Calls /api/employees which now bypasses strict token checks
      const data = await api.employee.getAll();
      setStaff(data || []);
    } catch (err: any) {
      console.error("Staff Load Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (member: any) => {
    setEditingId(member.employee_id);
    setEditForm({ 
      salary: member.salary || 0, 
      position: member.role || member.position 
    });
  };

  const handleSave = async (id: number) => {
    try {
      // Updates the DS1: User Registry via the updated PATCH route
      await api.employee.update(id, {
        salary: editForm.salary,
        position: editForm.position
      });
      
      // Update local state to reflect changes immediately
      setStaff(prev => prev.map(s => 
        s.employee_id === id ? { ...s, salary: editForm.salary, role: editForm.position } : s
      ));
      setEditingId(null);
    } catch (err) {
      alert("Failed to update staff record.");
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Users className="text-emerald-500" /> Staff Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">Direct access to GDBMS-AQBAS staff registry and payroll.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search staff..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-slate-800 overflow-hidden">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
              <p className="text-slate-500">Fetching staff records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-4">Staff Member</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Monthly Salary</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredStaff.map((member) => (
                    <tr key={member.employee_id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-bold">{member.name}</p>
                            <p className="text-slate-500 text-xs">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {editingId === member.employee_id ? (
                          <select 
                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white outline-none focus:border-emerald-500"
                            value={editForm.position}
                            onChange={(e) => setEditForm({...editForm, position: e.target.value})}
                          >
                            <option value="Trainer">Trainer</option>
                            <option value="Manager">Manager</option>
                            <option value="Employee">Staff</option>
                          </select>
                        ) : (
                          <Badge variant={member.role === 'Manager' ? 'info' : 'success'}>
                            {member.role}
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        {editingId === member.employee_id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-500">₹</span>
                            <input 
                              type="number"
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-28 focus:border-emerald-500 outline-none"
                              value={editForm.salary}
                              onChange={(e) => setEditForm({...editForm, salary: parseInt(e.target.value)})}
                            />
                          </div>
                        ) : (
                          <p className="text-white font-mono flex items-center gap-1">
                            <IndianRupee size={12} className="text-slate-500" />
                            {member.salary?.toLocaleString('en-IN') || '0'}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {editingId === member.employee_id ? (
                            <>
                              <button onClick={() => handleSave(member.employee_id)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"><Check size={18} /></button>
                              <button onClick={() => setEditingId(null)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><X size={18} /></button>
                            </>
                          ) : (
                            <button onClick={() => startEditing(member)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"><Edit2 size={18} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}