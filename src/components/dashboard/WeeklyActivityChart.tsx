import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const WeeklyActivityChart: React.FC = () => {
  const { entries, isOwner, currentUser } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const operatorName = currentUser?.name || 'Ramesh Patil';

  // Compute Monday of the current week
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
  const diffToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMon);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weekData = weekDays.map((dayName, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const dateStr = d.toISOString().split('T')[0];

    // Count of truck entries for this date
    // If operator, only count entries created by this operator!
    const count = entries.filter((e) => {
      if (e.isArchived || e.date !== dateStr) return false;
      if (!isOwner && e.createdBy !== operatorName) return false;
      return true;
    }).length;

    const isToday = dateStr === todayStr;

    return {
      dayName,
      dateStr,
      count,
      isToday,
    };
  });

  const totalWeeklyTrucks = weekData.reduce((sum, item) => sum + item.count, 0);
  const maxTrucks = Math.max(...weekData.map((d) => d.count), 4);
  // Y-axis ticks
  const yTicks = [maxTrucks, Math.round(maxTrucks / 2), 0];

  const title = isOwner ? 'Weekly Truck Activity' : 'Weekly Entries';
  const description = isOwner
    ? 'Number of truck entries for each day of the current week'
    : 'Your truck entries for the current week.';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {description}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-500">
            {isOwner ? 'Weekly Total: ' : 'Your Total: '}
          </span>
          <span className="text-xs font-semibold text-blue-600 tabular-nums">
            {totalWeeklyTrucks} {totalWeeklyTrucks === 1 ? 'Truck' : 'Trucks'}
          </span>
        </div>
      </div>

      {/* Chart container with Y-axis and Bars */}
      <div className="relative pt-4 pb-2">
        <div className="flex h-48 sm:h-52 gap-3">
          {/* Y-Axis scale */}
          <div className="flex flex-col justify-between text-[11px] text-slate-400 font-mono select-none pr-1 pb-6 text-right w-6 shrink-0">
            {yTicks.map((val, idx) => (
              <span key={idx}>{val}</span>
            ))}
          </div>

          {/* Bar Chart Area */}
          <div className="flex-1 flex flex-col justify-between relative border-l border-b border-slate-200 pl-2">
            {/* Subtle horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 pl-2 pr-2">
              <div className="border-b border-dashed border-slate-100 w-full" />
              <div className="border-b border-dashed border-slate-100 w-full" />
              <div className="w-full" />
            </div>

            {/* Bars */}
            <div className="h-full flex items-end justify-between gap-2 sm:gap-4 pb-6 px-1 relative z-10">
              {weekData.map((item, index) => {
                const heightPercent = maxTrucks > 0 ? Math.round((item.count / maxTrucks) * 100) : 0;
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={item.dayName}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Floating Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-11 z-20 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-md shadow-md whitespace-nowrap pointer-events-none tabular-nums animate-in fade-in duration-150">
                        {item.count} {item.count === 1 ? 'truck entry' : 'truck entries'} ({item.dateStr})
                      </div>
                    )}

                    {/* Count label above bar */}
                    {item.count > 0 && (
                      <span className="text-[11px] font-semibold text-slate-600 tabular-nums mb-1">
                        {item.count}
                      </span>
                    )}

                    {/* Bar */}
                    <div className="w-full max-w-[48px] flex flex-col items-center justify-end h-full">
                      <div
                        style={{ height: item.count > 0 ? `${Math.max(10, heightPercent)}%` : '4px' }}
                        className={`w-full rounded-t-md transition-all duration-200 ${
                          item.count === 0
                            ? 'bg-slate-100'
                            : item.isToday
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : isHovered
                            ? 'bg-blue-500'
                            : 'bg-blue-400/80 hover:bg-blue-500'
                        }`}
                      />
                    </div>

                    {/* Day Label on X-Axis */}
                    <div className="absolute -bottom-6 w-full text-center">
                      <span
                        className={`text-xs block font-medium ${
                          item.isToday
                            ? 'text-blue-600 font-bold'
                            : 'text-slate-600'
                        }`}
                      >
                        {item.dayName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
