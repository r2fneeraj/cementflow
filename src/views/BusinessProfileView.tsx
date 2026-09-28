import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';

export const BusinessProfileView: React.FC = () => {
  const { businessProfile, updateBusinessProfile, navigate, isOwner } = useApp();

  const [businessName, setBusinessName] = useState(businessProfile.businessName);
  const [ownerName, setOwnerName] = useState(businessProfile.ownerName);
  const [contactNumber, setContactNumber] = useState(businessProfile.contactNumber);
  const [businessAddress, setBusinessAddress] = useState(businessProfile.businessAddress);

  if (!isOwner) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-800">Access restricted to Business Owner.</p>
        <button
          onClick={() => navigate('dashboard')}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile({
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      contactNumber: contactNumber.trim(),
      businessAddress: businessAddress.trim(),
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('settings')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Settings</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Business Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational terminal information and verified enterprise identity
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {/* Business Logo Indicator */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Business Logo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                  CF
                </div>
                <div className="text-xs text-slate-500">
                  <span className="font-medium text-slate-800 block">CementFlow Default Mark</span>
                  <span>Standardized vector asset</span>
                </div>
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Business Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Address
              </label>
              <textarea
                rows={3}
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
