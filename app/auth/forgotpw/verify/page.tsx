'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function VerifyCodePage() {
  const [code, setCode] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verifying code:', code);
  };

  // 숫자 6자리만 허용
  const isValidCode = /^\d{6}$/.test(code);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="relative w-full max-w-sm pt-12 p-6 border border-border-custom/50 rounded-lg shadow-md bg-surface text-center">

        {/* ✅ 슬저씨 위치 그대로 */}
        <div className="absolute top-0 left-0 -translate-x-[-30%] -translate-y-[60%]">
          <Image
            src="/seuljeossi.png"
            alt="Seuljeossi Character"
            width={90}
            height={90}
          />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-text-main">Verify Code</h2>

        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={6}
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full px-4 py-2 border border-border-custom/50 text-text-main placeholder-text-muted bg-transparent rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-border-custom/10"
        />

        <button
          type="submit"
          disabled={!isValidCode}
          className={`w-full py-2 rounded-md font-semibold transition
            ${isValidCode
              ? 'bg-primary hover:bg-primary/90 text-white'
              : 'bg-gray-300 dark:bg-gray-600 text-white dark:text-gray-400 cursor-not-allowed'}
          `}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
