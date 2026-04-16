'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ko: {
    // App Setting
    'App Setting': '앱 설정',
    'Language': '언어',
    'Notification': '알림',
    'Theme': '테마',
    'Change PW': '비밀번호 변경',
    'People': '사람들',
    'Tone': '말투',
    'Language Settings': '언어 설정',
    'Select your preferred language': '선호하는 언어를 선택하세요',
    'Korean': '한국어',
    'English': '영어',
    'Settings': '설정',
    'related settings will be displayed here.': '관련 설정이 여기에 표시됩니다.',
    
    // Sidebar
    'Spending': '지출 내역',
    'Report': '보고서',
    'Goals': '목표',
    'Calendar': '캘린더',
    
    // Calendar
    'Sun': '일', 'Mon': '월', 'Tue': '화', 'Wed': '수', 'Thu': '목', 'Fri': '금', 'Sat': '토',
    'January': '1월', 'February': '2월', 'March': '3월', 'April': '4월', 'May': '5월', 'June': '6월',
    'July': '7월', 'August': '8월', 'September': '9월', 'October': '10월', 'November': '11월', 'December': '12월',
    'No transactions for this day.': '이 날의 거래 내역이 없습니다.',
    'Memo': '메모',
    'No memo available.': '메모가 없습니다.',
  },
  en: {
    // App Setting
    'App Setting': 'App Setting',
    'Language': 'Language',
    'Notification': 'Notification',
    'Theme': 'Theme',
    'Change PW': 'Change PW',
    'People': 'People',
    'Tone': 'Tone',
    'Language Settings': 'Language Settings',
    'Select your preferred language': 'Select your preferred language',
    'Korean': 'Korean',
    'English': 'English',
    'Settings': 'Settings',
    'related settings will be displayed here.': 'related settings will be displayed here.',
    
    // Sidebar
    'Spending': 'Spending',
    'Report': 'Report',
    'Goals': 'Goals',
    'Calendar': 'Calendar',
    
    // Calendar
    'Sun': 'Sun', 'Mon': 'Mon', 'Tue': 'Tue', 'Wed': 'Wed', 'Thu': 'Thu', 'Fri': 'Fri', 'Sat': 'Sat',
    'January': 'January', 'February': 'February', 'March': 'March', 'April': 'April', 'May': 'May', 'June': 'June',
    'July': 'July', 'August': 'August', 'September': 'September', 'October': 'October', 'November': 'November', 'December': 'December',
    'No transactions for this day.': 'No transactions for this day.',
    'Memo': 'Memo',
    'No memo available.': 'No memo available.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'ko' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
