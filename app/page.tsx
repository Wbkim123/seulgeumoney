'use client';

import { useState } from 'react';
import Sidebar from '../components/sidebar';
import CalendarSidebar from '../components/sidecalendar';
import { HiOutlineBars3 } from 'react-icons/hi2';
import Image from 'next/image';
import { HiUser } from 'react-icons/hi2';

type GoalPillProps = {
  label: string;
  valueText: string;
  percent?: number;
  tone?: 'normal' | 'danger';
};

function GoalPill({ label, valueText, percent = 0, tone = 'normal' }: GoalPillProps) {
  const safe = Math.max(0, Math.min(100, percent));
  const isDanger = tone === 'danger';

  return (
    <div className="w-full rounded-full bg-white/90 px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-800">{label}</span>
        <span className={isDanger ? 'text-red-500 font-semibold' : 'text-slate-700 font-semibold'}>
          {valueText}
        </span>
      </div>

      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
        <div
          className={`h-1.5 rounded-full ${isDanger ? 'bg-red-500' : 'bg-[#98c195]'}`}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

function Donut({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="
          relative h-56 w-56 rounded-full
          bg-gradient-to-b from-[#cfe6c9] via-[#98c195] to-[#6ea96b]
          shadow-[0_22px_50px_rgba(0,0,0,0.18)]
        "
      >
        <div
          className="
            absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2
            rounded-full bg-white shadow-inner
          "
        />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_25px_rgba(255,255,255,0.35)]" />
      </div>

      <div className="mt-7 flex items-center gap-3 text-slate-500">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xl font-bold text-slate-600">{amount}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isCalendarButtonVisible, setCalendarButtonVisible] = useState(true);

  const handleCloseCalendar = () => {
    setCalendarOpen(false);
    setCalendarButtonVisible(false);
    setTimeout(() => setCalendarButtonVisible(true), 200);
  };

  return (
    <div className="relative min-h-screen bg-[#eef0f3] flex flex-col">
      {/* ✅ Header: 전체 폭(끝까지) */}
      <header className="w-full h-[96px] px-10 py-5 flex items-center justify-between">
        {/* Left: Hamburger + mascot peek */}
        <div
          className="relative inline-flex items-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="relative z-10 rounded-md bg-slate-900 p-2 text-white shadow hover:bg-slate-800"
            aria-label="Open sidebar"
          >
            <HiOutlineBars3 size={24} />
          </button>

          <div
            className={`absolute left-0 top-1/2 z-0 min-h-[40px] min-w-[40px] -translate-y-1/2 transition-transform duration-500 ${
              isHovering ? 'translate-x-[28px]' : 'translate-x-0'
            }`}
          >
            <Image src="/seuljeossi_right.png" alt="슬저씨" width={48} height={48} unoptimized />
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex w-[520px] max-w-[55vw] items-center">
          <div className="relative w-full">
            <input
              className="
                w-full rounded-full bg-white px-5 py-3
                text-sm text-slate-700 placeholder:text-slate-400
                shadow-[0_10px_25px_rgba(0,0,0,0.10)]
                outline-none ring-1 ring-black/5
                focus:ring-2 focus:ring-[#98c195]/50
              "
              placeholder="Search"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Profile */}
        <button
          className="
            flex h-12 w-12 items-center justify-center rounded-full
            bg-white 
            shadow-[0_8px_20px_rgba(0,0,0,0.08)]
            hover:scale-105
            transition-all duration-200
          "
        >
          <HiUser size={30} className="text-[#98c195]" />
        </button>
      </header>

      {/* Right calendar open button */}
      {isCalendarButtonVisible && !isCalendarOpen && (
        <div className="fixed top-1/2 right-0 z-30 -translate-y-1/2">
          <button
            onClick={() => setCalendarOpen(true)}
            className="relative h-[500px] w-[25px] cursor-pointer border-none bg-transparent p-0"
            aria-label="Open calendar"
          >
            <svg width="25" height="500" className="absolute left-0 top-0">
              <g transform="rotate(-90, 40, 250)">
                <polygon points="40,0 40,0 80,250 0,250" fill="#1E293B" />
              </g>
            </svg>
            <span className="relative text-2xl font-bold text-white">&lt;</span>
          </button>
        </div>
      )}

      {/* Sidebar overlay */}
      {isSidebarOpen && <div className="fixed inset-0 z-40" onClick={() => setSidebarOpen(false)} />}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Calendar overlay */}
      {isCalendarOpen && <div className="fixed inset-0 z-40" onClick={handleCloseCalendar} />}
      <CalendarSidebar isOpen={isCalendarOpen} onClose={handleCloseCalendar} />

      {/* ✅ Main: 가운데 컨텐츠만 max-width */}
      <main className="w-full flex-1 flex items-center justify-center px-6 pb-10">
        <div className="w-full max-w-[900px] -translate-y-6">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Goals */}
            <section className="rounded-2xl bg-white/70 p-8 shadow-[0_18px_50px_rgba(0,0,0,0.12)] ring-1 ring-black/5 backdrop-blur">
              <div className="text-xl font-semibold text-[#7fb57c]">Goals</div>

              <div className="mt-7 flex items-center justify-center gap-24 text-xs text-slate-400">
                <span>Daily</span>
                <span>Monthly</span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <GoalPill label="Shopping" valueText="58%" percent={58} />
                  <GoalPill label="Snack" valueText="20%" percent={20} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <GoalPill label="Golf" valueText="0%" percent={0} />
                  <GoalPill label="PC room" valueText="50%" percent={50} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <GoalPill label="Coffee" valueText="110%" percent={100} tone="danger" />
                  <GoalPill label="Text" valueText="-%" percent={12} />
                </div>
              </div>
            </section>

            {/* Total Spending */}
            <section className="rounded-2xl bg-white/70 p-8 shadow-[0_18px_50px_rgba(0,0,0,0.12)] ring-1 ring-black/5 backdrop-blur">
              <div className="flex items-start justify-between">
                <div className="text-xl font-semibold text-[#7fb57c]">Total Spending</div>
                <div className="text-2xl font-extrabold text-slate-900">$ 1,082</div>
              </div>

              <div className="mt-8 flex items-center justify-center">
                <Donut label="Grocery" amount="$ 536" />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}