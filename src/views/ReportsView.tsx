import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Calendar, Layers, Users, Building2, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Entry } from '../types';

export const ReportsView: React.FC = () => {
  const { entries, companies, isOwner, navigate, showToast } = useApp();

  // Filters state
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('weekly');
  const [companyId, setCompanyId] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [generationFeedback, setGenerationFeedback] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().split('T')[0], [today]);

  // Compute date boundaries based on operational Date (entry.date)
  const filterEntries = (
    targetPeriod: 'daily' | 'weekly' | 'monthly' | 'custom',
    targetCompanyId: string,
    targetFrom: string,
    targetTo: string
  ): Entry[] => {
    const activeEntries = entries.filter((e) => !e.isArchived);

    // Compute date range
    let startStr = '';
    let endStr = '';

    if (targetPeriod === 'daily') {
      startStr = todayStr;
      endStr = todayStr;
    } else if (targetPeriod === 'weekly') {
      const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
      const diffToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - diffToMon);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      startStr = monday.toISOString().split('T')[0];
      endStr = sunday.toISOString().split('T')[0];
    } else if (targetPeriod === 'monthly') {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();
      startStr = `${year}-${month}-01`;
      endStr = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
    } else if (targetPeriod === 'custom') {
      startStr = targetFrom;
      endStr = targetTo;
    }

    return activeEntries.filter((entry) => {
      // 1. Company filter
      if (targetCompanyId !== 'all' && entry.companyId !== targetCompanyId) {
        return false;
      }

      // 2. Operational Date filtering strictly on entry.date (never updatedAt!)
      if (startStr && entry.date < startStr) return false;
      if (endStr && entry.date > endStr) return false;

      return true;
    });
  };

  // Initial generated report on load
  const [generatedReport, setGeneratedReport] = useState<{
    hasGenerated: boolean;
    records: Entry[];
    period: string;
    companyId: string;
    summary: {
      totalEntries: number;
      totalCementTons: number;
      totalWorkers: number;
      companiesCovered: number;
    };
  }>(() => {
    const initialRecords = filterEntries('weekly', 'all', '', '');
    return {
      hasGenerated: true,
      records: initialRecords,
      period: 'weekly',
      companyId: 'all',
      summary: {
        totalEntries: initialRecords.length,
        totalCementTons: initialRecords.reduce((acc, curr) => acc + curr.cementQuantity, 0),
        totalWorkers: initialRecords.reduce((acc, curr) => acc + curr.workerCount, 0),
        companiesCovered: new Set(initialRecords.map((e) => e.companyId)).size,
      },
    };
  });

  if (!isOwner) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-800">
          Access restricted. Reports are exclusively accessible to the Business Owner.
        </p>
        <button
          onClick={() => navigate('dashboard')}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Handle Generate Report action
  const handleGenerateReport = async () => {
    setValidationError(null);
    setGenerationFeedback(null);

    // Validate filters
    if (period === 'custom') {
      if (!fromDate || !toDate) {
        setValidationError('Both From Date and To Date are required for custom range.');
        return;
      }
      if (fromDate > toDate) {
        setValidationError('From Date cannot be after To Date.');
        return;
      }
    }

    try {
      setIsGenerating(true);
      // Brief async calculation simulation
      await new Promise((resolve) => setTimeout(resolve, 450));

      const matchingRecords = filterEntries(period, companyId, fromDate, toDate);
      const totalEntries = matchingRecords.length;
      const totalCementTons = matchingRecords.reduce((acc, curr) => acc + curr.cementQuantity, 0);
      const totalWorkers = matchingRecords.reduce((acc, curr) => acc + curr.workerCount, 0);
      const companiesCovered = new Set(matchingRecords.map((e) => e.companyId)).size;

      setGeneratedReport({
        hasGenerated: true,
        records: matchingRecords,
        period,
        companyId,
        summary: {
          totalEntries,
          totalCementTons,
          totalWorkers,
          companiesCovered,
        },
      });

      const message = `Report generated successfully — ${totalEntries} ${totalEntries === 1 ? 'record' : 'records'}`;
      setGenerationFeedback(message);
      showToast(message);
    } catch {
      setValidationError('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Export to Excel / CSV
  const handleExportExcel = async () => {
    if (!generatedReport.hasGenerated || generatedReport.records.length === 0) {
      showToast('Generate a report with records before exporting.', 'error');
      return;
    }

    try {
      setIsExporting(true);
      await new Promise((resolve) => setTimeout(resolve, 400));

      const headers = [
        'Date',
        'Time',
        'Truck Number',
        'Driver',
        'Phone Number',
        'Cement Tons',
        'Company',
        'Gang',
        'Workers',
        'Created By',
        'Entry ID',
      ];

      const rows = generatedReport.records.map((e) => [
        e.date,
        e.time,
        e.truckNumber,
        `"${e.driverName.replace(/"/g, '""')}"`,
        `"${e.phoneNumber}"`,
        e.cementQuantity,
        `"${e.companyName.replace(/"/g, '""')}"`,
        `"${e.gangName.replace(/"/g, '""')}"`,
        e.workerCount,
        `"${e.createdBy.replace(/"/g, '""')}"`,
        e.id,
      ]);

      const csvContent =
        '\uFEFF' + // UTF-8 BOM for Excel compatibility
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `CementFlow_Report_${todayStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Report exported successfully.');
    } catch {
      showToast('Export failed. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const { totalEntries, totalCementTons, totalWorkers, companiesCovered } = generatedReport.summary;
  const records = generatedReport.records;

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Operational Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Generate operational reports based on your selected period and company.
        </p>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {validationError && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}

        {generationFeedback && (
          <div className="p-3 text-xs text-teal-800 bg-teal-50 border border-teal-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
            <span>{generationFeedback}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Filters: Period & Company */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Period Segmented Control */}
            <div className="inline-flex p-1 bg-slate-100 rounded-lg">
              {(['daily', 'weekly', 'monthly', 'custom'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => {
                    setPeriod(key);
                    setValidationError(null);
                    setGenerationFeedback(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize cursor-pointer ${
                    period === key
                      ? 'bg-white text-blue-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {key === 'custom' ? 'Custom Range' : key}
                </button>
              ))}
            </div>

            {/* Company Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Company:</span>
              <select
                value={companyId}
                disabled={isGenerating}
                onChange={(e) => {
                  setCompanyId(e.target.value);
                  setGenerationFeedback(null);
                }}
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="all">All Companies</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons: Primary Generate Report & Secondary Export Excel */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateReport}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
            </button>
            <button
              type="button"
              disabled={isExporting || records.length === 0}
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={records.length === 0 ? 'Generate a report before exporting.' : 'Export to Excel'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export Excel'}</span>
            </button>
          </div>
        </div>

        {/* Custom Range Date Pickers (Shown ONLY when Custom Range is selected) */}
        {period === 'custom' && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">From Date:</span>
              <input
                type="date"
                value={fromDate}
                disabled={isGenerating}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setValidationError(null);
                }}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">To Date:</span>
              <input
                type="date"
                value={toDate}
                disabled={isGenerating}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setValidationError(null);
                }}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Exactly Four Report Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Entries (Blue) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 border-l-2 border-l-blue-600 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">Total Entries</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              {totalEntries}
            </span>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Truck entries</p>
          </div>
        </div>

        {/* 2. Total Cement Tons (Purple) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 border-l-2 border-l-purple-600 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">Total Cement Tons</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-bold text-purple-700 tabular-nums">
              {totalCementTons.toLocaleString()} T
            </span>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Cement quantity</p>
          </div>
        </div>

        {/* 3. Total Workers (Teal) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 border-l-2 border-l-teal-600 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">Total Workers</span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-bold text-teal-700 tabular-nums">
              {totalWorkers}
            </span>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Workers recorded</p>
          </div>
        </div>

        {/* 4. Companies Covered (Orange) */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 border-l-2 border-l-orange-600 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-slate-500">Companies Covered</span>
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
              {companiesCovered}
            </span>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Companies in report</p>
          </div>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Detailed Report
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {records.length} {records.length === 1 ? 'record' : 'records'}
            </p>
          </div>
        </div>

        {records.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">No entries found for the selected criteria.</p>
            <p className="text-xs text-slate-400">Try changing the period or selecting all companies.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Truck Number</th>
                  <th className="py-2.5 px-3">Driver</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3 text-right">Cement Tons</th>
                  <th className="py-2.5 px-3">Gang</th>
                  <th className="py-2.5 px-3 text-center">Workers</th>
                  <th className="py-2.5 px-3">Created By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-slate-600 text-xs tabular-nums whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs tabular-nums whitespace-nowrap">
                      {entry.time}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {entry.truckNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 truncate max-w-[120px]">
                      {entry.driverName}
                    </td>
                    <td className="py-3 px-3 text-slate-700 truncate max-w-[130px]">
                      {entry.companyName}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                      {entry.cementQuantity} T
                    </td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      {entry.gangName}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 tabular-nums">
                      {entry.workerCount}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs truncate max-w-[110px]">
                      {entry.createdBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
