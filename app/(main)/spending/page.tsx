'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';

export default function SpendingPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  // ✅ 1. 오늘 날짜(현실 시간) 가져오기
  const today = new Date();
  const realYear = today.getFullYear();
  const realMonth = today.getMonth(); // 0(1월) ~ 11(12월)
  const realDate = today.getDate();   // 오늘 며칠인지 (예: 4일)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
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
    // 현재 보는 달이 실제 '이번 달'이라면 다음 달로 넘어가는 함수 종료
    if (currentYear === realYear && currentMonthIndex === realMonth) return;

    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  // 미래 달로 이동하는 버튼을 회색으로 비활성화하기 위한 조건
  const isNextDisabled = currentYear === realYear && currentMonthIndex === realMonth;

  // 📝 임시 데이터 (오늘 날짜 기준으로 바로 보이게 최신 데이터 추가)
  const allTransactions = [
    // (테스트용) 현재 시점에 맞춘 최신 데이터
    { id: 9, date: `${months[realMonth]} ${realDate}, ${realYear}`, name: 'Coffee', time: '08:30 AM', amount: '$ 4.50', type: 'expense', icon: '☕' },
    { id: 10, date: `${months[realMonth]} ${realDate - 1 > 0 ? realDate - 1 : 1}, ${realYear}`, name: 'Uber Eats', time: '07:15 PM', amount: '$ 25.00', type: 'expense', icon: '🍔' },
    { id: 11, date: `${months[realMonth]} 1, ${realYear}`, name: 'Monthly Salary', time: '09:00 AM', amount: '$ 3,200.00', type: 'income', icon: '💰' },
    // 과거 데이터 유지
    { id: 1, date: 'July 22, 2024', name: 'OpenAI', time: '10:30 AM', amount: '$ 20.00', type: 'expense', icon: '🤖' },
    { id: 2, date: 'July 22, 2024', name: 'Apple', time: '09:15 AM', amount: '$ 1.99', type: 'expense', icon: '🍎' },
    { id: 3, date: 'July 22, 2024', name: 'Zelle Payment From Wonbeom...', time: '08:00 AM', amount: '$ 20.00', type: 'income', icon: '💸' },
  ];

  // 동적 리스트 생성 로직
  const dynamicGroupedTransactions = useMemo(() => {
    const jsMonth = currentMonthIndex; 
    const daysInMonth = new Date(currentYear, jsMonth + 1, 0).getDate(); // 선택한 달의 마지막 날짜
    
    // ✅ 3. 선택한 달이 '이번 달'이면 말일이 아니라 '오늘'까지만 생성하도록 제한!
    let startDay = daysInMonth;
    if (currentYear === realYear && currentMonthIndex === realMonth) {
      startDay = Math.min(daysInMonth, realDate); 
    } else if (currentYear > realYear || (currentYear === realYear && currentMonthIndex > realMonth)) {
      // (혹시 모를 버그 방지) 미래의 달이면 아예 생성하지 않음
      startDay = 0;
    }
    
    const grouped = [];
    for (let day = startDay; day >= 1; day--) {
      const dateString = `${months[currentMonthIndex]} ${day}, ${currentYear}`;
      const itemsForDay = allTransactions.filter((tx) => tx.date === dateString);
      
      grouped.push({
        date: dateString,
        items: itemsForDay,
      });
    }
    
    return grouped;
  }, [currentMonthIndex, currentYear, realYear, realMonth, realDate, months, allTransactions]);

  return (
    <>
      <div className="flex w-full max-w-[1000px] mx-auto justify-center items-center gap-10 pt-10">
        
        {/* 🟢 왼쪽 1단계 카드 (Type of Account) */}
        <div className="relative w-full max-w-[420px] transition-all duration-500">
          {!selectedType && (
            <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300">
              <Image src="/seuljeossi.png" alt="슬저씨" width={80} height={80} unoptimized />
            </div>
          )}

          <div className="relative z-20 rounded-[32px] bg-white px-10 py-12 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
            <h2 className="mb-10 text-center text-[22px] font-semibold text-[#649566]">
              Type of Account
            </h2>

            <div className="flex flex-col gap-5">
              <button
                onClick={() => setSelectedType('checking')}
                className={`w-full cursor-pointer rounded-2xl bg-white px-6 py-4 text-left text-[15px] font-semibold transition-all hover:-translate-y-1 hover:shadow-lg ${
                  selectedType === 'checking'
                    ? 'text-[#649566] ring-2 ring-[#649566] shadow-md'
                    : 'text-slate-400 ring-1 ring-black/5 hover:text-[#649566]'
                }`}
              >
                Checking Account
              </button>
              <button
                onClick={() => setSelectedType('savings')}
                className={`w-full cursor-pointer rounded-2xl bg-white px-6 py-4 text-left text-[15px] font-semibold transition-all hover:-translate-y-1 hover:shadow-lg ${
                  selectedType === 'savings'
                    ? 'text-[#649566] ring-2 ring-[#649566] shadow-md'
                    : 'text-slate-400 ring-1 ring-black/5 hover:text-[#649566]'
                }`}
              >
                Savings Account
              </button>
              <button
                onClick={() => setSelectedType('credit')}
                className={`w-full cursor-pointer rounded-2xl bg-white px-6 py-4 text-left text-[15px] font-semibold transition-all hover:-translate-y-1 hover:shadow-lg ${
                  selectedType === 'credit'
                    ? 'text-[#649566] ring-2 ring-[#649566] shadow-md'
                    : 'text-slate-400 ring-1 ring-black/5 hover:text-[#649566]'
                }`}
              >
                Credit Balance
              </button>
            </div>
          </div>
        </div>

        {/* 🟢 오른쪽 2단계 카드 */}
        {selectedType && (
          <div className="relative w-full max-w-[420px] animate-[fadeIn_0.5s_ease-in-out]">
            <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300">
              <Image src="/seuljeossi.png" alt="슬저씨" width={80} height={80} unoptimized />
            </div>

            <div className="relative z-20 rounded-[32px] bg-white px-10 py-12 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
              <h2 className="mb-10 text-center text-[22px] font-semibold text-[#649566]">
                {selectedType === 'checking' && 'Checking Account'}
                {selectedType === 'savings' && 'Savings Account'}
                {selectedType === 'credit' && 'Credit Balance'}
              </h2>

              {selectedType === 'checking' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      // ✨ 클릭 시 모달도 열고, 은행 이름도 저장합니다!
                      onClick={() => {
                        setSelectedBank('Bank of America');
                        setIsModalOpen(true);
                      }}
                      className="w-full cursor-pointer rounded-2xl bg-white px-6 py-4 text-left text-[15px] font-semibold text-slate-400 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:text-[#649566] hover:shadow-lg"
                    >
                      Bank of America
                    </button>
                    <span className="text-[12px] font-medium text-slate-300">
                      Adv Plus Banking | ***9330
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <button 
                      // ✨ Chase 버튼에도 똑같이 추가해 줍니다!
                      onClick={() => {
                        setSelectedBank('Chase');
                        setIsModalOpen(true);
                      }}
                      className="w-full cursor-pointer rounded-2xl bg-white px-6 py-4 text-left text-[15px] font-semibold text-slate-400 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:text-[#649566] hover:shadow-lg"
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
                  No account details
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🟢 3. 오버레이(모달) 영역 */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
          // ✨ 기존 클래스 맨 앞에 'relative'를 꼭 추가해 주세요!
          className="relative w-full max-w-[500px] rounded-3xl bg-[#f4f5f7] px-8 py-10 shadow-2xl"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* ✨ 왼쪽 위 닫기(X) 버튼 */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute right-6 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* 제목 영역 */}
          <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-[#649566]">
                Transaction
              </h2>
              {selectedBank && (
                <p className="mt-1 text-sm font-medium text-slate-400">
                  {selectedBank}
                </p>
              )}
            </div>

            {/* 검색창 */}
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full rounded-full bg-white px-5 py-3 pr-12 text-sm text-slate-700 placeholder:text-slate-400 shadow-[0_10px_25px_rgba(0,0,0,0.10)] outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-[#98c195]/50"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 hover:text-[#649566] hover:bg-black/5 transition cursor-pointer"
                aria-label="Search"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* 거래 내역 리스트 */}
            <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
              
              {/* ✨ 상단 월 표시 바 & 이동 버튼 */}
              <div className="flex items-center justify-between bg-[#b3b3b3] px-6 py-1.5 text-sm font-bold text-white z-20">
                <button 
                  onClick={handlePrevMonth}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/20"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                
                <span>{months[currentMonthIndex]} {currentYear}</span>
                
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
                    
                    <div className="sticky top-0 z-10 border-b border-t border-slate-100 bg-slate-50/95 backdrop-blur-sm px-5 py-1.5 text-[12px] font-bold text-slate-400">
                      {group.date}
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
                                <span className="text-[14px] font-semibold text-slate-800">
                                  {tx.name}
                                </span>
                                <span className="text-[11px] font-medium text-slate-400">
                                  {tx.time}
                                </span>
                              </div>
                            </div>
                            <span className={`text-sm font-extrabold ${tx.type === 'income' ? 'text-[#649566]' : 'text-red-500'}`}>
                              {tx.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-3 text-center text-[12px] font-medium text-slate-300">
                        No transactions
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