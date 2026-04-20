'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useLanguage } from '../LanguageContext';

export default function SpendingPage() {
  const { t, formatYear, formatDay, language } = useLanguage();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  // ✅ 1. 오늘 날짜(현실 시간) 가져오기
  const today = new Date();
  const realYear = today.getFullYear();
  const realMonth = today.getMonth(); // 0(1월) ~ 11(12월)
  const realDate = today.getDate();   // 오늘 며칠인지 (예: 4일)

  const months = useMemo(() => [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ], []);
  
  // ✅ 2. 처음 띄울 때 '오늘이 속한 연도와 월'을 기본값으로 설정!
  const [currentYear, setCurrentYear] = useState(realYear);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(realMonth);

  // 이전 달로 이동 (제한 없음)
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  // 다음 달로 이동 (미래로는 갈 수 없도록 막음!)
  const handleNextMonth = () => {
    if (currentYear === realYear && currentMonthIndex === realMonth) return;

    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  const isNextDisabled = currentYear === realYear && currentMonthIndex === realMonth;

  // 📝 임시 데이터
  const allTransactions = [
    { id: 9, date: `${months[realMonth]} ${realDate}, ${realYear}`, name: 'Coffee', time: '08:30 AM', amount: '$ 4.50', type: 'expense', icon: '☕' },
    { id: 10, date: `${months[realMonth]} ${realDate - 1 > 0 ? realDate - 1 : 1}, ${realYear}`, name: 'Uber Eats', time: '07:15 PM', amount: '$ 25.00', type: 'expense', icon: '🍔' },
    { id: 11, date: `${months[realMonth]} 1, ${realYear}`, name: 'Monthly Salary', time: '09:00 AM', amount: '$ 3,200.00', type: 'income', icon: '💰' },
    { id: 1, date: 'July 22, 2024', name: 'OpenAI', time: '10:30 AM', amount: '$ 20.00', type: 'expense', icon: '🤖' },
    { id: 2, date: 'July 22, 2024', name: 'Apple', time: '09:15 AM', amount: '$ 1.99', type: 'expense', icon: '🍎' },
    { id: 3, date: 'July 22, 2024', name: 'Zelle Payment From Wonbeom...', time: '08:00 AM', amount: '$ 20.00', type: 'income', icon: '💸' },
  ];

  const dynamicGroupedTransactions = useMemo(() => {
    const jsMonth = currentMonthIndex; 
    const daysInMonth = new Date(currentYear, jsMonth + 1, 0).getDate(); 
    
    let startDay = daysInMonth;
    if (currentYear === realYear && currentMonthIndex === realMonth) {
      startDay = Math.min(daysInMonth, realDate); 
    } else if (currentYear > realYear || (currentYear === realYear && currentMonthIndex > realMonth)) {
      startDay = 0;
    }
    
    const grouped = [];
    for (let day = startDay; day >= 1; day--) {
      const dateString = `${months[currentMonthIndex]} ${day}, ${currentYear}`;
      const itemsForDay = allTransactions.filter((tx) => tx.date === dateString);
      
      grouped.push({
        date: dateString,
        items: itemsForDay,
        translatedDate: language === 'ko' 
          ? `${formatYear(currentYear)} ${t(months[currentMonthIndex])} ${formatDay(day)}` 
          : `${t(months[currentMonthIndex])} ${day}, ${currentYear}`
      });
    }
    
    return grouped;
  }, [currentMonthIndex, currentYear, realYear, realMonth, realDate, months, allTransactions, t, language, formatYear, formatDay]);

  // 버튼 생성을 위한 배열 맵핑
  const accountOptions = [
    { label: 'Checking Account', value: 'checking' },
    { label: 'Savings Account', value: 'savings' },
    { label: 'Credit Balance', value: 'credit' }
  ];

  return (
    <>
      {/* 화면 중앙 정렬 및 가로 스크롤 방지 (Report Page와 동일) */}
      <div className="flex min-h-[80vh] w-full items-center justify-center overflow-hidden pb-20 pt-10">
        
        {/* 🟢 애니메이션을 위한 최상단 래퍼 (Report Page와 동일) */}
        <div className="relative flex items-center justify-center transition-all duration-500 ease-in-out">
          
          {/* 🟢 1단계: 왼쪽 박스 (항상 고정된 너비 420px 유지) */}
          <div className="relative w-[420px] shrink-0 rounded-[32px] border border-border-custom/10 bg-surface px-10 py-12 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
            
            {/* ✨ 아무것도 선택되지 않았을 때만 왼쪽에 슬저씨 표시 */}
            {!selectedType && (
              <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300">
                <Image src="/seuljeossi.png" alt="슬저씨" width={80} height={80} unoptimized />
              </div>
            )}

            <h2 className="mb-10 text-center text-[22px] font-semibold text-[var(--primary)]">
              {t('Type of Account')}
            </h2>

            <div className="flex flex-col gap-5">
              {accountOptions.map((account) => {
                const isSelected = selectedType === account.value;
                return (
                  <button
                    key={account.value}
                    onClick={() => setSelectedType(account.value)}
                    // ✨ Report Page와 완벽히 동일한 버튼 스타일 (선택 시 초록색 테두리/텍스트)
                    className={`w-full cursor-pointer rounded-2xl px-6 py-4 text-left text-[15px] font-semibold transition-all duration-300 ${
                      isSelected 
                        ? 'shadow-md ring-[1.5px] ring-[var(--primary-light)] text-[var(--primary)]' 
                        : 'text-text-muted ring-1 ring-border-custom/10 hover:-translate-y-1 hover:shadow-lg hover:text-[var(--primary)]'
                    }`}
                  >
                    {t(account.label)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🟢 2단계: 오른쪽 상세 박스 애니메이션 래퍼 (Report Page와 동일 - 서랍이 열리듯 펼쳐짐) */}
          <div 
            className={`overflow-visible transition-all duration-500 ease-in-out ${
              selectedType ? 'ml-10 w-[420px] opacity-100' : 'ml-0 w-0 opacity-0'
            }`}
          >
            {/* ✨ 안쪽 컨텐츠 (relative 속성을 추가하여 슬저씨가 정중앙에 올라가도록 설정) */}
            <div className="relative w-[420px] rounded-[32px] border border-border-custom/10 bg-surface px-10 py-12 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
              
              {/* ✨ 선택되었을 때만 오른쪽에 슬저씨 표시 */}
              {selectedType && (
                <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300">
                  <Image src="/seuljeossi.png" alt="슬저씨" width={80} height={80} unoptimized />
                </div>
              )}

              <h2 className="mb-10 text-center text-[22px] font-semibold text-[var(--primary)]">
                {selectedType === 'checking' && t('Checking Account')}
                {selectedType === 'savings' && t('Savings Account')}
                {selectedType === 'credit' && t('Credit Balance')}
              </h2>

              {/* 선택된 계좌별 내용 */}
              {selectedType === 'checking' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedBank('Bank of America');
                        setIsModalOpen(true);
                      }}
                      className="w-full cursor-pointer rounded-2xl bg-surface px-6 py-4 text-left text-[15px] font-semibold text-text-muted ring-1 ring-border-custom/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:text-[var(--primary)]"
                    >
                      Bank of America
                    </button>
                    <span className="text-[12px] font-medium text-slate-300">
                      Adv Plus Banking | ***9330
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedBank('Chase');
                        setIsModalOpen(true);
                      }}
                      className="w-full cursor-pointer rounded-2xl bg-surface px-6 py-4 text-left text-[15px] font-semibold text-text-muted ring-1 ring-border-custom/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:text-[var(--primary)]"
                    >
                      Chase
                    </button>
                    <span className="text-[12px] font-medium text-slate-300">
                      Chase College | ***2885
                    </span>
                  </div>
                </div>
              )}

              {selectedType !== 'checking' && (
                <div className="flex h-32 items-center justify-center text-sm font-medium text-slate-300">
                  {t('No account details')}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 🟢 3. 오버레이(모달) 영역 - 원본 코드 100% 유지 */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-[500px] rounded-3xl bg-surface-alt px-8 py-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-alt hover:text-slate-600"
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-[var(--primary)]">
                {t('Transaction')}
              </h2>
              {selectedBank && (
                <p className="mt-1 text-sm font-medium text-text-muted">
                  {selectedBank}
                </p>
              )}
            </div>

            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder={t('Search')} 
                className="w-full rounded-full bg-surface px-5 py-3 pr-12 text-sm text-text-main placeholder:text-text-muted shadow-[0_10px_25px_rgba(0,0,0,0.10)] outline-none ring-1 ring-border-custom/10 focus:ring-2 focus:ring-[var(--primary-light)]/50"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-text-muted hover:text-[var(--primary)] hover:bg-border-custom/10 transition cursor-pointer"
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col bg-surface rounded-2xl overflow-hidden shadow-sm ring-1 ring-border-custom/10">
              
              <div className="flex items-center justify-between bg-[#b3b3b3] px-6 py-1.5 text-sm font-bold text-white z-20">
                <button 
                  onClick={handlePrevMonth}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/20"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                
                <span>{language === 'ko' ? `${formatYear(currentYear)} ${t(months[currentMonthIndex])}` : `${t(months[currentMonthIndex])} ${formatYear(currentYear)}`}</span>
                
                <button 
                  onClick={handleNextMonth}
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    isNextDisabled ? 'cursor-default text-white/40' : 'cursor-pointer hover:bg-white/20'
                  }`}
                  disabled={isNextDisabled}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto relative">
                {dynamicGroupedTransactions.map((group, groupIdx) => (
                  <div key={groupIdx}>
                    
                    <div className="sticky top-0 z-10 border-b border-t border-slate-100 bg-surface-alt/95 backdrop-blur-sm px-5 py-1.5 text-[12px] font-bold text-text-muted">
                      {group.translatedDate}
                    </div>

                    {group.items.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {group.items.map((tx) => (
                          <div 
                            key={tx.id} 
                            className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-lg">
                                {tx.icon}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[14px] font-semibold text-text-main">
                                  {tx.name}
                                </span>
                                <span className="text-[11px] font-medium text-text-muted">
                                  {tx.time}
                                </span>
                              </div>
                            </div>
                            <span className={`text-sm font-extrabold ${tx.type === 'income' ? 'text-[var(--primary)]' : 'text-red-500'}`}>
                              {tx.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-3 text-center text-[12px] font-medium text-slate-300">
                        {t('No transactions')}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
