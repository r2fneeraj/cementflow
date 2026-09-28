import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Eye, Edit3, Archive, PlusCircle } from 'lucide-react';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const AllEntriesView: React.FC = () => {
  const { entries, companies, gangs, isOwner, navigate, archiveEntry } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState('all');
  const [selectedGangId, setSelectedGangId] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  // Archive modal state
  const [archiveTargetId, setArchiveTargetId] = useState<string | null>(null);

  // Active entries (non-archived)
  const activeEntries = entries.filter((e) => !e.isArchived);

  // Filtered entries
  const filteredEntries = activeEntries.filter((entry) => {
    // Search query matches truck number, driver name, phone number
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        entry.truckNumber.toLowerCase().includes(q) ||
        entry.driverName.toLowerCase().includes(q) ||
        entry.phoneNumber.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Company filter
    if (selectedCompanyId !== 'all' && entry.companyId !== selectedCompanyId) {
      return false;
    }

    // Gang filter
    if (selectedGangId !== 'all' && entry.gangId !== selectedGangId) {
      return false;
    }

    // Date filter
    if (selectedDate && entry.date !== selectedDate) {
      return false;
    }

    return true;
  });

  const handleConfirmArchive = () => {
    if (archiveTargetId) {
      archiveEntry(archiveTargetId);
      setArchiveTargetId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            All Entries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View and manage operational truck consignments ({filteredEntries.length} {filteredEntries.length === 1 ? 'record' : 'records'})
          </p>
        </div>

        <button
          onClick={() => navigate('record-entry')}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Filter Bar - Clean single row on desktop */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Search Input (Truck Number, Driver Name, Phone Number) */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search truck, driver, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Company Filter */}
          <div>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">All Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Gang Filter */}
          <div>
            <select
              value={selectedGangId}
              onChange={(e) => setSelectedGangId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">All Gangs</option>
              {gangs.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="px-2.5 py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 shrink-0 cursor-pointer"
                title="Clear date"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Simplified Entries List / Table */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-sm font-semibold text-slate-800">No operational entries found</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or filters, or record a new truck dispatch.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop & Tablet Table (lg and up) - Fits comfortably in screen width */}
          <div className="hidden lg:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm table-fixed">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-[15%]">Entry ID</th>
                  <th className="py-3 px-3 w-[16%]">Truck Number</th>
                  <th className="py-3 px-3 w-[18%]">Driver</th>
                  <th className="py-3 px-3 w-[14%] text-right">Quantity (Tons)</th>
                  <th className="py-3 px-3 w-[18%]">Company</th>
                  <th className="py-3 px-3 w-[11%]">Date</th>
                  <th className="py-3 px-3 w-[10%]">Time</th>
                  <th className="py-3 px-3 w-[10%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-medium text-slate-500 text-xs tabular-nums truncate">
                      {entry.id}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900 tabular-nums truncate">
                      {entry.truckNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 truncate">
                      {entry.driverName}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900 tabular-nums">
                      {entry.cementQuantity} T
                    </td>
                    <td className="py-3 px-3 text-slate-700 truncate">
                      {entry.companyName}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs tabular-nums whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs tabular-nums whitespace-nowrap">
                      {entry.time}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate('entry-details', entry.id)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Entry"
                        >
                          View
                        </button>
                        {isOwner && (
                          <button
                            onClick={() => navigate('edit-entry', entry.id)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Entry"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card List (below lg screen) */}
          <div className="lg:hidden space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-base font-bold text-slate-900 tracking-tight">
                      {entry.truckNumber}
                    </span>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {entry.id} · {entry.date} at {entry.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900 tabular-nums">
                      {entry.cementQuantity} Tons
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Driver</span>
                    <span className="font-medium text-slate-800">{entry.driverName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Company</span>
                    <span className="font-medium text-slate-800 truncate block">{entry.companyName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => navigate('entry-details', entry.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  {isOwner && (
                    <button
                      onClick={() => navigate('edit-entry', entry.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Archive Confirmation Modal */}
      <ConfirmModal
        isOpen={archiveTargetId !== null}
        title="Archive Entry"
        message="Are you sure you want to archive this truck entry? It will be removed from operational views."
        confirmText="Archive"
        isDestructive={true}
        onConfirm={handleConfirmArchive}
        onCancel={() => setArchiveTargetId(null)}
      />
    </div>
  );
};
