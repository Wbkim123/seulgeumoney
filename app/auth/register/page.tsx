'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { findUserByEmail, updateSignupDraft } from '../authStorage';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isEmailValid) return;

    if (findUserByEmail(email)) {
      setError('An account already exists with this email.');
      return;
    }

    updateSignupDraft({ email: email.trim().toLowerCase() });
    router.push('/auth/register/emailcode');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm p-6 border border-border-custom/50 rounded-lg shadow-md bg-surface">
        <h2 className="text-2xl font-semibold text-center mb-6 text-text-main">
          Register
        </h2>

        <button className="flex items-center justify-center w-full border border-border-custom/50 rounded-md py-2 mb-3 hover:bg-primary-light/30 transition text-text-muted font-medium">
          <span className="mr-2">A</span>
          Continue with Apple
        </button>

        <button className="flex items-center justify-center w-full border border-border-custom/50 rounded-md py-2 mb-4 hover:bg-primary-light/30 transition text-text-muted font-medium">
          <span className="mr-2">G</span>
          Continue with Google
        </button>

        <div className="my-4 border-t border-border-custom/50" />

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1">
            Your Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-border-custom/50 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-border-custom/10 text-text-main bg-transparent placeholder-text-muted"
            placeholder="email@address.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!isEmailValid}
            className={`w-full font-semibold py-2 rounded-md transition ${
              isEmailValid
                ? 'bg-primary-light hover:bg-primary text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue with email
          </button>
        </form>

        <p className="mt-4 text-xs text-text-muted text-center">
          By continuing, you agree to our <a href="#" className="underline">Terms of Use</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
