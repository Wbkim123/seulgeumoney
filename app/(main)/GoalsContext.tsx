'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 📝 초기 데이터 (처음 접속했을 때만 보여줄 데이터)
const initialDailyGoals = [
  { id: 1, title: 'Meal', current: 0, target: 100, category: 'Food', subcategory: 'Groceries' }, 
  { id: 2, title: 'Text', current: 110, target: 100, category: 'Transport', subcategory: 'Taxi' }, 
  { id: 3, title: '음식', current: 0, target: 100, category: 'Food', subcategory: 'Groceries' },
  { id: 4, title: 'Text', current: 0, target: 100, category: 'Shopping', subcategory: 'Coffee' },
  { id: 5, title: 'Coffee', current: 40, target: 100, category: 'Food', subcategory: 'Coffee' }, 
];

const initialMonthlyGoals = [
  { id: 6, title: 'Text', current: 0, target: 100, category: 'Transport', subcategory: 'Taxi' },
  { id: 7, title: 'Text', current: 0, target: 100, category: 'Shopping', subcategory: 'Groceries' },
];

const initialYearlyGoals = [
  { id: 8, title: 'ShoppingShoppingShopping', current: 1100, target: 1000, category: 'Shopping', subcategory: 'Coffee' }, 
  { id: 9, title: '문화생활문화생활문화생활', current: 70, target: 100, category: 'Shopping', subcategory: 'Coffee' },
  { id: 10, title: '문화생활', current: 0, target: 100, category: 'Shopping', subcategory: 'Coffee' },
];

const GoalsContext = createContext<any>(null);

export const GoalsProvider = ({ children }: { children: React.ReactNode }) => {
  const [dailyGoals, setDailyGoals] = useState(initialDailyGoals);
  const [monthlyGoals, setMonthlyGoals] = useState(initialMonthlyGoals);
  const [yearlyGoals, setYearlyGoals] = useState(initialYearlyGoals);

  // ✨ 추가된 마법의 로직 1: 처음 화면이 켜질 때 브라우저 저장소(localStorage)에서 내 데이터 꺼내오기!
  useEffect(() => {
    const savedDaily = localStorage.getItem('dailyGoals');
    const savedMonthly = localStorage.getItem('monthlyGoals');
    const savedYearly = localStorage.getItem('yearlyGoals');

    if (savedDaily) setDailyGoals(JSON.parse(savedDaily));
    if (savedMonthly) setMonthlyGoals(JSON.parse(savedMonthly));
    if (savedYearly) setYearlyGoals(JSON.parse(savedYearly));
  }, []);

  // ✨ 추가된 마법의 로직 2: 데이터가 추가/수정/삭제/순서변경 될 때마다 브라우저에 자동 저장하기!
  useEffect(() => {
    localStorage.setItem('dailyGoals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  useEffect(() => {
    localStorage.setItem('monthlyGoals', JSON.stringify(monthlyGoals));
  }, [monthlyGoals]);

  useEffect(() => {
    localStorage.setItem('yearlyGoals', JSON.stringify(yearlyGoals));
  }, [yearlyGoals]);

  return (
    <GoalsContext.Provider value={{
      dailyGoals, setDailyGoals,
      monthlyGoals, setMonthlyGoals,
      yearlyGoals, setYearlyGoals
    }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => useContext(GoalsContext);