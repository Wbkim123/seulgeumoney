'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaUser, FaLock } from 'react-icons/fa';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, password, remember });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
      <div
        className="w-full max-w-sm p-6 rounded-lg shadow-lg flex flex-col items-center"
        style={{ border: '1px solid var(--primary)' }}
      >
        {/* ✅ Top Illustration */}
        <div className="mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'var(--primary-light)' }}
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
            className="flex items-center rounded-full px-4 py-2"
            style={{ border: '1px solid var(--primary)' }}
          >
            <input
              type="text"
              placeholder="Username"
              className="flex-1 outline-none bg-transparent text-[var(--primary)] placeholder-[var(--primary)] text-left"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="ml-2" color="var(--primary)" size={18} />
          </div>

          <div
            className="flex items-center rounded-full px-4 py-2"
            style={{ border: '1px solid var(--primary)' }}
          >
            <input
              type="password"
              placeholder="Password"
              className="flex-1 outline-none bg-transparent text-[var(--primary)] placeholder-[var(--primary)] text-left"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="ml-2" color="var(--primary)" size={18} />
          </div>

          <div className="flex items-center justify-between text-sm" style={{ color: 'var(--primary)' }}>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-1"
                style={{ accentColor: 'var(--primary)' }}
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#" className="hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="rounded-full py-2 font-semibold transition"
            style={{
              backgroundColor: 'var(--primary-light)',
              color: '#ffffff',
            }}
          >
            Login
          </button>

          <div className="text-center text-sm" style={{ color: 'var(--primary)' }}>
            Don't have an account? <a href="#" className="underline">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
}
