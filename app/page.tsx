'use client';

import { useState } from 'react';
import Sidebar from '../components/sidebar';
import CalendarSidebar from '../components/sidecalendar';
import Image from 'next/image';
import { HiOutlineBars3, HiUser } from 'react-icons/hi2';

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
    <div
      className="
        w-full rounded-full bg-white
        px-5 py-3.5
        shadow-[0_8px_22px_rgba(0,0,0,0.10)]
        ring-1 ring-black/5
      "
    >
      <div className="flex items-center justify-between text-[15px]">
        <span className="text-slate-800 font-semibold">{label}</span>
        <span className={isDanger ? 'text-red-500 font-extrabold' : 'text-slate-700 font-extrabold'}>
          {valueText}
        </span>
      </div>

      {/* bar도 살짝 두껍게 */}
      <div className="mt-2.5 h-2 w-full rounded-full bg-slate-200">
        <div
          className={`h-2 rounded-full ${isDanger ? 'bg-red-500' : 'bg-[#98c195]'}`}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

function Donut({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* 도넛 조금 크게 */}
      <div
        className="
          relative h-60 w-60 rounded-full
          bg-gradient-to-b from-[#cfe6c9] via-[#98c195] to-[#6ea96b]
          shadow-[0_24px_55px_rgba(0,0,0,0.20)]
        "
      >
        <div
          className="
            absolute left-1/2 top-1/2 h-30 w-30 -translate-x-1/2 -translate-y-1/2
            rounded-full bg-white
            shadow-inner
          "
        />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_25px_rgba(255,255,255,0.35)]" />
      </div>

      <div className="mt-7 flex items-center gap-3 text-slate-500">
        <span className="text-[15px] font-semibold">{label}</span>
        <span className="text-2xl font-extrabold text-slate-600">{amount}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isCalendarHovering, setCalendarHovering] = useState(false);
  const [isCalendarButtonVisible, setCalendarButtonVisible] = useState(true);

  const handleCloseCalendar = () => {
    setCalendarOpen(false);
    setCalendarButtonVisible(false);
    setTimeout(() => setCalendarButtonVisible(true), 200);
  };

  return (
    <div className="relative min-h-screen bg-[#eef0f3] flex flex-col">
      {/* Header */}
      <header className="w-full h-[96px] px-10 py-5 flex items-center justify-between">
        {/* Left */}
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
            className={`absolute left-0 top-1/2 -translate-y-1/2 transition-transform duration-500 ${
              isHovering ? 'translate-x-[24.5px]' : 'translate-x-0'
            }`}
          >
            <Image src="/seuljeossi_right.png" alt="슬저씨" width={48} height={48} unoptimized />
          </div>
        </div>

        {/* Search (포커스 초록 + 돋보기 버튼 복구) */}
        <div className="flex w-[520px] max-w-[55vw] items-center">
          <div className="relative w-full">
            <input
              className="
                w-full rounded-full bg-white px-5 py-3 pr-12
                text-sm text-slate-700 placeholder:text-slate-400
                shadow-[0_10px_25px_rgba(0,0,0,0.10)]
                outline-none ring-1 ring-black/5
                focus:ring-2 focus:ring-[#98c195]/50
              "
              placeholder="Search"
            />
            <button
              type="button"
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                rounded-full p-2
                text-slate-400 hover:text-slate-600
                hover:bg-black/5
                transition
              "
              aria-label="Search"
              onClick={() => {}}
            >
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
            </button>
          </div>
        </div>

        {/* Profile */}
        <button
          className="
            flex h-12 w-12 items-center justify-center rounded-full
            bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]
            hover:scale-105 transition-all duration-200
          "
          aria-label="Account"
        >
          <HiUser size={30} className="text-[#98c195]" />
        </button>
      </header>

      {/* Calendar Open Button (삼각형 디자인 유지) */}
      {isCalendarButtonVisible && !isCalendarOpen && (
        <div className="fixed top-1/2 right-0 z-30 -translate-y-1/2">
          
          {/* ✅ 1. 슬저씨 이미지: 평소엔 화면 밖(60px)에 숨기고, 호버 시 왼쪽으로 튀어나오게(-translate-x-28px) 설정 */}
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-500 ${
              isCalendarHovering ? '-translate-x-[15px]' : 'translate-x-[60px]'
            }`}
          >
            <Image src="/seuljeossi_left.png" alt="슬저씨" width={48} height={48} unoptimized />
          </div>

          {/* ✅ 2. 버튼: 이미지보다 항상 앞에 오도록 'z-10' 추가 */}
          <button
            onClick={() => setCalendarOpen(true)}
            className="relative z-10 h-[500px] w-[25px] cursor-pointer border-none bg-transparent p-0 pointer-events-none"
            aria-label="Open calendar"
          >
            <svg width="25" height="500" className="absolute left-0 top-0 pointer-events-none">
              <g transform="rotate(-90, 40, 250)">
                <polygon 
                  points="40,0 40,0 80,250 0,250" 
                  fill="#1E293B" 
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setCalendarHovering(true)}
                  onMouseLeave={() => setCalendarHovering(false)}
                />
              </g>
            </svg>
            <span className="relative text-2xl font-bold text-white pointer-events-none">&lt;</span>
          </button>
        </div>
      )}

      {/* Sidebar overlay */}
      {isSidebarOpen && <div className="fixed inset-0 z-40" onClick={() => setSidebarOpen(false)} />}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Calendar overlay */}
      {isCalendarOpen && <div className="fixed inset-0 z-40" onClick={handleCloseCalendar} />}
      <CalendarSidebar isOpen={isCalendarOpen} onClose={handleCloseCalendar} />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 pb-10">
        {/* ✅ 전체 크기 살짝 줄임: max-w 1200 -> 1100, gap 12 -> 10 */}
        <div className="w-full max-w-[1100px]">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* ✅ padding 줄이되, 안 요소는 키워서 “꽉 찬 느낌” */}
            <section className="aspect-[50/51] rounded-2xl bg-white p-8 shadow-xl flex flex-col">
              {/* 제목은 위에 고정 */}
              <div className="text-[22px] font-semibold text-[#7fb57c]">
                Goals
              </div>

              {/* ✅ 여기서 flex-1로 남은 공간 차지 + 가운데 정렬 */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-2 text-center text-sm text-slate-400 font-semibold">
                  <div>Daily</div>
                  <div>Monthly</div>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <GoalPill label="Shopping" valueText="58%" percent={58} />
                    <GoalPill label="Snack" valueText="20%" percent={20} />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <GoalPill label="Golf" valueText="0%" percent={0} />
                    <GoalPill label="PC room" valueText="50%" percent={50} />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <GoalPill label="Coffee" valueText="110%" percent={100} tone="danger" />
                    <GoalPill label="Text" valueText="-%" percent={12} />
                  </div>
                </div>
              </div>
            </section>

            <section className="aspect-[50/51] rounded-2xl bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.12)] flex flex-col">
              <div className="flex items-start justify-between">
                <div className="text-[22px] font-semibold text-[#7fb57c]">Total Spending</div>
                <div className="text-[28px] font-extrabold text-slate-900">$ 1,082</div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <Donut label="Grocery" amount="$ 536" />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}