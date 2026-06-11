'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock } from 'react-icons/fa';
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  authenticateAdmin,
  authenticateUser,
  saveAdminSession,
  saveUserSession,
} from '../authStorage';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authenticateAdmin(identifier, password)) {
      saveAdminSession(remember);
      router.push('/mainpage');
      return;
    }

    const user = authenticateUser(identifier, password);

    if (!user) {
      setError('Invalid email or password.');
      return;
    }

    saveUserSession(user, remember);
    router.push('/mainpage');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        className="w-full max-w-sm p-6 rounded-lg shadow-lg flex flex-col items-center bg-surface border border-border-custom/50"
      >
        {/* ✅ Top Illustration */}
        <div className="mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-primary-light"
          >
            <Image
              src="/seuljeossi.png"
              alt="Profile Illustration"
              width={96}
              height={96}
              className="object-contain mt-2"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div
            className="flex items-center rounded-full px-4 py-2 border border-border-custom/50 focus-within:ring-2 focus-within:ring-border-custom/10"
          >
            <input
              type="text"
              placeholder="Email address"
              className="flex-1 outline-none bg-transparent text-text-main placeholder-text-muted text-left"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <FaUser className="ml-2 text-primary" size={18} />
          </div>

          <div
            className="flex items-center rounded-full px-4 py-2 border border-border-custom/50 focus-within:ring-2 focus-within:ring-border-custom/10"
          >
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="flex-1 outline-none bg-transparent text-text-main placeholder-text-muted text-left"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="ml-2 text-primary" size={18} />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <div className="rounded-lg bg-primary-muted px-3 py-2 text-xs font-bold leading-5 text-text-muted">
            Demo admin: {ADMIN_USERNAME} / {ADMIN_PASSWORD}
          </div>

          <div className="flex items-center justify-between text-sm text-text-main">
            <label className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer accent-primary"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <label className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer accent-primary"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show password
            </label>
          </div>

          <button
            type="submit"
            className="cursor-pointer rounded-full py-2 font-semibold transition bg-primary-light text-white hover:bg-primary"
          >
            Login
          </button>

          <Link href="/auth/forgotpw" className="text-center text-sm text-text-muted hover:underline">
            Forgot password?
          </Link>

          <div className="text-center text-sm text-text-main">
            Don't have an account? <Link href="/auth/register" className="underline text-text-muted">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
