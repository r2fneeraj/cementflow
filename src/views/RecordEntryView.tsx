import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { validateIndianTruckNumber, validatePhoneNumber } from '../utils/validation';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const RecordEntryView: React.FC = () => {
  const { companies, gangs, addEntry, navigate } = useApp();

  // Form states
  const [driverName, setDriverName] = useState('');
  const [truckNumber, setTruckNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cementQuantity, setCementQuantity] = useState<string>('25');
  const [companyId, setCompanyId] = useState<string>(
    companies.find((c) => c.status === 'active')?.id || ''
  );
  const [gangId, setGangId] = useState<string>(
    gangs.find((g) => g.status === 'active')?.id || ''
  );
  const [workerCount, setWorkerCount] = useState<number>(() => {
    const activeGang = gangs.find((g) => g.status === 'active');
    return activeGang ? activeGang.workerCount : 12;
  });

  // Submission & Validation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeCompanies = companies.filter((c) => c.status === 'active');
  const activeGangs = gangs.filter((g) => g.status === 'active');

  const handleGangChange = (selectedGangId: string) => {
    setGangId(selectedGangId);
    const selected = gangs.find((g) => g.id === selectedGangId);
    if (selected) {
      setWorkerCount(selected.workerCount);
    }
  };

  const handleTruckNumberChange = (val: string) => {
    setTruckNumber(val.toUpperCase());
    if (errors.truckNumber) {
      setErrors((prev) => ({ ...prev, truckNumber: '' }));
    }
  };

  const handleResetForm = () => {
    setDriverName('');
    setTruckNumber('');
    setPhoneNumber('');
    setCementQuantity('25');
    setSavedEntryId(null);
    setErrorMessage(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const newErrors: Record<string, string> = {};

    if (!driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }

    const truckValidation = validateIndianTruckNumber(truckNumber);
    if (!truckValidation.isValid) {
      newErrors.truckNumber = truckValidation.error || 'Enter a valid truck number';
    }

    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.error || 'Enter a valid phone number';
    }

    const qty = parseFloat(cementQuantity);
    if (isNaN(qty) || qty <= 0) {
      newErrors.cementQuantity = 'Enter valid tons';
    }

    if (!companyId) {
      newErrors.companyId = 'Select company';
    }

    if (!gangId) {
      newErrors.gangId = 'Select gang';
    }

    if (workerCount <= 0) {
      newErrors.workerCount = 'Min 1 worker';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate backend response time
      await new Promise((resolve) => setTimeout(resolve, 600));

      const selectedCompany = companies.find((c) => c.id === companyId);
      const selectedGang = gangs.find((g) => g.id === gangId);

      const entry = addEntry({
        driverName: driverName.trim(),
        truckNumber: truckValidation.formatted,
        phoneNumber: phoneNumber.trim(),
        cementQuantity: qty,
        companyId,
        companyName: selectedCompany ? selectedCompany.name : 'Unknown Company',
        gangId,
        gangName: selectedGang ? selectedGang.name : 'Unknown Gang',
        workerCount,
        date: '',
        time: '',
      });

      setSavedEntryId(entry.id);
    } catch {
      // Do not clear the form when saving fails
      setErrorMessage(
        'Entry could not be saved. Your entered information is still here. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Record Truck Entry
        </h1>
        <p className="text-xs text-slate-500">Log inward cement consignment</p>
      </div>

      {/* Success Notification Banner */}
      {savedEntryId ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs text-center space-y-3 animate-in fade-in duration-200">
          <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Entry saved successfully
            </h2>
            <p className="text-xs font-mono text-blue-600 font-semibold mt-1">
              Entry ID: {savedEntryId}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Record Another Entry
            </button>
            <button
              type="button"
              onClick={() => navigate('all-entries')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              View All Entries
            </button>
          </div>
        </div>
      ) : (
        /* Main Compact Card Form */
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-5 shadow-xs space-y-3.5"
        >
          {errorMessage && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: TRUCK DETAILS */}
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Truck Details
            </h2>

            {/* Row 1: Driver Name | Truck Number */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Driver Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Santosh Shinde"
                  value={driverName}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setDriverName(e.target.value);
                    if (errors.driverName) setErrors((p) => ({ ...p, driverName: '' }));
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                    errors.driverName ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.driverName && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.driverName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Truck Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="MH18FG1234"
                  value={truckNumber}
                  disabled={isSubmitting}
                  onChange={(e) => handleTruckNumberChange(e.target.value)}
                  className={`w-full px-3 py-2 text-xs sm:text-sm uppercase font-mono bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                    errors.truckNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.truckNumber && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.truckNumber}</p>
                )}
              </div>
            </div>

            {/* Row 2: Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 9821098765"
                value={phoneNumber}
                disabled={isSubmitting}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) setErrors((p) => ({ ...p, phoneNumber: '' }));
                }}
                className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                  errors.phoneNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-[10px] text-red-600 mt-0.5">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: CEMENT DETAILS */}
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Cement Details
            </h2>

            {/* Row 1: Cement Quantity | Cement Company */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cement Quantity (Tons) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder="25"
                  value={cementQuantity}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setCementQuantity(e.target.value);
                    if (errors.cementQuantity) setErrors((p) => ({ ...p, cementQuantity: '' }));
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm font-medium tabular-nums bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                    errors.cementQuantity ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.cementQuantity && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.cementQuantity}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cement Company <span className="text-red-500">*</span>
                </label>
                <select
                  value={companyId}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setCompanyId(e.target.value);
                    if (errors.companyId) setErrors((p) => ({ ...p, companyId: '' }));
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                    errors.companyId ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select Company</option>
                  {activeCompanies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.companyId && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.companyId}</p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: WORKFORCE */}
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Workforce
            </h2>

            {/* Row 1: Gang Name | Worker Count */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gang Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={gangId}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    handleGangChange(e.target.value);
                    if (errors.gangId) setErrors((p) => ({ ...p, gangId: '' }));
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                    errors.gangId ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select Gang</option>
                  {activeGangs.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                {errors.gangId && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.gangId}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Worker Count <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={workerCount}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    setWorkerCount(parseInt(e.target.value, 10) || 0);
                    if (errors.workerCount) setErrors((p) => ({ ...p, workerCount: '' }));
                  }}
                  className={`w-full px-3 py-2 text-xs sm:text-sm font-medium tabular-nums bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors ${
                    errors.workerCount ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.workerCount && (
                  <p className="text-[10px] text-red-600 mt-0.5">{errors.workerCount}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => navigate('dashboard')}
              className="px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
