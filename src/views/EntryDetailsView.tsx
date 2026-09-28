import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Edit3, Archive } from 'lucide-react';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const EntryDetailsView: React.FC = () => {
  const { selectedEntryId, getEntryById, isOwner, navigate, archiveEntry } = useApp();
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const entry = selectedEntryId ? getEntryById(selectedEntryId) : undefined;

  if (!entry) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-800">Entry not found</p>
        <button
          onClick={() => navigate('all-entries')}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Back to All Entries
        </button>
      </div>
    );
  }

  const handleConfirmArchive = () => {
    archiveEntry(entry.id);
    setIsArchiveModalOpen(false);
    navigate('all-entries');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Bar with Back Navigation and Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('all-entries')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Entries</span>
        </button>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('edit-entry', entry.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setIsArchiveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-xs font-mono text-slate-500 block">{entry.id}</span>
            <h1 className="text-xl sm:text-2xl font-mono font-bold text-slate-900 tracking-tight mt-0.5">
              {entry.truckNumber}
            </h1>
          </div>
          <div className="sm:text-right">
            <span className="text-xs text-slate-500 block">Cement Volume</span>
            <span className="text-xl sm:text-2xl font-bold text-blue-600 tabular-nums">
              {entry.cementQuantity} Tons
            </span>
          </div>
        </div>

        {/* Operational Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Driver Name</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{entry.driverName}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Phone Number</span>
            <span className="font-medium text-slate-800 tabular-nums mt-0.5 block">
              {entry.phoneNumber}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Cement Company</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{entry.companyName}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Unloading Gang</span>
            <span className="font-medium text-slate-800 mt-0.5 block">
              {entry.gangName} ({entry.workerCount} workers assigned)
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Operational Date</span>
            <span className="font-medium text-slate-800 tabular-nums mt-0.5 block">
              {entry.date}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Time of Inward</span>
            <span className="font-medium text-slate-800 tabular-nums mt-0.5 block">
              {entry.time}
            </span>
          </div>
        </div>

        {/* Owner-Specific System Audit Details */}
        {isOwner && (
          <div className="pt-5 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              System Audit Metadata (Owner Only)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs bg-slate-50/70 p-3.5 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-400 block">Created By</span>
                <span className="font-medium text-slate-800 mt-0.5 block">{entry.createdBy}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Assigned Shift</span>
                <span className="font-medium text-slate-800 mt-0.5 block">{entry.shift}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Created Timestamp</span>
                <span className="font-mono text-slate-600 mt-0.5 block tabular-nums">
                  {entry.createdAt}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Last Updated Timestamp</span>
                <span className="font-mono text-slate-600 mt-0.5 block tabular-nums">
                  {entry.updatedAt}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isArchiveModalOpen}
        title="Archive Truck Consignment"
        message="Are you sure you want to archive this entry? It will be safely stored and removed from active operations."
        confirmText="Archive"
        isDestructive={true}
        onConfirm={handleConfirmArchive}
        onCancel={() => setIsArchiveModalOpen(false)}
      />
    </div>
  );
};
