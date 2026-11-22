import React, { useState } from 'react';
import { ArrowLeft, Lock, LogIn } from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { pickText } from '../../utils/schoolHelpers';
import { SchoolCrest } from '../SchoolCrest';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { data, language, loginAdmin, showToast } = useSchoolData();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await loginAdmin(password);
      if (result.ok) {
        showToast('Signed in to School Admin CMS.');
      } else {
        setError(result.error || 'Unauthorized: Invalid administrator password.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-stone-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <SchoolCrest className="w-10 h-10 shrink-0" />
          <div>
            <h1 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-50">
              Admin CMS Portal
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {pickText(data.schoolName, language)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-cms-password"
              className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5"
            >
              Administrator Password
            </label>
            <input
              id="admin-cms-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter administrator password"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm border border-stone-200 dark:border-stone-700 bg-[#FBF9F5] dark:bg-stone-950 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-medium text-red-700 dark:text-red-300"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            <span>{submitting ? 'Verifying...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Server-verified access</span>
          </span>
          <button
            type="button"
            onClick={onBackToSite}
            className="inline-flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-200 hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>View Live Site</span>
          </button>
        </div>
      </div>
    </div>
  );
};
