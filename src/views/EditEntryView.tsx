import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { validateIndianTruckNumber, validatePhoneNumber } from '../utils/validation';
import { ArrowLeft } from 'lucide-react';

export const EditEntryView: React.FC = () => {
  const { selectedEntryId, getEntryById, companies, gangs, isOwner, updateEntry, navigate } =
    useApp();

  const entry = selectedEntryId ? getEntryById(selectedEntryId) : undefined;

  const [driverName, setDriverName] = useState(entry?.driverName || '');
  const [truckNumber, setTruckNumber] = useState(entry?.truckNumber || '');
  const [phoneNumber, setPhoneNumber] = useState(entry?.phoneNumber || '');
  const [cementQuantity, setCementQuantity] = useState(entry?.cementQuantity.toString() || '25');
  const [companyId, setCompanyId] = useState(entry?.companyId || '');
  const [gangId, setGangId] = useState(entry?.gangId || '');
  const [workerCount, setWorkerCount] = useState(entry?.workerCount || 12);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (entry) {
      setDriverName(entry.driverName);
      setTruckNumber(entry.truckNumber);
      setPhoneNumber(entry.phoneNumber);
      setCementQuantity(entry.cementQuantity.toString());
      setCompanyId(entry.companyId);
      setGangId(entry.gangId);
      setWorkerCount(entry.workerCount);
    }
  }, [entry]);

  // Protect Owner-only route
  if (!isOwner) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-800">
          Access restricted. Only the Business Owner can edit entries.
        </p>
        <button
          onClick={() => navigate('all-entries')}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Return to All Entries
        </button>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-800">Entry not found</p>
        <button
          onClick={() => navigate('all-entries')}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Return to All Entries
        </button>
      </div>
    );
  }

  const handleGangChange = (selectedGangId: string) => {
    setGangId(selectedGangId);
    const selected = gangs.find((g) => g.id === selectedGangId);
    if (selected) {
      setWorkerCount(selected.workerCount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      newErrors.cementQuantity = 'Enter a valid quantity (tons)';
    }

    if (!companyId) {
      newErrors.companyId = 'Select a cement company';
    }

    if (!gangId) {
      newErrors.gangId = 'Select an unloading gang';
    }

    if (workerCount <= 0) {
      newErrors.workerCount = 'Worker count must be at least 1';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCompany = companies.find((c) => c.id === companyId);
    const selectedGang = gangs.find((g) => g.id === gangId);

    updateEntry(entry.id, {
      driverName: driverName.trim(),
      truckNumber: truckValidation.formatted,
      phoneNumber: phoneNumber.trim(),
      cementQuantity: qty,
      companyId,
      companyName: selectedCompany ? selectedCompany.name : entry.companyName,
      gangId,
      gangName: selectedGang ? selectedGang.name : entry.gangName,
      workerCount,
    });

    navigate('entry-details', entry.id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Bar with Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('entry-details', entry.id)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </button>
        <span className="text-xs font-mono text-slate-400">Editing: {entry.id}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Edit Truck Entry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modify consignment details. Operational date ({entry.date}) and time ({entry.time}) remain preserved.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Driver Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Driver Name
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => {
                  setDriverName(e.target.value);
                  if (errors.driverName) setErrors((p) => ({ ...p, driverName: '' }));
                }}
                className={`w-full px-3 py-2 text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                  errors.driverName ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.driverName && (
                <p className="text-[11px] text-red-600 mt-1">{errors.driverName}</p>
              )}
            </div>

            {/* Truck Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Truck Number
              </label>
              <input
                type="text"
                value={truckNumber}
                onChange={(e) => {
                  setTruckNumber(e.target.value.toUpperCase());
                  if (errors.truckNumber) setErrors((p) => ({ ...p, truckNumber: '' }));
                }}
                className={`w-full px-3 py-2 text-sm uppercase font-mono bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                  errors.truckNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.truckNumber && (
                <p className="text-[11px] text-red-600 mt-1">{errors.truckNumber}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) setErrors((p) => ({ ...p, phoneNumber: '' }));
                }}
                className={`w-full px-3 py-2 text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                  errors.phoneNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-[11px] text-red-600 mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Cement Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cement Quantity (Tons)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={cementQuantity}
                onChange={(e) => {
                  setCementQuantity(e.target.value);
                  if (errors.cementQuantity) setErrors((p) => ({ ...p, cementQuantity: '' }));
                }}
                className={`w-full px-3 py-2 text-sm font-medium tabular-nums bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                  errors.cementQuantity ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.cementQuantity && (
                <p className="text-[11px] text-red-600 mt-1">{errors.cementQuantity}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cement Company
              </label>
              <select
                value={companyId}
                onChange={(e) => {
                  setCompanyId(e.target.value);
                  if (errors.companyId) setErrors((p) => ({ ...p, companyId: '' }));
                }}
                className={`w-full px-3 py-2 text-sm bg-slate-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                  errors.companyId ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Gang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workforce Gang
              </label>
              <select
                value={gangId}
                onChange={(e) => handleGangChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {gangs.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.workerCount} workers)
                  </option>
                ))}
              </select>
            </div>

            {/* Worker Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Worker Count
              </label>
              <input
                type="number"
                min="1"
                value={workerCount}
                onChange={(e) => setWorkerCount(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-sm tabular-nums bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('entry-details', entry.id)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
