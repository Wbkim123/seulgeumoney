'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useLanguage } from '../LanguageContext';

export default function ReportPeriodPage() {
  const { t } = useLanguage();
  const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  // ✨ 실제 달력 기준으로 일요일마다 리셋되고 주/월 단위로 쌓이는 날짜 계산 로직
  const periodDetailsMap = useMemo(() => {
    const today = new Date();
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // 1. Daily (이번 주 '일요일'부터 '오늘'까지만 표시)
    const daily = [];
    const currentDayOfWeek = today.getDay(); // 0(일요일) ~ 6(토요일)
    for (let i = 0; i <= currentDayOfWeek; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      daily.push({
        raw: `${shortMonths[d.getMonth()]} ${d.getDate()}`,
        translated: `${t(shortMonths[d.getMonth()])} ${d.getDate()}`
      });
    }

    // 2. Weekly (완전히 지나간 '일~토' 일주일치 기록들)
    const weekly = [];
    for (let w = 1; w <= 4; w++) {
      const endOfPastWeek = new Date(today);
      endOfPastWeek.setDate(today.getDate() - currentDayOfWeek - 1 - ((w - 1) * 7));
      const startOfPastWeek = new Date(endOfPastWeek);
      startOfPastWeek.setDate(endOfPastWeek.getDate() - 6);
      
      if (startOfPastWeek.getMonth() === endOfPastWeek.getMonth()) {
        weekly.push({
          raw: `${shortMonths[startOfPastWeek.getMonth()]} ${startOfPastWeek.getDate()} - ${endOfPastWeek.getDate()}`,
          translated: `${t(shortMonths[startOfPastWeek.getMonth()])} ${startOfPastWeek.getDate()} - ${endOfPastWeek.getDate()}`
        });
      } else {
        weekly.push({
          raw: `${shortMonths[startOfPastWeek.getMonth()]} ${startOfPastWeek.getDate()} - ${shortMonths[endOfPastWeek.getMonth()]} ${endOfPastWeek.getDate()}`,
          translated: `${t(shortMonths[startOfPastWeek.getMonth()])} ${startOfPastWeek.getDate()} - ${t(shortMonths[endOfPastWeek.getMonth()])} ${endOfPastWeek.getDate()}`
        });
      }
    }

    // 3. Monthly
    const monthly = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthly.push({
        raw: `${longMonths[d.getMonth()]} ${d.getFullYear()}`,
        translated: `${t(longMonths[d.getMonth()])} ${d.getFullYear()}`
      });
    }

    // 4. Yearly
    const currentYear = today.getFullYear();
    const yearly = [
      { raw: `${currentYear}`, translated: `${currentYear}` }, 
      { raw: `${currentYear - 1}`, translated: `${currentYear - 1}` }, 
      { raw: `${currentYear - 2}`, translated: `${currentYear - 2}` }, 
      { raw: `${currentYear - 3}`, translated: `${currentYear - 3}` }, 
      { raw: `${currentYear - 4}`, translated: `${currentYear - 4}` }
    ];

    return {
      Daily: daily,
      Weekly: weekly,
      Monthly: monthly,
      Yearly: yearly,
    };
  }, [t]);

  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<{raw: string, translated: string} | null>(null);

  const handleOpenModal = (detail: {raw: string, translated: string}) => {
    setSelectedReportDetail(detail);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex min-h-[80vh] w-full items-center justify-center overflow-hidden pb-20 pt-10">
        
        <div className="relative flex items-center justify-center transition-all duration-500 ease-in-out">

          {/* 🟢 1단계: 왼쪽 박스 */}
          <div className="relative w-[420px] shrink-0 rounded-[32px] border border-white bg-white px-10 py-12 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
            
            {!selectedPeriod && (
              <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300">
                <Image src="/seuljeossi.png" alt="슬저씨" width={80} height={80} unoptimized />
              </div>
            )}

            <h2 className="mb-10 text-center text-[22px] font-semibold text-[#649566]">
              {t('Select a Report Period')}
            </h2>

            <div className="flex flex-col gap-5">
              {periods.map((period) => {
                const isSelected = selectedPeriod === period;
                return (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`w-full cursor-pointer rounded-2xl px-6 py-4 text-left text-[15px] font-semibold transition-all duration-300 ${
                      isSelected 
                        ? 'shadow-md ring-[1.5px] ring-[#98c195] text-[#649566]' 
                        : 'text-slate-400 ring-1 ring-black/5 hover:-translate-y-1 hover:shadow-lg hover:text-[#649566]'
                    }`}
                  >
                    {t(period)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🟢 2단계: 오른쪽 상세 박스 */}
          <div 
            className={`overflow-visible transition-all duration-500 ease-in-out ${
              selectedPeriod ? 'ml-10 w-[420px] opacity-100' : 'ml-0 w-0 opacity-0'
            }`}
          >
            <div className="relative w-[420px] rounded-[32px] border border-white bg-white px-10 py-12 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
              
              {selectedPeriod && (
                <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 z-10 transition-opacity duration-300">
                  <Image src="/seuljeossi.png" alt="슬저씨" width={80} height={80} unoptimized />
                </div>
              )}

              <h2 className="mb-10 text-center text-[22px] font-semibold text-[#649566]">
                {selectedPeriod ? t(selectedPeriod) : t('Select')}
              </h2>

              {/* ✨ 수정된 부분: 최대 높이(max-h-[320px])를 설정하고 예쁜 스크롤바 적용! */}
              <div className="flex max-h-[320px] flex-col gap-5 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
                {(selectedPeriod ? periodDetailsMap[selectedPeriod as keyof typeof periodDetailsMap] : []).map((detail, index) => (
                  <button
                    key={index}
                    onClick={() => handleOpenModal(detail)}
                    // ✨ 버튼이 스크롤되면서 찌그러지지 않도록 shrink-0 추가
                    className="w-full shrink-0 cursor-pointer rounded-2xl bg-white px-6 py-4 text-left text-[15px] font-semibold text-slate-400 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-lg hover:text-[#649566]"
                  >
                    {detail.translated}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🟢 3단계: 리포트 핵심 요약 모달 (Modal) */}
      {isModalOpen && selectedReportDetail && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsModalOpen(false)} 
        >
          <div 
            className="relative flex w-full max-w-[520px] max-h-[85vh] flex-col rounded-[32px] bg-[#f8f9fc] px-8 py-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          >
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

            <div className="mb-8 shrink-0 text-center">
              <h2 className="text-[24px] font-bold text-[#649566]">
                {selectedReportDetail.translated}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-400">
                {t('Key Summary & Insights')}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
              <div className="flex flex-col gap-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ring-1 ring-black/5">
                    <div className="text-[13px] font-semibold text-slate-400">{t('Total Spent')}</div>
                    <div className="mt-2 text-2xl font-extrabold text-slate-800">$ 145.50</div>
                  </div>
                  <div className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ring-1 ring-black/5">
                    <div className="text-[13px] font-semibold text-slate-400">{t('Your Budget')}</div>
                    <div className="mt-2 text-2xl font-extrabold text-[#649566]">$ 200.00</div>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#f0f5f0] p-6 ring-1 ring-[#98c195]/30">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    <h3 className="text-[15px] font-bold text-[#649566]">{t('Insight')}</h3>
                  </div>
                  <p className="text-[14px] font-medium leading-relaxed text-[#527a54]">
                    {t('language') === 'ko' ? (
                      <>잘하셨어요! 평균 예산보다 <span className="font-bold text-[#649566]">27% 적게</span> 지출하셨습니다. 가장 큰 지출 항목은 <span className="font-bold">식비</span>였지만, 불필요한 쇼핑은 성공적으로 피하셨네요.</>
                    ) : (
                      <>Great job! You spent <span className="font-bold text-[#649566]">27% less</span> than your average budget. Your biggest expense was <span className="font-bold">Food</span>, but you successfully avoided unnecessary shopping.</>
                    )}
                  </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ring-1 ring-black/5">
                  <h3 className="mb-5 text-[15px] font-bold text-slate-700">{t('Top Categories')}</h3>
                  
                  <div className="flex flex-col gap-6">
                    <div>
                      <div className="mb-2 flex justify-between text-[14px] font-semibold">
                        <span className="text-slate-700">🍔 {t('Food & Dining')}</span>
                        <span className="text-slate-800">$ 85.00</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[#89b388]" style={{ width: '58%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-2 flex justify-between text-[14px] font-semibold">
                        <span className="text-slate-700">🚕 {t('Transport')}</span>
                        <span className="text-slate-800">$ 45.00</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[#a3c9a2]" style={{ width: '31%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-[14px] font-semibold">
                        <span className="text-slate-700">☕ {t('Coffee')}</span>
                        <span className="text-slate-800">$ 15.50</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[#c2e0c1]" style={{ width: '11%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
