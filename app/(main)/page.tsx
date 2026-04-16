'use client';

import React, { useState } from 'react';
import { useGoals } from './GoalsContext';
import { useLanguage } from './LanguageContext';

type GoalPillProps = {
  label: string;
  valueText: string;
  percent?: number;
  tone?: 'normal' | 'danger';
  onClick?: () => void; // ✨ 클릭 이벤트 속성 추가!
};

function GoalPill({ label, valueText, percent = 0, tone = 'normal', onClick }: GoalPillProps) {
  const safe = Math.max(0, Math.min(100, percent));
  const isDanger = tone === 'danger';

  return (
    // ✨ cursor-pointer와 onClick 이벤트를 추가해서 캡슐을 누를 수 있게 만들었습니다.
    <div 
      onClick={onClick}
      className="w-full shrink-0 cursor-pointer rounded-full bg-white px-6 py-4 shadow-[0_5px_15px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/80 transition-transform hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-center justify-between text-[14px]">
        <span className="truncate pr-2 font-medium text-slate-800">{label}</span>
        <span className={`font-semibold ${isDanger ? 'text-red-500' : 'text-slate-500'}`}>
          {valueText}
        </span>
      </div>
      <div className="mt-2.5 h-[5px] w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-in-out ${isDanger ? 'bg-red-500' : 'bg-[#89b388]'}`}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

function Donut({ label, amount }: { label: string; amount: string }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-60 w-60 rounded-full bg-gradient-to-b from-[#cfe6c9] via-[#98c195] to-[#6ea96b] shadow-[0_24px_55px_rgba(0,0,0,0.20)]">
        <div className="absolute left-1/2 top-1/2 h-30 w-30 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-inner" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_25px_rgba(255,255,255,0.35)]" />
      </div>
      <div className="mt-7 flex items-center gap-3 text-slate-500">
        <span className="text-[15px] font-semibold">{t(label)}</span>
        <span className="text-2xl font-extrabold text-slate-600">{amount}</span>
      </div>
    </div>
  );
}

const ColumnHeaderSelector = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const options = ['Daily', 'Monthly', 'Yearly'];
  
  return (
    <div className="relative mx-auto flex w-fit flex-col items-center justify-center">
      <div 
        className="flex cursor-pointer items-center gap-1.5 transition-opacity hover:opacity-70"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[15px] font-semibold text-slate-400">{t(value)}</span>
        <svg 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full z-50 mt-2 w-[120px] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
            <div className="flex flex-col py-1.5">
              {options.map((opt) => (
                <div 
                  key={opt} 
                  className="group flex cursor-pointer items-center px-4 py-2.5 transition-colors hover:bg-slate-50"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                >
                  <span className={`text-[14px] ${value === opt ? 'font-bold text-[#649566]' : 'font-medium text-slate-600'}`}>
                    {t(opt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { dailyGoals, monthlyGoals, yearlyGoals } = useGoals();
  const { t } = useLanguage();

  const [leftCategory, setLeftCategory] = useState<'Daily' | 'Monthly' | 'Yearly'>('Daily');
  const [rightCategory, setRightCategory] = useState<'Daily' | 'Monthly' | 'Yearly'>('Monthly');

  // ✨ 현재 클릭해서 상세 정보를 보고 있는 목표를 저장하는 State
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  const goalDataMap = {
    Daily: dailyGoals,
    Monthly: monthlyGoals,
    Yearly: yearlyGoals,
  };

  const leftData = goalDataMap[leftCategory];
  const rightData = goalDataMap[rightCategory];

  return (
    <>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        
        {/* 🟢 Goals 섹션 */}
        <section className="flex aspect-[50/51] flex-col rounded-[32px] bg-[#f8f9fc] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white">
          <div className="text-[22px] font-semibold text-[#649566]">{t('Goals')}</div>
          
          <div className="mt-6 grid grid-cols-2 gap-6 text-center">
            <ColumnHeaderSelector value={leftCategory} onChange={(val: any) => setLeftCategory(val)} />
            <ColumnHeaderSelector value={rightCategory} onChange={(val: any) => setRightCategory(val)} />
          </div>
          
          <div className="relative mt-2 flex-1 overflow-hidden">
            <div className="grid h-full grid-cols-2 gap-6">
              
              {/* 📍 왼쪽 컬럼 */}
              <div 
                className="flex h-full flex-col gap-4 overflow-y-auto px-1 pb-16 pt-2 [&::-webkit-scrollbar]:hidden"
                style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
              >
                {leftData.length > 0 ? (
                  leftData.map((goal: any) => (
                    <GoalPill
                      key={goal.id}
                      label={goal.title}
                      valueText={`${Math.round((goal.current / goal.target) * 100)}%`}
                      percent={Math.round((goal.current / goal.target) * 100)}
                      tone={goal.current > goal.target ? 'danger' : 'normal'}
                      onClick={() => setSelectedGoal(goal)} // ✨ 클릭하면 모달 띄우기
                    />
                  ))
                ) : (
                  <div className="mt-10 text-center text-sm font-medium text-slate-300">
                    {t(`No ${leftCategory.toLowerCase()} goals`)}
                  </div>
                )}
              </div>

              {/* 📍 오른쪽 컬럼 */}
              <div 
                className="flex h-full flex-col gap-4 overflow-y-auto px-1 pb-16 pt-2 [&::-webkit-scrollbar]:hidden"
                style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
              >
                {rightData.length > 0 ? (
                  rightData.map((goal: any) => (
                    <GoalPill
                      key={goal.id}
                      label={goal.title}
                      valueText={`${Math.round((goal.current / goal.target) * 100)}%`}
                      percent={Math.round((goal.current / goal.target) * 100)}
                      tone={goal.current > goal.target ? 'danger' : 'normal'}
                      onClick={() => setSelectedGoal(goal)} // ✨ 클릭하면 모달 띄우기
                    />
                  ))
                ) : (
                  <div className="mt-10 text-center text-sm font-medium text-slate-300">
                    {t(`No ${rightCategory.toLowerCase()} goals`)}
                  </div>
                )}
              </div>
              
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8f9fc] via-[#f8f9fc]/90 to-transparent"></div>
          </div>
        </section>

        {/* 🟢 Total Spending 섹션 */}
        <section className="flex aspect-[50/51] flex-col rounded-[32px] bg-[#f8f9fc] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-white">
          <div className="flex items-start justify-between">
            <div className="text-[22px] font-semibold text-[#649566]">{t('Total Spending')}</div>
            <div className="text-[28px] font-extrabold text-slate-900">$ 1,082</div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <Donut label="Grocery" amount="$ 536" />
          </div>
        </section>
      </div>

      {/* 🟢 읽기 전용(Read-only) 목표 상세 모달창 */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedGoal(null)}>
          <div 
            className="relative w-full max-w-[420px] rounded-3xl bg-[#f4f5f7] px-8 py-10 shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 (X) 버튼 */}
            <button 
              onClick={() => setSelectedGoal(null)}
              className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="mb-8 text-center text-[22px] font-semibold text-[#649566]">
              {t('Goal Details')}
            </h2>

            {/* 상세 정보 리스트 (input 대신 div를 사용해 읽기 전용으로 만듦) */}
            <div className="flex flex-col gap-5">
              
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#649566]">{t('Name')}</label>
                <div className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5">
                  {selectedGoal.title}
                </div>
              </div>

              {/* Spent / Target (나란히 배치) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#649566]">{t('Spent')}</label>
                  <div className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5">
                    $ {selectedGoal.current}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#649566]">{t('Target')}</label>
                  <div className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5">
                    $ {selectedGoal.target}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#649566]">{t('Categories')}</label>
                <div className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5">
                  {selectedGoal.category || '-'}
                </div>
              </div>

              {/* Subcategory */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#649566]">{t('Subcategories')}</label>
                <div className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-black/5">
                  {selectedGoal.subcategory || '-'}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
