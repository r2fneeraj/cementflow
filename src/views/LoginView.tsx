import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, navigate } = useApp();

  const [email, setEmail] = useState('owner@cementflow.demo');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password');
      return;
    }

    const success = login(email);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  const handleQuickDemoFill = (role: 'owner' | 'operator') => {
    if (role === 'owner') {
      setEmail('owner@cementflow.demo');
      setPassword('demo123');
      login('owner@cementflow.demo', 'owner');
    } else {
      setEmail('operator@cementflow.demo');
      setPassword('demo123');
      login('operator@cementflow.demo', 'operator');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Lockup */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center text-white font-bold text-xl shadow-xs mb-3">
            CF
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            CementFlow
          </h1>
          <p className="text-xs text-slate-500 mt-1">Operations, simplified.</p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Welcome back</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sign in to manage truck consignments and dispatches
            </p>
          </div>

          {error && (
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('forgot-password')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                  className="w-full px-3.5 py-2.5 pr-10 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* New Account / Owner Registration Link */}
          <div className="pt-2 text-center">
            <p className="text-xs text-slate-500">
              New to CementFlow?{' '}
              <button
                type="button"
                onClick={() => navigate('register')}
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer ml-1"
              >
                Create New Account
              </button>
            </p>
          </div>

          {/* Demo Accounts Quick-Select for Ease of Prototype Review */}
          <div className="pt-4 border-t border-slate-100">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick Prototype Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('owner')}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors text-left"
              >
                <span className="font-semibold block text-slate-900">Owner Demo</span>
                <span className="text-[11px] text-slate-500 block truncate">owner@cementflow.demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('operator')}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors text-left"
              >
                <span className="font-semibold block text-slate-900">Operator Demo</span>
                <span className="text-[11px] text-slate-500 block truncate">operator@cementflow.demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
