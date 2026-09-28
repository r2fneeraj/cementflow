import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { validatePhoneNumber } from '../utils/validation';

export const RegisterView: React.FC = () => {
  const { registerOwner, navigate } = useApp();

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');
    const newErrors: Record<string, string> = {};

    if (!businessName.trim()) {
      newErrors.businessName = 'Business Name is required';
    }

    if (!ownerName.trim()) {
      newErrors.ownerName = 'Owner Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email / Username is required';
    } else if (email.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.error || 'Enter a valid phone number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      await registerOwner({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
      });
    } catch {
      setGlobalError('Failed to create account. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 py-8">
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

        {/* Registration Card Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create Business Account</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Register as the Business Owner to manage dispatch operations
            </p>
          </div>

          {globalError && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{globalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Business Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Singhania Cement Logistics"
                value={businessName}
                disabled={isSubmitting}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  if (errors.businessName) setErrors((p) => ({ ...p, businessName: '' }));
                }}
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                  errors.businessName ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.businessName && (
                <p className="text-[11px] text-red-600 mt-1">{errors.businessName}</p>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Vikram Singhania"
                value={ownerName}
                disabled={isSubmitting}
                onChange={(e) => {
                  setOwnerName(e.target.value);
                  if (errors.ownerName) setErrors((p) => ({ ...p, ownerName: '' }));
                }}
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                  errors.ownerName ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.ownerName && (
                <p className="text-[11px] text-red-600 mt-1">{errors.ownerName}</p>
              )}
            </div>

            {/* Email / Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. owner@singhaniacement.com"
                value={email}
                disabled={isSubmitting}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                }}
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                  errors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 9822012345"
                value={phoneNumber}
                disabled={isSubmitting}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) setErrors((p) => ({ ...p, phoneNumber: '' }));
                }}
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                  errors.phoneNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-[11px] text-red-600 mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: '' }));
                  }}
                  className={`w-full px-3.5 py-2 pr-10 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                    errors.password ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' }));
                  }}
                  className={`w-full px-3.5 py-2 pr-10 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                    errors.confirmPassword ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Non-editable role badge display */}
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Assigned Role:</span>
              <span className="font-semibold text-blue-700 bg-white px-2.5 py-0.5 rounded border border-blue-200">
                Business Owner
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Secondary Link: Already have an account? Login */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('login')}
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer ml-1"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
