'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

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

// 기본 초기 데이터
const getInitialCalendarData = (): Record<string, any> => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth(); // 0-indexed (3월이면 2)
  return {
    [`${y}-${m}-3`]:  { id: 101, icon: '☕', color: dotColors.yellow, name: 'Starbucks', amount: '$ 15.00', type: 'expense' },
    [`${y}-${m}-12`]: { id: 102, icon: '🛒', color: dotColors.blue, name: 'Walmart', amount: '$ 120.50', type: 'expense' },
    [`${y}-${m}-23`]: { id: 1, icon: '👍', color: dotColors.green, name: 'Salary', amount: '$ 3000.00', type: 'income' },
  };
};

export default function CalendarPage() {
  const { t, formatYear, formatDay, language } = useLanguage();
  const realToday = new Date();
  const realYear = realToday.getFullYear();
  const realMonth = realToday.getMonth(); 
  const realDate = realToday.getDate();

  const [currentDate, setCurrentDate] = useState(new Date(realYear, realMonth, 1)); 
  const [selectedDay, setSelectedDay] = useState<number | null>(realDate); 
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [currentMemo, setCurrentMemo] = useState("");

  const [calendarData, setCalendarData] = useState<Record<string, any>>(getInitialCalendarData);
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const savedData = localStorage.getItem('seulgeumoney_calendar_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const hasOldFormat = Object.keys(parsed).some(k => !isNaN(Number(k)));
        if (hasOldFormat) {
          // 구형 데이터 삭제, 새 초기 데이터로 시작
          localStorage.removeItem('seulgeumoney_calendar_data');
        } else {
          setCalendarData(parsed);
        }
      } catch (error) {
        console.error("Failed to load calendar data:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('seulgeumoney_calendar_data', JSON.stringify(calendarData));
      // 알림: 데이터가 변경되었음을 다른 컴포넌트(SideCalendar 등)에 알림
      window.dispatchEvent(new Event('calendarDataUpdated'));
    }
  }, [calendarData, isLoaded]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const dayKey = (d: number) => `${year}-${month}-${d}`;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const years = Array.from({ length: 10 }, (_, i) => realYear - i);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (year > realYear || (year === realYear && month >= realMonth)) return;
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const isNextMonthDisabled = year > realYear || (year === realYear && month >= realMonth);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const dayMemo = calendarData[dayKey(day)]?.memo || "";
    setCurrentMemo(dayMemo);
    setIsModalOpen(true); 
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMemo = e.target.value;
    setCurrentMemo(newMemo);

    if (selectedDay !== null) {
      setCalendarData((prev) => {
        const key = dayKey(selectedDay);
        const currentDayData = prev[key] || { transactions: [], hasEdit: false, income: 0, expense: 0 };
        return {
          ...prev,
          [key]: {
            ...currentDayData,
            memo: newMemo 
          }
        };
      });
    }
  };

  if (!isLoaded) return null;

  const emptyCellsStart = Array.from({ length: firstDayOfMonth }).map((_, i) => (
    <div key={`empty-start-${i}`} className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-surface shadow-sm ring-1 ring-border-custom/10 text-slate-300">
      -
    </div>
  ));

  const daysCells = Array.from({ length: daysInMonth }).map((_, i) => {
    const day = i + 1;
    const isSelected = selectedDay === day;
    const dayData = calendarData[dayKey(day)] || { transactions: [] };
    const transactions = dayData.transactions || [];

    const uniqueDots = Array.from(new Set(transactions.map((tx: any) => tx.color))).slice(0, 4);

    const isFuture = 
      year > realYear || 
      (year === realYear && month > realMonth) || 
      (year === realYear && month === realMonth && day > realDate);

    return (
      <div
        key={day}
        onClick={() => { if (!isFuture) handleDayClick(day); }}
        className={`relative flex aspect-square flex-col items-center pt-3 sm:pt-4 transition-all rounded-2xl ring-1 ${
          isFuture 
            ? 'cursor-default bg-slate-50 opacity-40 ring-border-custom/10' 
            : isSelected 
              ? 'ring-[2px] ring-[var(--primary)] shadow-md bg-slate-50/50 cursor-pointer' 
              : 'bg-surface shadow-sm ring-border-custom/10 cursor-pointer hover:-translate-y-1 hover:shadow-md' 
        }`}
      >
        <span className={`text-[15px] font-medium ${isFuture ? 'text-text-muted' : isSelected ? 'text-[var(--primary)] font-bold' : 'text-[var(--primary)]'}`}>
          {day}
        </span>

        {!isFuture && uniqueDots.length > 0 && (
          <div className="absolute bottom-2 flex gap-[3px] sm:bottom-3">
            {uniqueDots.map((colorClass: any, idx: number) => (
              <div key={idx} className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${colorClass}`}></div>
            ))}
          </div>
        )}

        {!isFuture && dayData.memo && dayData.memo.trim() !== '' && (
          <div className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 text-slate-300">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
        )}
      </div>
    );
  });

  const totalCells = firstDayOfMonth + daysInMonth;
  const emptyCellsEndCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const emptyCellsEnd = Array.from({ length: emptyCellsEndCount }).map((_, i) => (
    <div key={`empty-end-${i}`} className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-surface shadow-sm ring-1 ring-border-custom/10 text-slate-300">
      -
    </div>
  ));

  const activeData = selectedDay && calendarData[dayKey(selectedDay)]
    ? calendarData[dayKey(selectedDay)]
    : { income: 0, expense: 0, transactions: [] };

  return (
    <>
      <div className="relative w-full max-w-[760px] mx-auto rounded-[32px] border border-white bg-surface px-6 py-10 sm:px-12 sm:py-12 shadow-[0_18px_50px_rgba(0,0,0,0.14)] animate-fade-in">
        <div className="mb-10 flex items-center justify-center gap-4 sm:gap-8 text-[var(--primary)]">
            <button 
              onClick={handlePrevMonth}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-slate-100"
            >
              <span className="text-xl font-light">&lt;</span>
            </button>
            
            <div className="relative flex items-center justify-center">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="group flex min-w-[200px] cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-2 transition-colors hover:bg-slate-50"
              >
                <h2 className="text-[22px] sm:text-[24px] font-bold whitespace-nowrap group-hover:text-[#527a54] transition-colors">
                  {language === 'ko' ? `${formatYear(year)} ${t(monthNames[month])}` : `${t(monthNames[month])} ${formatYear(year)}`}
                </h2>
                <svg 
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
                  className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[var(--primary)]' : 'text-text-muted group-hover:text-[var(--primary)]'}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute top-full mt-2 z-50 flex w-[280px] overflow-hidden rounded-2xl bg-surface shadow-xl ring-1 ring-border-custom/10 left-1/2 -translate-x-1/2 animate-fade-in-down">
                    <div className="flex-1 max-h-[260px] overflow-y-auto border-r border-slate-100 p-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
                      {monthNames.map((m, idx) => {
                        const isDisabled = year === realYear && idx > realMonth;
                        return (
                          <button
                            key={m}
                            disabled={isDisabled}
                            onClick={() => {
                              setCurrentDate(new Date(year, idx, 1));
                              setSelectedDay(null);
                              setIsDropdownOpen(false); 
                            }}
                            className={`w-full text-left px-4 py-2.5 text-[14px] font-semibold rounded-xl transition-colors ${
                              isDisabled 
                                ? 'text-slate-300 cursor-default' 
                                : month === idx 
                                  ? 'bg-[var(--primary)] text-white shadow-sm' 
                                  : 'text-text-muted hover:bg-slate-50 cursor-pointer'
                            }`}
                          >
                            {t(m)}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex-1 max-h-[260px] overflow-y-auto p-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
                      {years.map((y) => (
                        <button
                          key={y}
                          onClick={() => {
                            let newMonth = month;
                            if (y === realYear && month > realMonth) {
                              newMonth = realMonth;
                            }
                            setCurrentDate(new Date(y, newMonth, 1));
                            setSelectedDay(null);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[14px] font-semibold rounded-xl transition-colors cursor-pointer ${
                            year === y 
                              ? 'bg-[var(--primary)] text-white shadow-sm' 
                              : 'text-text-muted hover:bg-slate-50'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={handleNextMonth}
              disabled={isNextMonthDisabled}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                isNextMonthDisabled 
                ? 'cursor-default opacity-30' 
                : 'cursor-pointer hover:bg-slate-100'
              }`}
            >
              <span className="text-xl font-light">&gt;</span>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-3">
            {dayNames.map(day => (
              <div key={day} className="text-center text-[13px] sm:text-[14px] font-bold text-text-main">
                {t(day)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {emptyCellsStart}
            {daysCells}
            {emptyCellsEnd}
          </div>
        </div>

      {/* 🟢 모달 영역 */}
      {isModalOpen && selectedDay !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsModalOpen(false)} 
        >
          <div 
            className="relative flex w-full max-w-[460px] max-h-[85vh] flex-col rounded-[32px] bg-surface-alt p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* 고정되는 헤더 (날짜 및 금액) */}
            <div className="mb-6 flex items-start justify-between shrink-0">
              <div className="text-[26px] font-bold text-[var(--primary)] flex gap-2">
                <span>{t(monthNames[month])}</span>
                <span>{formatDay(selectedDay)}</span>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-end text-right">
                  <span className="text-[14px] font-bold text-[var(--primary)]">
                    $ {activeData.income ? Number(activeData.income).toFixed(2) : '0.00'}
                  </span>
                  <span className="text-[14px] font-bold text-[#ee5253]">
                    $ {activeData.expense ? Number(activeData.expense).toFixed(2) : '0.00'}
                  </span>
                </div>
                
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-text-muted hover:bg-black/10 hover:text-text-main transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* ✨ 오직 트랜잭션 리스트만 스크롤되도록 분리한 영역 */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/50">
              {activeData.transactions && activeData.transactions.length > 0 ? (
                activeData.transactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center justify-between rounded-2xl bg-surface px-5 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-0.5">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{tx.icon}</div>
                      <div className={`h-2.5 w-2.5 rounded-full ${tx.color}`}></div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-text-main leading-tight">
                          {tx.name}
                        </span>
                        {tx.desc && (
                          <span className="mt-0.5 text-[10px] font-medium text-text-muted w-40 truncate sm:w-56">
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
                    <div className={`text-[14px] font-extrabold ${tx.type === 'income' ? 'text-[var(--primary)]' : 'text-[#ee5253]'}`}>
                      {tx.amount}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-20 items-center justify-center text-sm font-medium text-text-muted">
                  {t('No transactions for this day.')}
                </div>
              )}
            </div>

            {/* ✨ 스크롤 영역 밖으로 빼내어 모달창 하단에 항상 고정되는 Memo 영역 (shrink-0 적용) */}
            <div className="mt-4 shrink-0 flex flex-col rounded-[24px] bg-surface p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <h3 className="text-[16px] font-extrabold text-text-main">{t('Memo')}</h3>
              <textarea
                value={currentMemo}
                onChange={handleMemoChange} 
                placeholder={t('Add memo..')}
                className="mt-3 w-full min-h-[100px] resize-none bg-transparent text-[14px] font-medium leading-relaxed text-text-muted outline-none placeholder:text-slate-300"
              />
            </div>

          </div>
        </div>
      )}

    </>
  );
}
