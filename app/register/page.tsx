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
      <div className="w-full max-w-sm p-6 border border-[#649566] rounded-lg shadow-md bg-[#ffffff]">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#649566]">
          Register
        </h2>

        {/* Apple */}
        <button
          className="flex items-center justify-center w-full border border-[#649566] rounded-md py-2 mb-3 hover:bg-[#98c195]/30 transition text-[#4b6656] font-medium"
        >
          <span className="mr-2">🍎</span>
          Continue with Apple
        </button>

        {/* Google */}
        <button
          className="flex items-center justify-center w-full border border-[#649566] rounded-md py-2 mb-4 hover:bg-[#98c195]/30 transition text-[#4b6656] font-medium"
        >
          <span className="mr-2">🌐</span>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-4 border-t border-[#649566]" />

        {/* Email form */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#649566] mb-1"
          >
            Your Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-[#649566] rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#98c195] text-[#4b6656] placeholder-[#4b6656]"
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
                ? 'bg-[#98c195] hover:bg-[#649566] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue with email
          </button>
        </form>

        {/* Terms */}
        <p className="mt-4 text-xs text-[#649566] text-center">
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
