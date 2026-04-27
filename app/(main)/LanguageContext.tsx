'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ko' | 'en';
type Tone = 'Normal' | 'Friend';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  t: (key: string) => string;
  formatYear: (year: number | string) => string;
  formatDay: (day: number | string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ko: {
    // App Setting
    'App Setting': '앱 설정',
    'Language': '언어',
    'Notification': '알림',
    'Theme': '테마',
    'Change PW': '비밀번호 변경',
    'Friend': '친구',
    'Tone': '말투',
    'Language Settings': '언어 설정',
    'Tone Settings': '말투 설정',
    'Select your preferred language': '선호하는 언어를 선택하세요',
    'Select your preferred app tone': '앱의 전체적인 말투를 선택하세요',
    'Normal': '기본',
    'Friend_tone': '친구 (팩폭)',
    'Korean': '한국어',
    'English': '영어',
    'Settings': '설정',
    'related settings will be displayed here.': '관련 설정이 여기에 표시됩니다.',
    
    // Notification Settings
    'Daily Spending Reminders': '일일 지출 알림',
    'Daily Spending Reminders_friend': '야, 오늘 얼마나 썼냐?',
    'Budget Alerts': '예산 경고',
    'Budget Alerts_friend': '야, 너 지갑 거덜나기 직전이야',
    'Goal Achievements': '목표 달성 알림',
    'Goal Achievements_friend': '올~ 목표 달성? 웬일이냐?',
    'Marketing & Promotions': '마케팅 및 프로모션',
    'Report Notifications': '리포트 알림 설정',
    'Daily Reports': '일일 리포트 알림',
    'Weekly Reports': '주간 리포트 알림',
    'Monthly Reports': '월간 리포트 알림',
    'Yearly Reports': '연간 리포트 알림',
    'Receive notifications for your daily activities': '일일 활동에 대한 알림을 받습니다',
    'Get notified when you are close to your budget': '예산에 가까워지면 알림을 받습니다',
    'Celebrate when you reach your financial goals': '재정 목표를 달성하면 축하 알림을 받습니다',
    'Special offers and new feature updates': '특별 혜택 및 새로운 기능 업데이트',
    'Customize your report delivery preferences': '리포트 수신 설정을 사용자 정의합니다',
    'Daily summary of your spending and savings': '일일 지출 및 저축 요약을 받습니다',
    'Get a summary of your weekly spending habits': '주간 지출 습관에 대한 요약을 받습니다',
    'Detailed analysis of your monthly finances': '월간 재정에 대한 상세 분석을 받습니다',
    'Comprehensive overview of your yearly progress': '연간 진행 상황에 대한 종합적인 개요를 받습니다',
    
    // Theme Settings
    'Dark Mode': '다크 모드',
    'Primary Color': '기본 색상',
    'Enable dark mode for a better night experience': '야간 사용 시 눈이 편안한 다크 모드를 활성화합니다',
    'Choose your signature color for the app': '앱의 시그니처 색상을 선택하세요',
    
    // Sidebar & Navigation
    'Spending': '지출 내역',
    'Report': '리포트',
    'Goals': '목표',
    'Calendar': '캘린더',
    
    // Calendar & Dates
    'Sun': '일', 'Mon': '월', 'Tue': '화', 'Wed': '수', 'Thu': '목', 'Fri': '금', 'Sat': '토',
    'January': '1월', 'February': '2월', 'March': '3월', 'April': '4월', 'May': '5월', 'June': '6월',
    'July': '7월', 'August': '8월', 'September': '9월', 'October': '10월', 'November': '11월', 'December': '12월',
    'Jan': '1월', 'Feb': '2월', 'Mar': '3월', 'Apr': '4월', 'Jun': '6월', 'Jul': '7월', 'Aug': '8월', 'Sep': '9월', 'Oct': '10월', 'Nov': '11월', 'Dec': '12월',
    
    // Dashboard Page
    'Daily': '일일',
    'Monthly': '월간',
    'Yearly': '연간',
    'Total Spending': '총 지출',
    'Total Spending_friend': '야 너 오늘 총 $100이나 썼네, 너 부자야?',
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
    'Checking Account': '입출금 계좌',
    'Savings Account': '저축 계좌',
    'Credit Balance': '신용 잔액',
    'No account details': '계좌 상세 정보가 없습니다',
    'Transaction': '거래 내역',
    'Search': '검색',
    'No transactions': '거래 내역이 없습니다',

    // Report Page
    'Select a Report Period': '리포트 기간 선택',
    'Weekly': '주간',
    'Monthly Report': '월간 리포트',
    'Key Summary & Insights': '주요 요약 및 인사이트',
    'Total Spent': '총 지출액',
    'Your Budget': '나의 예산',
    'Insight': '인사이트',
    'Insight_friend': '팩폭 인사이트',
    'Top Categories': '주요 카테고리',
    'Food & Dining': '식사 및 외식',
    'Transport': '교통',
    'Coffee': '커피',
    
    'insight_text': '잘하셨어요! 평균 예산보다 적게 지출하셨습니다. 가장 큰 지출 항목은 식비였지만, 불필요한 쇼핑은 성공적으로 피하셨네요.',
    'insight_text_friend': '오~ 웬일이야? 이번엔 예산 좀 아꼈네? 식비에 좀 쓰긴 했어도 충동구매 안 한 건 칭찬해줄게.',

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
    'Back': '뒤로',
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
    'Friend': 'Friend',
    'Tone': 'Tone',
    'Language Settings': 'Language Settings',
    'Tone Settings': 'Tone Settings',
    'Select your preferred language': 'Select your preferred language',
    'Select your preferred app tone': 'Select your preferred app tone',
    'Normal': 'Normal',
    'Friend_tone': 'Friend (Blunt)',
    'Korean': 'Korean',
    'English': 'English',
    'Settings': 'Settings',
    'related settings will be displayed here.': 'related settings will be displayed here.',
    
    // Notification Settings
    'Daily Spending Reminders': 'Daily Spending Reminders',
    'Daily Spending Reminders_friend': 'Hey, how much did you blow today?',
    'Budget Alerts': 'Budget Alerts',
    'Budget Alerts_friend': 'Hey, your wallet is about to be empty',
    'Goal Achievements': 'Goal Achievements',
    'Goal Achievements_friend': 'Whoa, you actually reached a goal? Unbelievable.',
    'Marketing & Promotions': 'Marketing & Promotions',
    'Report Notifications': 'Report Notifications',
    'Daily Reports': 'Daily Reports',
    'Weekly Reports': 'Weekly Reports',
    'Monthly Reports': 'Monthly Reports',
    'Yearly Reports': 'Yearly Reports',
    'Receive notifications for your daily activities': 'Receive notifications for your daily activities',
    'Get notified when you are close to your budget': 'Get notified when you are close to your budget',
    'Celebrate when you reach your financial goals': 'Celebrate when you reach your financial goals',
    'Special offers and new feature updates': 'Special offers and new feature updates',
    'Customize your report delivery preferences': 'Customize your report delivery preferences',
    'Daily summary of your spending and savings': 'Daily summary of your spending and savings',
    'Get a summary of your weekly spending habits': 'Get a summary of your weekly spending habits',
    'Detailed analysis of your monthly finances': 'Detailed analysis of your monthly finances',
    'Comprehensive overview of your yearly progress': 'Comprehensive overview of your yearly progress',
    
    // Theme Settings
    'Dark Mode': 'Dark Mode',
    'Primary Color': 'Primary Color',
    'Enable dark mode for a better night experience': 'Enable dark mode for a better night experience',
    'Choose your signature color for the app': 'Choose your signature color for the app',
    
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
    'Total Spending_friend': 'You spent $100 on a vending machine today, are you rich?',
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
    'Insight_friend': 'Truth Bomb Insight',
    'Top Categories': 'Top Categories',
    'Food & Dining': 'Food & Dining',
    'Transport': 'Transport',
    'Coffee': 'Coffee',
    
    'insight_text': 'Great job! You spent less than your average budget. Your biggest expense was Food, but you successfully avoided unnecessary shopping.',
    'insight_text_friend': 'Look at you! Actually saved some money this time? You spent a bit on food, but I\'ll give you props for avoiding those impulse buys.',

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
    'Back': 'Back',
    'Changes saved successfully!': 'Changes saved successfully!',
    'Unsaved Changes Warning': "You have unsaved changes. Do you want to leave without saving? \n\nClick 'OK' to Discard, or 'Cancel' to Keep Editing."
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko');
  const [tone, setToneState] = useState<Tone>('Normal');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'ko' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
    
    const savedTone = localStorage.getItem('tone') as Tone;
    if (savedTone && (savedTone === 'Normal' || savedTone === 'Friend')) {
      setToneState(savedTone);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setTone = (t: Tone) => {
    console.log('Setting tone to:', t);
    setToneState(t);
    localStorage.setItem('tone', t);
  };

  const t = (key: string) => {
    if (tone === 'Friend') {
      const friendKey = `${key}_friend`;
      if (translations[language][friendKey]) {
        return translations[language][friendKey];
      }
    }
    return translations[language][key] || key;
  };

  const formatYear = (year: number | string) => {
    return language === 'ko' ? `${year}년` : `${year}`;
  };

  const formatDay = (day: number | string) => {
    return language === 'ko' ? `${day}일` : `${day}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, tone, setTone, t, formatYear, formatDay }}>
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
