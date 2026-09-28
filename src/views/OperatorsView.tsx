import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus, Edit3, X } from 'lucide-react';

export const OperatorsView: React.FC = () => {
  const {
    users,
    addOperator,
    updateOperator,
    toggleOperatorStatus,
    operatorHasEntries,
    navigate,
    isOwner,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOpName, setNewOpName] = useState('');
  const [newOpEmail, setNewOpEmail] = useState('');
  const [newOpPhone, setNewOpPhone] = useState('');
  const [newOpPassword, setNewOpPassword] = useState('demo123');

  const [editingOpId, setEditingOpId] = useState<string | null>(null);
  const [editOpName, setEditOpName] = useState('');
  const [editOpEmail, setEditOpEmail] = useState('');
  const [editOpPhone, setEditOpPhone] = useState('');

  if (!isOwner) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-800">Access restricted to Business Owner.</p>
        <button
          onClick={() => navigate('dashboard')}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const operators = users.filter((u) => u.role === 'operator');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpName.trim() || !newOpEmail.trim()) return;
    addOperator(newOpName.trim(), newOpEmail.trim(), newOpPhone.trim());
    setNewOpName('');
    setNewOpEmail('');
    setNewOpPhone('');
    setNewOpPassword('demo123');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpId || !editOpName.trim() || !editOpEmail.trim()) return;
    updateOperator(editingOpId, editOpName.trim(), editOpEmail.trim(), editOpPhone.trim());
    setEditingOpId(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('settings')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Settings</span>
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Operator</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Operators
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational terminal staff authorized to record and view consignments
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {operators.map((operator) => {
            const hasHistory = operatorHasEntries(operator.name);

            return (
              <div
                key={operator.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {operator.name}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{operator.email}</div>
                  <div className="text-xs text-slate-600 mt-0.5 tabular-nums">
                    {operator.phoneNumber || 'No phone set'}
                  </div>
                  <span
                    className={`inline-block text-[11px] font-medium mt-1 ${
                      operator.status === 'active' ? 'text-teal-700' : 'text-slate-400'
                    }`}
                  >
                    {operator.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setEditingOpId(operator.id);
                      setEditOpName(operator.name);
                      setEditOpEmail(operator.email);
                      setEditOpPhone(operator.phoneNumber || '');
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => {
                      if (operator.status === 'active' && hasHistory) {
                        // Deactivate safely rather than permanently delete
                        toggleOperatorStatus(operator.id);
                      } else {
                        toggleOperatorStatus(operator.id);
                      }
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      operator.status === 'active'
                        ? 'text-red-600 bg-red-50 hover:bg-red-100'
                        : 'text-teal-700 bg-teal-50 hover:bg-teal-100'
                    }`}
                  >
                    {operator.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Operator Modal - Exactly 4 fields: Operator Name, Email / Username, Phone Number, Temporary Password */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg max-w-sm w-full p-5 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Add Operator</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operator Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patil"
                  value={newOpName}
                  onChange={(e) => setNewOpName(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email / Username
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@cementflow.demo"
                  value={newOpEmail}
                  onChange={(e) => setNewOpEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98221 54321"
                  value={newOpPhone}
                  onChange={(e) => setNewOpPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Temporary Password
                </label>
                <input
                  type="text"
                  value={newOpPassword}
                  onChange={(e) => setNewOpPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Save Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Operator Modal */}
      {editingOpId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg max-w-sm w-full p-5 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Edit Operator</h3>
              <button
                onClick={() => setEditingOpId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operator Name
                </label>
                <input
                  type="text"
                  value={editOpName}
                  onChange={(e) => setEditOpName(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email / Username
                </label>
                <input
                  type="email"
                  value={editOpEmail}
                  onChange={(e) => setEditOpEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editOpPhone}
                  onChange={(e) => setEditOpPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOpId(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
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
