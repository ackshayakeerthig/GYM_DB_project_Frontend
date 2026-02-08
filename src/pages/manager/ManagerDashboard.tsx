import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card, StatCard } from '../../components/Card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { Employee } from '../../types';

export function ManagerDashboard() {
  const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalExpenses: 0, netProfit: 0 });
  const [staff, setStaff] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ana, st] = await Promise.all([api.manager.getAnalytics(), api.manager.getStaff()]);
        setAnalytics(ana);
        setStaff(st);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const chartData = [
    { month: 'Jan', revenue: 150000, expenses: 120000 },
    { month: 'Feb', revenue: 165000, expenses: 130000 },
    { month: 'Mar', revenue: 180000, expenses: 135000 },
    { month: 'Apr', revenue: 175000, expenses: 140000 },
    { month: 'May', revenue: 195000, expenses: 145000 },
    { month: 'Jun', revenue: 210000, expenses: 155000 },
  ];

  const expenseData = [
    { name: 'Salaries', value: 300000 },
    { name: 'Equipment', value: 150000 },
    { name: 'Supplies', value: 75000 },
    { name: 'Maintenance', value: 45000 },
  ];

  const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        <h1 className="text-3xl font-bold text-white">Executive Dashboard</h1>
        <p className="text-slate-400 mt-2">Financial & Operations Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={`₹${(analytics.totalRevenue / 1000).toFixed(1)}K`}
          icon={<DollarSign />}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          label="Total Expenses"
          value={`₹${(analytics.totalExpenses / 1000).toFixed(1)}K`}
          icon={<Package />}
          trend={{ value: 5, direction: 'down' }}
        />
        <StatCard
          label="Net Profit"
          value={`₹${((analytics.totalRevenue - analytics.totalExpenses) / 1000).toFixed(1)}K`}
          icon={<TrendingUp />}
          trend={{ value: 8, direction: 'up' }}
        />
        <StatCard
          label="Total Staff"
          value={staff.length}
          icon={<Users />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue vs Expenses">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Expense Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${(value / 1000).toFixed(0)}K`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Staff Summary">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="bg-slate-700/30 text-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Salary</th>
                <th className="px-4 py-3 font-semibold">Reports To</th>
              </tr>
            </thead>
            <tbody>
              {staff.slice(0, 8).map((employee) => (
                <tr key={employee.employee_id} className="border-t border-slate-700 hover:bg-slate-700/20 transition">
                  <td className="px-4 py-3 text-white font-medium">{employee.name}</td>
                  <td className="px-4 py-3">{employee.role}</td>
                  <td className="px-4 py-3">₹{employee.salary?.toLocaleString()}</td>
                  <td className="px-4 py-3">{employee.manager_name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/manager/analytics"
            className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition"
          >
            <TrendingUp className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Analytics</p>
          </a>
          <a
            href="/manager/staff"
            className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition"
          >
            <Users className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Staff</p>
          </a>
          <a
            href="/manager/inventory"
            className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition"
          >
            <Package className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Inventory</p>
          </a>
          <a
            href="/manager/reports"
            className="p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded text-center transition"
          >
            <DollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">Reports</p>
          </a>
        </div>
      </Card>
    </div>
  );
}
