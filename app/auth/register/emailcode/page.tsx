'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getDemoVerificationCode, getSignupDraft } from '../../authStorage';

export default function EmailVerifyPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const isValidCode = /^\d{6}$/.test(code);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidCode) return;

    if (!getSignupDraft().email) {
      router.replace('/auth/register');
      return;
    }

    if (code !== getDemoVerificationCode()) {
      setError('Invalid code. Use 123456 for this demo.');
      return;
    }

    router.push('/auth/register/password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="relative w-full max-w-sm pt-12 p-6 border border-border-custom/50 rounded-lg shadow-md bg-surface">
        <div className="absolute top-0 left-0 -translate-x-[-30%] -translate-y-[60%]">
          <Image src="/seuljeossi.png" alt="Seuljeossi Character" width={90} height={90} />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2 text-text-main">
          Verify your email
        </h2>
        <p className="text-center text-sm text-text-muted mb-6">
          Demo verification code: {getDemoVerificationCode()}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-text-main mb-1">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              inputMode="numeric"
              pattern="\d*"
              maxLength={6}
              className="w-full border border-border-custom/50 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-border-custom/10 text-text-main bg-transparent placeholder-text-muted"
              placeholder="Enter 6-digit code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!isValidCode}
            className={`w-full font-semibold py-2 rounded-md transition ${
              isValidCode
                ? 'bg-primary-light hover:bg-primary text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Verify
          </button>
        </form>

        <p className="mt-4 text-sm text-text-main text-center">
          Couldn't find a code? <button type="button" className="underline">Resend an email</button>
        </p>
      </div>
    </div>
  );
}
