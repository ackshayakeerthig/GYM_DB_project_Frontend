import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut, User, Bell } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-slate-400 hover:text-white transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-white hidden sm:block">GymTech Pro</h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-slate-400 hover:text-white transition p-2">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 text-slate-300 hover:text-white transition px-3 py-2 rounded hover:bg-slate-700"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg border border-slate-600 py-2 z-50">
                <button className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 transition flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-600 transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
