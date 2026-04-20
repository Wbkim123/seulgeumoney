'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  // ✅ 이메일 유효성 검사 (간단히 @ 포함 여부)
  const isEmailValid = email.includes('@') && email.trim().length > 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailValid) {
      console.log('Email:', email);
      // ✅ 다음 단계로 이동
      router.push('/register/emailcode');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] px-4">
      <div className="w-full max-w-sm p-6 border border-[var(--primary)] rounded-lg shadow-md bg-[#ffffff]">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--primary)]">
          Register
        </h2>

        {/* Apple */}
        <button
          className="flex items-center justify-center w-full border border-[var(--primary)] rounded-md py-2 mb-3 hover:bg-[var(--primary-light)]/30 transition text-[#4b6656] font-medium"
        >
          <span className="mr-2">🍎</span>
          Continue with Apple
        </button>

        {/* Google */}
        <button
          className="flex items-center justify-center w-full border border-[var(--primary)] rounded-md py-2 mb-4 hover:bg-[var(--primary-light)]/30 transition text-[#4b6656] font-medium"
        >
          <span className="mr-2">🌐</span>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-4 border-t border-[var(--primary)]" />

        {/* Email form */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--primary)] mb-1"
          >
            Your Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-[var(--primary)] rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] text-[#4b6656] placeholder-[#4b6656]"
            placeholder="email@address.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={!isEmailValid}
            className={`w-full font-semibold py-2 rounded-md transition ${
              isEmailValid
                ? 'bg-[var(--primary-light)] hover:bg-[var(--primary)] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue with email
          </button>
        </form>

        {/* Terms */}
        <p className="mt-4 text-xs text-[var(--primary)] text-center">
          By continuing, you agree to our{' '}
          <a href="#" className="underline">
            Terms of Use
          </a>{' '}
          and{' '}
          <a href="#" className="underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}
