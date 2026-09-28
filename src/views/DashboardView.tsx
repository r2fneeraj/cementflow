import React from 'react';
import { useApp } from '../context/AppContext';
import { StatCards } from '../components/dashboard/StatCards';
import { WeeklyActivityChart } from '../components/dashboard/WeeklyActivityChart';
import { RecentActivityTable } from '../components/dashboard/RecentActivityTable';
import { PlusCircle } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { currentUser, isOwner, navigate } = useApp();

  const displayName = currentUser?.name || (isOwner ? 'Vikram Singhania' : 'Ramesh Patil');

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Greeting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isOwner
              ? "Here's today's operation overview."
              : "Here's your activity for today."}
          </p>
        </div>

        {/* Primary Action: Record Entry */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('record-entry')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Entry</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards (Owner or Operator specific) */}
      <StatCards />

      {/* Exactly ONE chart: Weekly Truck Activity (Owner) or Weekly Entries (Operator) */}
      <WeeklyActivityChart />

      {/* Recent Entries - Owner only (Operator dashboard focuses strictly on own daily operations) */}
      {isOwner && <RecentActivityTable />}
    </div>
  );
};
