'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { HiChevronLeft, HiChevronRight, HiXMark } from 'react-icons/hi2';
import { useLanguage } from '../app/(main)/LanguageContext';

const dotColors = {
  orange: 'bg-[#ff9f43]',
  blue: 'bg-[#0abde3]',
  red: 'bg-[#ee5253]',
  green: 'bg-[#1dd1a1]',
  yellow: 'bg-[#feca57]',
  purple: 'bg-[#9b59b6]',
  pink: 'bg-[#ff9ff3]',
  darkBlue: 'bg-[#341f97]',
};

const getInitialCalendarData = (): Record<string, any> => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth(); 
  return {
    [`${y}-${m}-3`]:  { id: 101, icon: '☕', color: dotColors.yellow, name: 'Starbucks', amount: '$ 15.00', type: 'expense' },
    [`${y}-${m}-12`]: { id: 102, icon: '🛒', color: dotColors.blue, name: 'Walmart', amount: '$ 120.50', type: 'expense' },
    [`${y}-${m}-23`]: { id: 1, icon: '👍', color: dotColors.green, name: 'Salary', amount: '$ 3000.00', type: 'income' },
  };
};

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
  const { t, formatYear, formatDay, language } = useLanguage();
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState<Date>(today);
  const [selected, setSelected] = useState<Selected>({
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [currentMemo, setCurrentMemo] = useState("");
  
  const [calendarData, setCalendarData] = useState<Record<string, any>>({});
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem('seulgeumoney_calendar_data');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed && typeof parsed === 'object') {
            const hasOldFormat = Object.keys(parsed).some(k => !isNaN(Number(k)));
            if (hasOldFormat) {
              localStorage.removeItem('seulgeumoney_calendar_data');
              setCalendarData(getInitialCalendarData());
            } else {
              setCalendarData(parsed);
            }
          }
        } catch (error) {
          console.error("Failed to load calendar data:", error);
          setCalendarData(getInitialCalendarData());
        }
      } else {
        setCalendarData(getInitialCalendarData());
      }
    };

    loadData();
    setIsLoaded(true);

    window.addEventListener('calendarDataUpdated', loadData);
    return () => window.removeEventListener('calendarDataUpdated', loadData);
  }, []); // Remove selected dependency to prevent redundant reloads

  useEffect(() => {
    if (isLoaded && calendarData && Object.keys(calendarData).length > 0) {
      localStorage.setItem('seulgeumoney_calendar_data', JSON.stringify(calendarData));
    }
  }, [calendarData, isLoaded]);

  useEffect(() => {
    if (!isOpen) {
      setIsPanelOpen(false);
    } else {
      // Open reset logic
      const now = new Date();
      setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
      const todaySel = { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };
      setSelected(todaySel);
      
      // Load today's memo if exists
      const key = `${todaySel.year}-${todaySel.month}-${todaySel.day}`;
      if (calendarData[key]) {
        setCurrentMemo(calendarData[key].memo || "");
      } else {
        setCurrentMemo("");
      }
    }
  }, [isOpen]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); 
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setIsPanelOpen(false);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setIsPanelOpen(false);
  };

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isFuture = (d: number) => {
    const todayBase = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const targetDate = new Date(year, month, d).getTime();
    return targetDate > todayBase;
  };

  const cells: Array<{ key: string; day?: number }> = [];

  for (let i = 0; i < firstDayIndex; i++) cells.push({ key: `blank-start-${i}` });
  for (let d = 1; d <= lastDate; d++) cells.push({ key: `day-${d}`, day: d });
  while (cells.length % 7 !== 0) cells.push({ key: `blank-end-${cells.length}` });

  const activeKey = `${selected.year}-${selected.month}-${selected.day}`;
  const activeData = (calendarData && calendarData[activeKey]) || { income: 0, expense: 0, transactions: [] };

  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      className={[
        'fixed z-50 flex items-center gap-4 sm:gap-6',
        'right-6 top-1/2 -translate-y-1/2',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-[120%]', 
      ].join(' ')}
      aria-hidden={!isOpen}
    >
      
      {/* 🟢 1. 왼쪽: 모달 패널 영역 */}
      {isPanelOpen && (
        <div className="flex w-[380px] sm:w-[420px] max-h-[85vh] flex-col rounded-[32px] bg-[#eceef0] p-6 shadow-2xl shrink-0 animate-fade-in sm:p-8">
          
          <div className="mb-6 flex items-start justify-between shrink-0">
            <div className="text-[24px] font-bold text-[#649566] flex gap-2">
              <span>{t(MONTH_NAMES[selected.month])}</span>
              <span>{formatDay(selected.day)}</span>
            </div>

            
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-end text-right">
                <span className="text-[14px] font-bold text-[#649566]">
                  $ {activeData.income ? Number(activeData.income).toFixed(2) : '0.00'}
                </span>
                <span className="text-[14px] font-bold text-[#ee5253]">
                  $ {activeData.expense ? Number(activeData.expense).toFixed(2) : '0.00'}
                </span>
              </div>
              
              <button
                onClick={() => setIsPanelOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-slate-500 hover:bg-black/10 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <HiXMark size={18} strokeWidth={1} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/50">
            {activeData.transactions && activeData.transactions.length > 0 ? (
              activeData.transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{tx.icon}</div>
                    <div className={`h-2.5 w-2.5 rounded-full ${tx.color}`}></div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-slate-800 leading-tight">
                        {tx.name}
                      </span>
                      {tx.desc && (
                        <span className="mt-0.5 text-[10px] font-medium text-slate-400 w-32 truncate sm:w-48">
                          {tx.desc}
                        </span>
                      )}
                      {tx.tag && (
                        <span className="mt-1 inline-block w-max rounded-md bg-[#e0f7fa] px-1.5 py-0.5 text-[9px] font-bold text-[#00bcd4]">
                          {tx.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`text-[14px] font-extrabold ${tx.type === 'income' ? 'text-[#649566]' : 'text-[#ee5253]'}`}>
                    {tx.amount}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-20 items-center justify-center text-sm font-medium text-slate-400">
                {t('No transactions for this day.')}
              </div>
            )}
          </div>

          {/* ✨ 메모 영역: 읽기 전용으로 수정됨 */}
          <div className="mt-4 shrink-0 flex flex-col rounded-[24px] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="text-[16px] font-extrabold text-slate-900">{t('Memo')}</h3>
            <div className="mt-3 w-full min-h-[80px] sm:min-h-[100px] text-[14px] font-medium leading-relaxed text-slate-600 whitespace-pre-wrap overflow-y-auto">
              {currentMemo ? currentMemo : <span className="text-slate-300">{t('No memo available.')}</span>}
            </div>
          </div>
        </div>
      )}

      {/* 🟢 2. 오른쪽: 기존 사이드 캘린더 영역 */}
      <div
        className="
          w-[320px] shrink-0 rounded-2xl
          bg-white
          shadow-[0_18px_50px_rgba(0,0,0,0.14)]
          ring-1 ring-black/10
          overflow-hidden
        "
      >
        <div className="flex items-center justify-end px-3 pt-3">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[#649566] hover:bg-black/5 transition cursor-pointer"
            aria-label="Close calendar"
          >
            <HiXMark size={18} />
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="rounded-full p-2 text-[#649566] hover:bg-black/5 transition cursor-pointer"
            >
              <HiChevronLeft size={18} />
            </button>

            <div className="text-center text-[16px] tracking-tight text-[#649566] font-bold">
              {t(MONTH_NAMES[month])} {year}
            </div>

            <button
              onClick={nextMonth}
              className="rounded-full p-2 text-[#649566] hover:bg-black/5 transition cursor-pointer"
            >
              <HiChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="px-5">
          <div className="grid grid-cols-7 gap-2 pb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[12px] font-bold text-slate-700/80">
                {t(d)}
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="grid grid-cols-7 gap-2">
            {cells.map((c) => {
              const d = c.day;

              if (!d) {
                return (
                  <div
                    key={c.key}
                    className="h-9 w-9 rounded-lg bg-slate-50 ring-1 ring-black/5 flex items-center justify-center text-slate-300 text-sm"
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
                    
                    const key = `${year}-${month}-${d}`;
                    setCurrentMemo(calendarData[key]?.memo || "");
                    setIsPanelOpen(true);
                  }}
                  className={[
                    'h-9 w-9 rounded-lg',
                    'ring-1 ring-black/5',
                    'flex items-center justify-center',
                    'text-[14px] font-medium',
                    'cursor-pointer',
                    'transition',
                    future
                      ? 'bg-white text-slate-300 cursor-default'
                      : active
                        ? 'bg-[#649566] text-white font-bold shadow-md'
                        : todayMark
                          ? 'bg-slate-100 text-[#649566] font-bold ring-[1.5px] ring-[#649566]/40'
                          : 'bg-white text-slate-600 hover:bg-slate-50',
                  ].join(' ')}
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
