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
    
    // Sidebar & Navigation
    'Spending': '지출 내역',
    'Report': '보고서',
    'Goals': '목표',
    'Calendar': '캘린더',
    
    // Calendar & Dates
    'Sun': '일', 'Mon': '월', 'Tue': '화', 'Wed': '수', 'Thu': '목', 'Fri': '금', 'Sat': '토',
    'January': '1월', 'February': '2월', 'March': '3월', 'April': '4월', 'May': '5월', 'June': '6월',
    'July': '7월', 'August': '8월', 'September': '9월', 'October': '10월', 'November': '11월', 'December': '12월',
    'Jan': '1월', 'Feb': '2월', 'Mar': '3월', 'Apr': '4월', 'Jun': '6월', 'Jul': '7월', 'Aug': '8월', 'Sep': '9월', 'Oct': '10월', 'Nov': '11월', 'Dec': '12월',
    
    // Dashboard Page
    'Daily': '일간',
    'Monthly': '월간',
    'Yearly': '연간',
    'Total Spending': '총 지출',
    'Grocery': '식료품',
    'No daily goals': '일간 목표가 없습니다',
    'No monthly goals': '월간 목표가 없습니다',
    'No yearly goals': '연간 목표가 없습니다',
    'Goal Details': '목표 상세 정보',
    'Name': '이름',
    'Spent': '사용 금액',
    'Target': '목표 금액',
    'Categories': '카테고리',
    'Subcategories': '서브 카테고리',

    // Spending Page
    'Type of Account': '계좌 유형',
    'Checking Account': '체킹 계좌',
    'Savings Account': '저축 계좌',
    'Credit Balance': '신용 잔액',
    'No account details': '계좌 상세 정보가 없습니다',
    'Transaction': '거래 내역',
    'Search': '검색',
    'No transactions': '거래 내역이 없습니다',

    // Report Page
    'Select a Report Period': '보고서 기간 선택',
    'Weekly': '주간',
    'Monthly Report': '월간 보고서',
    'Key Summary & Insights': '주요 요약 및 인사이트',
    'Total Spent': '총 지출액',
    'Your Budget': '나의 예산',
    'Insight': '인사이트',
    'Top Categories': '주요 카테고리',
    'Food & Dining': '식사 및 외식',
    'Transport': '교통',
    'Coffee': '커피',

    // Goals Page
    'Edit Your Goal': '목표 수정',
    'Add Your Goals': '목표 추가',
    'Enter the name': '이름을 입력하세요',
    'Select the category': '카테고리를 선택하세요',
    'Select the subcategory': '서브 카테고리를 선택하세요',
    'Delete': '삭제',
    'Save Changes': '변경 사항 저장',
    'Add Goal': '목표 추가',
    'Add new...': '새로 추가...',
    'Add': '추가',
    'No options added yet.': '아직 추가된 항목이 없습니다.',

    // Calendar Page
    'No transactions for this day.': '이 날의 거래 내역이 없습니다.',
    'Memo': '메모',
    'No memo available.': '메모가 없습니다.',
    'Add memo..': '메모 추가..',

    // Account Setting / Personal Info
    'Personal Info': '개인 정보',
    'View and update your personal details': '개인 정보를 확인하고 수정하세요',
    'Verified Account': '인증된 계정',
    'Date of Birth': '생년월일',
    'Select Date': '날짜 선택',
    'Phone Number': '전화번호',
    'Home Address': '집 주소',
    'Email': '이메일',
    'Cancel': '취소',
    'Changes saved successfully!': '변경 사항이 저장되었습니다!',
    'Unsaved Changes Warning': "저장되지 않은 변경 사항이 있습니다. 저장하지 않고 나가시겠습니까? \n\n'확인'을 누르면 취소되고, '취소'를 누르면 계속 수정할 수 있습니다."
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
    
    // Sidebar & Navigation
    'Spending': 'Spending',
    'Report': 'Report',
    'Goals': 'Goals',
    'Calendar': 'Calendar',
    
    // Calendar & Dates
    'Sun': 'Sun', 'Mon': 'Mon', 'Tue': 'Tue', 'Wed': 'Wed', 'Thu': 'Thu', 'Fri': 'Fri', 'Sat': 'Sat',
    'January': 'January', 'February': 'February', 'March': 'March', 'April': 'April', 'May': 'May', 'June': 'June',
    'July': 'July', 'August': 'August', 'September': 'September', 'October': 'October', 'November': 'November', 'December': 'December',
    'Jan': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Apr', 'Jun': 'Jun', 'Jul': 'Jul', 'Aug': 'Aug', 'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dec',

    // Dashboard Page
    'Daily': 'Daily',
    'Monthly': 'Monthly',
    'Yearly': 'Yearly',
    'Total Spending': 'Total Spending',
    'Grocery': 'Grocery',
    'No daily goals': 'No daily goals',
    'No monthly goals': 'No monthly goals',
    'No yearly goals': 'No yearly goals',
    'Goal Details': 'Goal Details',
    'Name': 'Name',
    'Spent': 'Spent',
    'Target': 'Target',
    'Categories': 'Categories',
    'Subcategories': 'Subcategories',

    // Spending Page
    'Type of Account': 'Type of Account',
    'Checking Account': 'Checking Account',
    'Savings Account': 'Savings Account',
    'Credit Balance': 'Credit Balance',
    'No account details': 'No account details',
    'Transaction': 'Transaction',
    'Search': 'Search',
    'No transactions': 'No transactions',

    // Report Page
    'Select a Report Period': 'Select a Report Period',
    'Weekly': 'Weekly',
    'Monthly Report': 'Monthly Report',
    'Key Summary & Insights': 'Key Summary & Insights',
    'Total Spent': 'Total Spent',
    'Your Budget': 'Your Budget',
    'Insight': 'Insight',
    'Top Categories': 'Top Categories',
    'Food & Dining': 'Food & Dining',
    'Transport': 'Transport',
    'Coffee': 'Coffee',

    // Goals Page
    'Edit Your Goal': 'Edit Your Goal',
    'Add Your Goals': 'Add Your Goals',
    'Enter the name': 'Enter the name',
    'Select the category': 'Select the category',
    'Select the subcategory': 'Select the subcategory',
    'Delete': 'Delete',
    'Save Changes': 'Save Changes',
    'Add Goal': 'Add Goal',
    'Add new...': 'Add new...',
    'Add': 'Add',
    'No options added yet.': 'No options added yet.',

    // Calendar Page
    'No transactions for this day.': 'No transactions for this day.',
    'Memo': 'Memo',
    'No memo available.': 'No memo available.',
    'Add memo..': 'Add memo..',

    // Account Setting / Personal Info
    'Personal Info': 'Personal Info',
    'View and update your personal details': 'View and update your personal details',
    'Verified Account': 'Verified Account',
    'Date of Birth': 'Date of Birth',
    'Select Date': 'Select Date',
    'Phone Number': 'Phone Number',
    'Home Address': 'Home Address',
    'Email': 'Email',
    'Cancel': 'Cancel',
    'Changes saved successfully!': 'Changes saved successfully!',
    'Unsaved Changes Warning': "You have unsaved changes. Do you want to leave without saving? \n\nClick 'OK' to Discard, or 'Cancel' to Keep Editing."
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
