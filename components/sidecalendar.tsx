'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { HiChevronLeft, HiChevronRight, HiXMark } from 'react-icons/hi2';

interface SideCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

type Selected = { day: number; month: number; year: number };

function isSameDate(a: Selected, b: Selected) {
  return a.day === b.day && a.month === b.month && a.year === b.year;
}

export default function SideCalendar({ isOpen, onClose }: SideCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selected, setSelected] = useState<Selected>({
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  useEffect(() => {
    if (!isOpen) return;
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelected({ day: now.getDate(), month: now.getMonth(), year: now.getFullYear() });
  }, [isOpen]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0(Sun)~6(Sat)
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // ✅ 핵심: "오늘" 이후 날짜면 미래로 판단 (시간 영향 제거 위해 00:00 기준으로 비교)
  const isFuture = (d: number) => {
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const cand = new Date(year, month, d).getTime();
    return cand > t;
  };

  const cells: Array<{ key: string; day?: number }> = [];

  // leading blanks
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ key: `blank-start-${i}` });
  }
  // days
  for (let d = 1; d <= lastDate; d++) {
    cells.push({ key: `day-${d}`, day: d });
  }
  // trailing blanks
  while (cells.length % 7 !== 0) {
    cells.push({ key: `blank-end-${cells.length}` });
  }

  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      className={[
        'fixed z-50',
        'right-6 top-1/2 -translate-y-1/2',
        'transition-transform duration-300 ease-out',
        isOpen ? 'translate-x-0' : 'translate-x-[120%]',
      ].join(' ')}
      aria-hidden={!isOpen}
    >
      <div
        className="
          w-[320px] rounded-2xl
          bg-white
          shadow-[0_18px_50px_rgba(0,0,0,0.14)]
          ring-1 ring-black/10
          overflow-hidden
        "
      >
        {/* Top bar: close */}
        <div className="flex items-center justify-end px-3 pt-3">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#7fb57c] hover:bg-black/5 transition"
            aria-label="Close calendar"
          >
            <HiXMark size={18} />
          </button>
        </div>

        {/* Month row */}
        <div className="px-5 pb-3">
          <div className="flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="rounded-full p-2 text-[#7fb57c] hover:bg-black/5 transition"
              aria-label="Previous month"
            >
              <HiChevronLeft size={18} />
            </button>

            <div className="text-center text-[16px] tracking-tight text-[#7fb57c]">
              {MONTH_NAMES[month]} {year}
            </div>

            <button
              onClick={nextMonth}
              className="rounded-full p-2 text-[#7fb57c] hover:bg-black/5 transition"
              aria-label="Next month"
            >
              <HiChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days header */}
        <div className="px-5">
          <div className="grid grid-cols-7 gap-2 pb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[12px] text-slate-700/80">
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="px-5 pb-5">
          <div className="grid grid-cols-7 gap-2">
            {cells.map((c) => {
              const d = c.day;

              // 빈칸(-)
              if (!d) {
                return (
                  <div
                    key={c.key}
                    className="
                      h-9 w-9 rounded-lg
                      bg-slate-50
                      ring-1 ring-black/5
                      flex items-center justify-center
                      text-slate-300
                      text-sm
                    "
                  >
                    -
                  </div>
                );
              }

              const sel: Selected = { day: d, month, year };
              const active = isSameDate(selected, sel);
              const todayMark = isToday(d);
              const future = isFuture(d);

              return (
                <button
                  key={c.key}
                  disabled={future}
                  onClick={() => {
                    if (future) return;
                    setSelected(sel);
                  }}
                  className={[
                    'h-9 w-9 rounded-lg',
                    'ring-1 ring-black/5',
                    'flex items-center justify-center',
                    'text-sm',
                    'transition',
                    // ✅ 미래 날짜 스타일
                    future
                      ? 'bg-white text-slate-300 cursor-not-allowed'
                      : active
                        ? 'bg-[#7fb57c] text-white shadow-[0_10px_25px_rgba(127,181,124,0.35)]'
                        : 'bg-white text-slate-600 hover:bg-slate-50',
                    // 오늘 표시(살짝)
                    !future && !active && todayMark ? 'ring-2 ring-[#7fb57c]/30' : '',
                  ].join(' ')}
                  aria-label={
                    future
                      ? `Future date disabled: ${MONTH_NAMES[month]} ${d}, ${year}`
                      : `Select ${MONTH_NAMES[month]} ${d}, ${year}`
                  }
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}