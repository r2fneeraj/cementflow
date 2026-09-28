import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Edit3, X } from 'lucide-react';

export const CompaniesView: React.FC = () => {
  const { companies, addCompany, updateCompany, toggleCompanyStatus, navigate, isOwner } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editCompanyName, setEditCompanyName] = useState('');

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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    addCompany(newCompanyName.trim());
    setNewCompanyName('');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompanyId || !editCompanyName.trim()) return;
    updateCompany(editingCompanyId, editCompanyName.trim());
    setEditingCompanyId(null);
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

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Companies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered cement manufacturers and brand supply partners
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {companies.map((company) => (
            <div
              key={company.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div>
                <span className="text-sm font-semibold text-slate-900 block">
                  {company.name}
                </span>
                <span
                  className={`inline-block text-[11px] font-medium mt-0.5 ${
                    company.status === 'active' ? 'text-teal-700' : 'text-slate-400'
                  }`}
                >
                  {company.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingCompanyId(company.id);
                    setEditCompanyName(company.name);
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => toggleCompanyStatus(company.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                    company.status === 'active'
                      ? 'text-red-600 bg-red-50 hover:bg-red-100'
                      : 'text-teal-700 bg-teal-50 hover:bg-teal-100'
                  }`}
                >
                  {company.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Add Company</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. UltraTech Cement"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      {editingCompanyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Edit Company</h3>
              <button
                onClick={() => setEditingCompanyId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCompanyId(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
