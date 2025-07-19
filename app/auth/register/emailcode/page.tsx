'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EmailVerifyPage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  // ✅ 숫자 6자리 검사
  const isValidCode = /^\d{6}$/.test(code);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidCode) {
      console.log('Verification Code:', code);
      // ✅ 다음 단계로 이동
      router.push('/register/password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] px-4">
      <div className="relative w-full max-w-sm pt-12 p-6 border border-[#649566] rounded-lg shadow-md bg-[#ffffff]">

        {/* ✅ 슬저씨 이미지 박스 위 좌측에 걸치게 */}
        <div className="absolute top-0 left-0 -translate-x-[-30%] -translate-y-[60%]">
          <Image
            src="/seuljeossi.png"
            alt="Seuljeossi Character"
            width={90}
            height={90}
            className=""
          />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2 text-[#649566]">
          Verify your email
        </h2>
        <p className="text-center text-sm text-[#4b6656] mb-6">
          We've sent a verification code to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-[#649566] mb-1"
            >
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              inputMode="numeric"
              pattern="\d*"
              className="w-full border border-[#649566] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#98c195] text-[#4b6656] placeholder-[#4b6656]"
              placeholder="Enter 6-digit code"
              required
              value={code}
              onChange={(e) => {
                // 숫자만 허용
                const cleaned = e.target.value.replace(/\D/g, '');
                setCode(cleaned);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!isValidCode}
            className={`w-full font-semibold py-2 rounded-md transition ${
              isValidCode
                ? 'bg-[#98c195] hover:bg-[#649566] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Verify
          </button>
        </form>

        <p className="mt-4 text-sm text-[#649566] text-center">
          Couldn't find a code? <a href="#" className="underline">Resend an email</a>
        </p>
      </div>
    </div>
  );
}
