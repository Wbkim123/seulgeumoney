'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGoals } from '../GoalsContext'; // ✨ 공용 저장소 불러오기
import { useLanguage } from '../LanguageContext';

// ✨ 커스텀 드롭다운 컴포넌트
const CustomSelect = ({ 
  placeholder, options, value, onChange, onAddOption, onDeleteOption 
}: { 
  placeholder: string; options: string[]; value: string; onChange: (val: string) => void; onAddOption: (val: string) => void; onDeleteOption: (val: string) => void; 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const { t } = useLanguage();

  return (
    <div className="relative">
      <div
        className={`flex w-full cursor-pointer items-center justify-between rounded-2xl bg-surface px-5 py-3.5 text-sm shadow-sm outline-none ring-1 transition-all ${
          value ? 'text-text-main ring-border-custom/10' : 'text-slate-300 ring-border-custom/10'
        } ${isOpen ? 'ring-2 ring-[var(--primary-light)]/50' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{value || t(placeholder)}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 text-text-muted ${isOpen ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl bg-surface shadow-xl ring-1 ring-border-custom/10">
            <div className="max-h-40 overflow-y-auto">
              {options.map((opt) => (
                <div 
                  key={opt} 
                  className="group flex cursor-pointer items-center justify-between px-5 py-3 transition-colors hover:bg-surface-alt"
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                >
                  <span className={`text-sm ${value === opt ? 'font-bold text-[var(--primary)]' : 'font-medium text-text-main'}`}>{t(opt)}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteOption(opt); }}
                    className="text-slate-300 opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                    title="Delete category"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
              {options.length === 0 && (
                <div className="px-5 py-3 text-sm text-text-muted">{t('No options added yet.')}</div>
              )}
            </div>
            
            <div className="relative z-50 border-t border-border-custom/10 bg-surface-alt p-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder={t('Add new...')}
                  className="flex-1 rounded-xl bg-surface px-3 py-2 text-sm text-text-main shadow-sm outline-none ring-1 ring-border-custom/10 focus:ring-2 focus:ring-[var(--primary-light)]/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newItem.trim()) {
                      onAddOption(newItem.trim());
                      setNewItem('');
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (newItem.trim()) {
                      onAddOption(newItem.trim());
                      setNewItem('');
                    }
                  }}
                  className="cursor-pointer rounded-xl bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
                >
                  {t('Add')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// 🎨 기둥(Column) 컴포넌트
const GoalColumn = ({ 
  title, 
  goals, 
  onAddClick, 
  onEditClick, 
  onReorder 
}: { 
  title: string; 
  goals: any[]; 
  onAddClick: () => void; 
  onEditClick: (goal: any) => void; 
  onReorder: (newGoals: any[]) => void;
}) => {
  const { t } = useLanguage();
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newGoals = [...goals];
      const draggedGoal = newGoals.splice(dragItem.current, 1)[0];
      newGoals.splice(dragOverItem.current, 0, draggedGoal);
      onReorder(newGoals);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="relative flex w-full flex-1 flex-col overflow-hidden rounded-[40px] bg-surface px-6 pt-8 shadow-[0_8px_30px_rgba(0,0,0,0.05)] ring-1 ring-border-custom/10 border border-border-custom/5">
      <div className="mb-7 flex items-center justify-between px-3">
        <h2 className="text-[18px] font-medium text-[var(--primary)]">{t(title)}</h2>
        <button onClick={onAddClick} className="flex h-6 w-6 cursor-pointer items-center justify-center text-2xl font-light text-text-muted transition-colors hover:text-[var(--primary)]">+</button>
      </div>
      
      <div 
        onDragOver={(e) => e.preventDefault()}
        className="flex h-[430px] flex-col gap-4 overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden" 
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {goals.map((goal, index) => {
          const percentage = Math.round((goal.current / goal.target) * 100);
          const isOverLimit = percentage > 100; 
          
          return (
            <div 
              key={goal.id} 
              draggable
              onDragStart={() => (dragItem.current = index)}
              onDragEnter={() => (dragOverItem.current = index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => onEditClick(goal)} 
              className="flex shrink-0 cursor-grab active:cursor-grabbing flex-col justify-center gap-1.5 rounded-full bg-surface-alt px-6 py-4 shadow-[0_5px_15px_rgba(0,0,0,0.04)] ring-1 ring-border-custom/10 transition-transform hover:-translate-y-1 hover:shadow-md border border-border-custom/5"
            >
              <div className="flex items-center justify-between gap-4 pointer-events-none">
                <span className="truncate text-[14px] font-medium text-text-main">{goal.title}</span>
                <span className={`shrink-0 text-[10px] font-semibold ${isOverLimit ? 'text-red-500' : 'text-text-muted'}`}>{percentage}%</span>
              </div>
              <div className="flex items-center justify-between gap-5 pointer-events-none">
                <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-[4px]">
                  <div className={`h-full rounded-full transition-all duration-500 ease-in-out ${isOverLimit ? 'bg-red-500' : 'bg-[var(--primary-light)]'}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                </div>
                <div className="shrink-0 text-right">
                  <span className={`tracking-tight text-[12px] font-semibold ${isOverLimit ? 'text-red-500' : 'text-text-main'}`}>
                    {isOverLimit ? `$-${goal.current - goal.target}` : `$${goal.current}`}
                    <span className="text-text-muted text-[10px] font-medium"> / ${goal.target}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 🚀 메인 페이지
export default function GoalsPage() {
  const {
    dailyGoals, setDailyGoals,
    monthlyGoals, setMonthlyGoals,
    yearlyGoals, setYearlyGoals
  } = useGoals();
  const { t } = useLanguage();

  const [categoryList, setCategoryList] = useState(['Food', 'Transport', 'Shopping']);
  const [subCategoryList, setSubCategoryList] = useState(['Coffee', 'Groceries', 'Taxi']);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'Daily' | 'Monthly' | 'Yearly' | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);

  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState(''); // Target Amount
  const [goalSpent, setGoalSpent] = useState('');   // ✨ Spent Amount (추가됨!)
  const [goalCategory, setGoalCategory] = useState('');
  const [goalSubcategory, setGoalSubcategory] = useState('');

  // ✨ 빈칸 유효성 검사에 goalSpent 추가
  const isFormValid = goalName.trim() !== '' && goalAmount.trim() !== '' && goalSpent.trim() !== '' && goalCategory !== '' && goalSubcategory !== '';

  const handleOpenAddModal = (category: 'Daily' | 'Monthly' | 'Yearly') => {
    setActiveCategory(category);
    setEditingGoalId(null);
    setGoalName(''); 
    setGoalAmount(''); 
    setGoalSpent('0'); // ✨ 새로 추가할 때는 기본적으로 사용한 금액이 0원!
    setGoalCategory(''); 
    setGoalSubcategory('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: 'Daily' | 'Monthly' | 'Yearly', goal: any) => {
    setActiveCategory(category);
    setEditingGoalId(goal.id);
    setGoalName(goal.title); 
    setGoalAmount(goal.target.toString()); 
    setGoalSpent(goal.current.toString()); // ✨ 기존에 사용한 금액 불러오기!
    setGoalCategory(goal.category || ''); 
    setGoalSubcategory(goal.subcategory || '');
    setIsModalOpen(true);
  };

  const handleSaveGoal = () => {
    if (!isFormValid) return;
    const updateList = (list: any[]) => {
      const sanitizedSpent = Number(Number(goalSpent).toFixed(2));
      const sanitizedAmount = Math.round(Number(goalAmount));

      if (editingGoalId) {
        return list.map((g) => g.id === editingGoalId ? { 
          ...g, 
          title: goalName, 
          current: sanitizedSpent, // ✨ 수정한 사용 금액 저장
          target: sanitizedAmount, 
          category: goalCategory, 
          subcategory: goalSubcategory 
        } : g);
      }
      return [...list, { 
        id: Date.now(), 
        title: goalName, 
        current: sanitizedSpent, // ✨ 새로 추가한 사용 금액 저장
        target: sanitizedAmount, 
        category: goalCategory, 
        subcategory: goalSubcategory 
      }];
    };

    if (activeCategory === 'Daily') setDailyGoals(updateList(dailyGoals));
    else if (activeCategory === 'Monthly') setMonthlyGoals(updateList(monthlyGoals));
    else if (activeCategory === 'Yearly') setYearlyGoals(updateList(yearlyGoals));

    setIsModalOpen(false);
  };

  const handleDeleteGoal = () => {
    if (!editingGoalId) return;
    const filterList = (list: any[]) => list.filter(g => g.id !== editingGoalId);
    if (activeCategory === 'Daily') setDailyGoals(filterList(dailyGoals));
    else if (activeCategory === 'Monthly') setMonthlyGoals(filterList(monthlyGoals));
    else if (activeCategory === 'Yearly') setYearlyGoals(filterList(yearlyGoals));
    setIsModalOpen(false);
  };

  // 엔터키 전역 이벤트
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement;
        if (target?.tagName === 'INPUT' && (target as HTMLInputElement).placeholder === t('Add new...')) return;
        if (target?.tagName === 'BUTTON') return;
        if (isFormValid) {
          e.preventDefault();
          handleSaveGoal();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  });

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1200px] items-stretch justify-center gap-8 pb-20 pt-10">
        <GoalColumn title="Daily" goals={dailyGoals} onAddClick={() => handleOpenAddModal('Daily')} onEditClick={(goal) => handleOpenEditModal('Daily', goal)} onReorder={setDailyGoals} />
        <GoalColumn title="Monthly" goals={monthlyGoals} onAddClick={() => handleOpenAddModal('Monthly')} onEditClick={(goal) => handleOpenEditModal('Monthly', goal)} onReorder={setMonthlyGoals} />
        <GoalColumn title="Yearly" goals={yearlyGoals} onAddClick={() => handleOpenAddModal('Yearly')} onEditClick={(goal) => handleOpenEditModal('Yearly', goal)} onReorder={setYearlyGoals} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-[420px] rounded-3xl bg-surface px-8 py-10 shadow-2xl border border-border-custom/5">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface-alt hover:text-slate-700"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="mb-8 text-center text-[22px] font-semibold text-[var(--primary)]">
              {editingGoalId ? t('Edit Your Goal') : t('Add Your Goals')}
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--primary)]">{t('Name')}</label>
                <input 
                  type="text" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder={t('Enter the name')} 
                  className="w-full rounded-2xl bg-surface px-5 py-3.5 text-sm text-text-main placeholder:text-text-muted shadow-sm outline-none ring-1 ring-border-custom/10 focus:ring-2 focus:ring-[var(--primary-light)]/50"
                />
              </div>

              {/* ✨ 2칸으로 나눈 Amount 입력창 영역 (Target / Spent) */}
              <div className="grid grid-cols-2 gap-4">
                {/* 1. 사용한 금액 (Spent Amount) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--primary)]">{t('Spent')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">$</span>
                    <input 
                      type="number" 
                      step="0.01"
                      value={goalSpent} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                          setGoalSpent(val);
                        }
                      }} 
                      placeholder="0" 
                      className="w-full rounded-2xl bg-surface py-3.5 pl-7 pr-3 text-sm text-text-main placeholder:text-text-muted shadow-sm outline-none ring-1 ring-border-custom/10 focus:ring-2 focus:ring-[var(--primary-light)]/50 [&::-webkit-inner-spin-button]:cursor-pointer [&::-webkit-outer-spin-button]:cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2. 목표 금액 (Target Amount) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--primary)]">{t('Target')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">$</span>
                    <input 
                      type="number" 
                      step="1"
                      value={goalAmount} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d+$/.test(val)) {
                          setGoalAmount(val);
                        } else {
                          const rounded = Math.round(Number(val));
                          if (!isNaN(rounded)) setGoalAmount(rounded.toString());
                        }
                      }} 
                      onBlur={() => {
                        if (goalAmount !== "") {
                          setGoalAmount(Math.round(Number(goalAmount)).toString());
                        }
                      }}
                      placeholder="0" 
                      className="w-full rounded-2xl bg-surface py-3.5 pl-7 pr-3 text-sm text-text-main placeholder:text-text-muted shadow-sm outline-none ring-1 ring-border-custom/10 focus:ring-2 focus:ring-[var(--primary-light)]/50 [&::-webkit-inner-spin-button]:cursor-pointer [&::-webkit-outer-spin-button]:cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--primary)]">{t('Categories')}</label>
                <CustomSelect
                  placeholder="Select the category" options={categoryList} value={goalCategory} onChange={setGoalCategory}
                  onAddOption={(newVal) => { if (!categoryList.includes(newVal)) setCategoryList([...categoryList, newVal]); }}
                  onDeleteOption={(delVal) => { setCategoryList(categoryList.filter(c => c !== delVal)); if (goalCategory === delVal) setGoalCategory(''); }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--primary)]">{t('Subcategories')}</label>
                <CustomSelect
                  placeholder="Select the subcategory" options={subCategoryList} value={goalSubcategory} onChange={setGoalSubcategory}
                  onAddOption={(newVal) => { if (!subCategoryList.includes(newVal)) setSubCategoryList([...subCategoryList, newVal]); }}
                  onDeleteOption={(delVal) => { setSubCategoryList(subCategoryList.filter(c => c !== delVal)); if (goalSubcategory === delVal) setGoalSubcategory(''); }}
                />
              </div>

              <div className="mt-4 flex gap-3">
                {editingGoalId && (
                  <button onClick={handleDeleteGoal} className="flex-1 cursor-pointer rounded-2xl bg-red-50 py-4 text-[15px] font-semibold text-red-500 shadow-sm transition-all hover:-translate-y-1 hover:bg-red-100">
                    {t('Delete')}
                  </button>
                )}
                <button 
                  onClick={handleSaveGoal} disabled={!isFormValid}
                  className={`flex-[2] rounded-2xl py-4 text-[15px] font-semibold text-white transition-all ${
                    isFormValid ? 'cursor-pointer bg-[var(--primary)] shadow-lg hover:-translate-y-1 hover:bg-[var(--primary-hover)]' : 'cursor-not-allowed bg-slate-300 opacity-70'
                  }`}
                >
                  {editingGoalId ? t('Save Changes') : t('Add Goal')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
