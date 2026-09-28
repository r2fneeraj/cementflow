import React from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, Edit3 } from 'lucide-react';

export const RecentActivityTable: React.FC = () => {
  const { entries, navigate, isOwner } = useApp();

  const recentEntries = entries
    .filter((e) => !e.isArchived)
    .slice(0, 5);

  return (
    // Hidden on mobile, visible on md and up screens
    <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recent Entries
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest operational truck dispatches
          </p>
        </div>
        <button
          onClick={() => navigate('all-entries')}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View all entries
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">Truck Number</th>
              <th className="py-2.5 px-4">Driver</th>
              <th className="py-2.5 px-4">Company</th>
              <th className="py-2.5 px-4 text-right">Quantity (Tons)</th>
              <th className="py-2.5 px-4">Date</th>
              <th className="py-2.5 px-4">Time</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentEntries.map((entry) => (
              <tr
                key={entry.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-3 px-4 font-mono font-medium text-slate-900 tabular-nums">
                  {entry.truckNumber}
                </td>
                <td className="py-3 px-4 text-slate-800">{entry.driverName}</td>
                <td className="py-3 px-4 text-slate-600">{entry.companyName}</td>
                <td className="py-3 px-4 text-right font-medium text-slate-900 tabular-nums">
                  {entry.cementQuantity} Tons
                </td>
                <td className="py-3 px-4 text-slate-600 text-xs tabular-nums">
                  {entry.date}
                </td>
                <td className="py-3 px-4 text-slate-600 text-xs tabular-nums">
                  {entry.time}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate('entry-details', entry.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View Entry"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => navigate('edit-entry', entry.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Entry"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
