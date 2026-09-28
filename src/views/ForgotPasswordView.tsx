import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordView: React.FC = () => {
  const { navigate } = useApp();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
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
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          {isSubmitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Check your inbox</h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  A password reset link has been dispatched to{' '}
                  <span className="font-semibold text-slate-700">{email}</span>.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => navigate('reset-password')}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Proceed to Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="w-full py-2 px-4 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Forgot Password</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your email address and we'll send you instructions to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email / Username
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. owner@cementflow.demo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  Send Reset Link
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
