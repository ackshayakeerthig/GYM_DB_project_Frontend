import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { MemberDashboard } from './member/MemberDashboard';
import { EmployeeDashboard } from './employee/EmployeeDashboard';
import { ManagerDashboard } from './manager/ManagerDashboard';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {user?.role === 'Member' && <MemberDashboard />}
      {user?.role === 'Employee' && <EmployeeDashboard />}
      {user?.role === 'Manager' && <ManagerDashboard />}
    </DashboardLayout>
  );
}
