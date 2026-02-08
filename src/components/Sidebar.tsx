import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  Calendar,
  Users,
  Zap,
  ShoppingCart,
  TrendingUp,
  Dumbbell,
  Settings,
  ClipboardList,
  Package,
  Wrench,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const memberMenu = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'Fitness Journey', path: '/member/fitness', icon: TrendingUp },
    { label: 'Class Schedule', path: '/member/classes', icon: Calendar },
    { label: 'Subscription Plans', path: '/member/plans', icon: Dumbbell },
    { label: 'Profile', path: '/member/profile', icon: Users },
    { label: 'Purchase History', path: '/member/purchases', icon: ShoppingCart },
    { label: 'Shop Inventory', path: '/member/shop', icon: ShoppingCart },
    { label: 'Equipment Status', path: '/member/equipment', icon: Zap },
  ];

  const employeeMenu = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'My Classes', path: '/employee/classes', icon: Calendar },
    { label: 'Manage Classes', path: '/employee/manage-classes', icon: ClipboardList },
    { label: 'Equipment Status', path: '/employee/equipment', icon: Zap },
    { label: 'Log Entry', path: '/employee/log-entry', icon: ClipboardList },
    { label: 'Inventory', path: '/employee/inventory', icon: Package },
    { label: 'Suppliers', path: '/employee/suppliers', icon: Settings },
    { label: 'Members', path: '/employee/members', icon: Users },
    { label: 'Maintenance Logs', path: '/employee/maintenance', icon: Wrench },
    { label: 'Profile', path: '/employee/profile', icon: Users },
  ];

  const managerMenu = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    // { label: 'Analytics', path: '/manager/analytics', icon: TrendingUp },
    { label: 'Staff Management', path: '/manager/staff', icon: Users },
    { label: 'Classes', path: '/manager/classes', icon: Calendar },
    { label: 'Equipment', path: '/manager/equipment', icon: Zap },
    { label: 'Inventory', path: '/manager/inventory', icon: Package },
    { label: 'Suppliers', path: '/manager/suppliers', icon: Settings },
    { label: 'Members', path: '/manager/members', icon: Users },
    // { label: 'Reports', path: '/manager/reports', icon: ClipboardList },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'Member':
        return memberMenu;
      case 'Employee':
        return employeeMenu;
      case 'Manager':
        return managerMenu;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-slate-800 border-r border-slate-700 z-40 transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-emerald-500" />
              <span className="font-bold text-white">GymTech</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2 rounded transition ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
