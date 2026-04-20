'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending email:', email);
  };

  // 이메일 유효성 검사 정규식
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="relative w-full max-w-sm pt-12 p-6 border border-[var(--primary)] rounded-lg shadow-md bg-white text-center">

        {/* ✅ 슬저씨 이미지 위치 */}
        <div className="absolute top-0 left-0 -translate-x-[-30%] -translate-y-[60%]">
          <Image
            src="/seuljeossi.png"
            alt="Seuljeossi Character"
            width={90}
            height={90}
          />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-[var(--primary)]">Find Password</h2>

        <input
          type="email"
          placeholder="Enter your e-mail address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-[var(--primary)] text-[#666666] placeholder-[#666666] bg-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]"
        />

        <button
          type="submit"
          disabled={!isValidEmail}
          className={`w-full py-2 rounded-md font-semibold transition
            ${isValidEmail
              ? 'bg-[var(--primary)] hover:bg-[#557d55] text-white'
              : 'bg-gray-300 text-white cursor-not-allowed'}
          `}
        >
          Send Verification Code
        </button>
      </div>
    </div>
  );
}
