import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Layers, Users, Building2 } from 'lucide-react';

export const StatCards: React.FC = () => {
  const { entries, gangs, companies, isOwner, currentUser } = useApp();

  const activeEntries = entries.filter((e) => !e.isArchived);
  const todayStr = new Date().toISOString().split('T')[0];

  if (isOwner) {
    // Owner Summary Cards
    const todayEntries = activeEntries.filter((e) => e.date === todayStr);
    const todayEntriesCount = todayEntries.length;
    const totalCementTons = activeEntries.reduce((acc, curr) => acc + curr.cementQuantity, 0);
    const totalWorkers = gangs
      .filter((g) => g.status === 'active')
      .reduce((acc, curr) => acc + curr.workerCount, 0);
    const activeCompaniesCount = companies.filter((c) => c.status === 'active').length;

    const stats = [
      {
        label: "Today's Entries",
        value: todayEntriesCount.toString(),
        subtext: 'Logged today',
        icon: Calendar,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        borderAccent: 'border-l-2 border-l-blue-600',
      },
      {
        label: 'Total Cement Tons',
        value: `${totalCementTons.toLocaleString()} T`,
        subtext: 'Dispatched volume',
        icon: Layers,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
        borderAccent: 'border-l-2 border-l-purple-600',
      },
      {
        label: 'Total Workers',
        value: totalWorkers.toString(),
        subtext: 'Across active gangs',
        icon: Users,
        iconBg: 'bg-teal-50',
        iconColor: 'text-teal-600',
        borderAccent: 'border-l-2 border-l-teal-600',
      },
      {
        label: 'Companies Covered',
        value: activeCompaniesCount.toString(),
        subtext: 'Active manufacturers',
        icon: Building2,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-600',
        borderAccent: 'border-l-2 border-l-orange-600',
      },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-xl border border-slate-200 p-4 sm:p-5 transition-shadow hover:shadow-xs ${stat.borderAccent}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                  {stat.label}
                </span>
                <div
                  className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}
                >
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-2.5">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
                  {stat.value}
                </span>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                  {stat.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Operator Summary Cards (Strictly 4 cards per requirements):
  // 1. Today's Entries (Blue)
  // 2. Today's Cement Tons (Purple)
  // 3. Companies Used (Orange)
  // 4. Gangs Used (Teal/Green)
  const operatorName = currentUser?.name || 'Ramesh Patil';
  const operatorTodayEntries = activeEntries.filter(
    (e) => e.date === todayStr && e.createdBy === operatorName
  );

  const todayEntriesCount = operatorTodayEntries.length;
  const todayCementTons = operatorTodayEntries.reduce((acc, curr) => acc + curr.cementQuantity, 0);
  const companiesUsed = new Set(operatorTodayEntries.map((e) => e.companyId)).size;
  const gangsUsed = new Set(operatorTodayEntries.map((e) => e.gangId)).size;

  const operatorStats = [
    {
      label: "Today's Entries",
      value: todayEntriesCount.toString(),
      subtext: 'Recorded by you',
      icon: Calendar,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderAccent: 'border-l-2 border-l-blue-600',
    },
    {
      label: "Today's Cement Tons",
      value: `${todayCementTons.toLocaleString()} T`,
      subtext: 'Your logged tons',
      icon: Layers,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderAccent: 'border-l-2 border-l-purple-600',
    },
    {
      label: 'Companies Used',
      value: companiesUsed.toString(),
      subtext: 'Manufacturers today',
      icon: Building2,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderAccent: 'border-l-2 border-l-orange-600',
    },
    {
      label: 'Gangs Used',
      value: gangsUsed.toString(),
      subtext: 'Workforce gangs today',
      icon: Users,
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      borderAccent: 'border-l-2 border-l-teal-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {operatorStats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`bg-white rounded-xl border border-slate-200 p-4 sm:p-5 transition-shadow hover:shadow-xs ${stat.borderAccent}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                {stat.label}
              </span>
              <div
                className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}
              >
                <Icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
                {stat.value}
              </span>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
