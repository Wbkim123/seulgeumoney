'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ✅ 유효성 검사
  const isLongEnough = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const isMatch = confirmPassword && password === confirmPassword;

  // ✅ 버튼 활성화 여부
  const isFormValid = isLongEnough && hasNumber && hasSymbol && hasUppercase && isMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log('Password set!', password);
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
          Reset your password
        </h2>
        <p className="text-center text-sm text-[#4b6656] mb-6">
          Your password must be at least 8 characters long, and include 1 uppercase, 1 symbol and 1 number.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#649566] mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="New password"
              className="w-full border border-[#649566] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#98c195] text-[#4b6656] placeholder-[#4b6656]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#649566] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter password"
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                confirmPassword
                  ? isMatch
                    ? 'border-[#98c195] focus:ring-[#98c195]'
                    : 'border-red-400 focus:ring-red-200'
                  : 'border-[#649566] focus:ring-[#98c195]'
              } text-[#4b6656] placeholder-[#4b6656]`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && (
              <p className={`mt-1 text-sm ${isMatch ? 'text-[#98c195]' : 'text-red-500'}`}>
                {isMatch ? 'Passwords match ✅' : 'Passwords do not match ❌'}
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-[#4b6656]">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  isLongEnough ? 'bg-[#98c195]' : 'bg-gray-300'
                }`}
              ></span>
              Minimum 8 characters
            </div>
            <div className="flex items-center text-sm text-[#4b6656]">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  hasNumber ? 'bg-[#98c195]' : 'bg-gray-300'
                }`}
              ></span>
              At least one number
            </div>
            <div className="flex items-center text-sm text-[#4b6656]">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  hasSymbol ? 'bg-[#98c195]' : 'bg-gray-300'
                }`}
              ></span>
              At least one symbol
            </div>
            <div className="flex items-center text-sm text-[#4b6656]">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  hasUppercase ? 'bg-[#98c195]' : 'bg-gray-300'
                }`}
              ></span>
              At least one uppercase
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full font-semibold py-2 rounded-md transition ${
              isFormValid
                ? 'bg-[#98c195] hover:bg-[#649566] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
