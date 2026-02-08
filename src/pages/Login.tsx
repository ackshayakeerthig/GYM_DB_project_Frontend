import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8">
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <Dumbbell className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">GymTech Pro</h1>
          <p className="text-center text-slate-400 mb-8">Professional Gym Management</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-6 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                placeholder="Enter username"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-sm text-slate-400 text-center mb-4">Demo Credentials</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoClick('member1')}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-3 rounded transition"
              >
                Member
              </button>
              <button
                onClick={() => handleDemoClick('employee1')}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-3 rounded transition"
              >
                Employee
              </button>
              <button
                onClick={() => handleDemoClick('manager1')}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-3 rounded transition"
              >
                Manager
              </button>
            </div>
            <p className="text-xs text-slate-500 text-center mt-3">Password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
