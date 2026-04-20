'use client';

import React, { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { useLanguage } from '../app/(main)/LanguageContext';

interface AppSettingProps {
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  'Language',
  'Notification',
  'Theme',
  'Change PW',
  'People',
  'Tone',
];

export default function AppSetting({ isOpen, onClose }: AppSettingProps) {
  const [activeTab, setActiveTab] = useState('Language');
  const [isReportSubView, setIsReportSubView] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Notification states
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    budgetAlerts: true,
    goalAchievements: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: true,
    yearlyReports: true,
    marketing: false,
  });

  // Reset subview when tab changes
  React.useEffect(() => {
    setIsReportSubView(false);
  }, [activeTab]);

  // Load notification settings from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('seulgeumoney_notifications');
    if (saved) {
      try {
        setNotifications((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error('Failed to parse notification settings', e);
      }
    }
  }, []);

  // Save notification settings to localStorage
  const updateNotification = (key: keyof typeof notifications) => {
    const newSettings = { ...notifications, [key]: !notifications[key] };
    setNotifications(newSettings);
    localStorage.setItem('seulgeumoney_notifications', JSON.stringify(newSettings));
  };

  if (!isOpen) return null;

  const NotificationToggle = ({ label, desc, enabled, onToggle }: { label: string, desc: string, enabled: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-bold text-slate-800">{t(label)}</span>
        <span className="text-[12px] font-medium text-slate-400">{t(desc)}</span>
      </div>
      <button 
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:outline-none active:scale-95 ${
          enabled ? 'bg-[#649566]' : 'bg-slate-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  const SubMenuLink = ({ label, desc, onClick }: { label: string, desc: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="flex items-center justify-between py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors px-2 -mx-2 rounded-xl group cursor-pointer"
    >
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-[15px] font-bold text-slate-800 group-hover:text-[#649566] transition-colors">{t(label)}</span>
        <span className="text-[12px] font-medium text-slate-400">{t(desc)}</span>
      </div>
      <div className="text-slate-300 group-hover:text-[#649566] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </button>
  );

  return (
    // ✨ 화면 전체를 덮는 어두운 배경 오버레이 (z-index를 사이드바보다 높게 설정)
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity"
      onClick={onClose} // 배경 클릭 시 닫힘
    >
      {/* 🟢 중앙 모달 박스 (사진 속 연회색 배경) */}
      <div 
        className="relative flex h-[80vh] w-full max-w-[900px] flex-col rounded-[24px] bg-[#f0f2f5] p-6 shadow-2xl sm:p-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 방지
      >
        
        {/* 상단 헤더: 타이틀과 닫기 버튼 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1" /> {/* 중앙 정렬을 위한 빈 공간 */}
          <h2 className="text-[22px] font-bold text-[#649566]">
            {t('App Setting')}
          </h2>
          <div className="flex-1 flex justify-end">
            <button
              onClick={onClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#649566] transition-colors hover:bg-black/5"
              aria-label="Close"
            >
              <HiXMark size={24} strokeWidth={1} />
            </button>
          </div>
        </div>

        {/* 🟢 모달 내부의 하얀색 컨텐츠 박스 (좌측 탭 + 우측 내용) */}
        <div className="flex flex-1 overflow-hidden rounded-[20px] bg-white shadow-sm ring-1 ring-black/5">
          
          {/* 좌측 네비게이션 탭 */}
          <aside className="w-[200px] bg-[#f8f9fa] border-r border-slate-100 p-4">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`cursor-pointer px-4 py-3 text-center text-[14px] font-semibold transition-all ${
                      isActive
                        ? 'rounded-[14px] bg-white text-[#649566] shadow-sm ring-1 ring-slate-200/60' // 선택된 탭 강조
                        : 'text-slate-400 hover:bg-black/5 hover:text-[#649566] rounded-[14px]' // 호버 시 색상 변경 추가
                    }`}
                  >
                    {t(tab)}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* 우측 컨텐츠 영역 (선택된 탭에 따라 내용이 바뀜) */}
          <main className="flex-1 p-8 overflow-y-auto">
            <h3 className="text-[20px] font-bold text-slate-800 mb-6">
              {t(activeTab)} {t('Settings')}
            </h3>
            
            <div className="text-[14px] text-slate-500">
              {activeTab === 'Language' ? (
                <div className="flex flex-col gap-6">
                   <p className="text-slate-600 font-medium">{t('Select your preferred language')}</p>
                   <div className="flex gap-4">
                      <button 
                        onClick={() => setLanguage('ko')}
                        className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all duration-200 font-bold text-[16px] cursor-pointer ${
                          language === 'ko' 
                          ? 'border-[#649566] bg-[#649566]/5 text-[#649566]' 
                          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {t('Korean')}
                      </button>
                      <button 
                        onClick={() => setLanguage('en')}
                        className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all duration-200 font-bold text-[16px] cursor-pointer ${
                          language === 'en' 
                          ? 'border-[#649566] bg-[#649566]/5 text-[#649566]' 
                          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {t('English')}
                      </button>
                   </div>
                </div>
              ) : activeTab === 'Notification' ? (
                <div className="flex flex-col animate-fade-in" key={isReportSubView ? 'report' : 'general'}>
                  {!isReportSubView ? (
                    <>
                      <NotificationToggle 
                        label="Daily Spending Reminders" 
                        desc="Receive notifications for your daily activities" 
                        enabled={notifications.dailyReminders} 
                        onToggle={() => updateNotification('dailyReminders')} 
                      />
                      <NotificationToggle 
                        label="Budget Alerts" 
                        desc="Get notified when you are close to your budget" 
                        enabled={notifications.budgetAlerts} 
                        onToggle={() => updateNotification('budgetAlerts')} 
                      />
                      <NotificationToggle 
                        label="Goal Achievements" 
                        desc="Celebrate when you reach your financial goals" 
                        enabled={notifications.goalAchievements} 
                        onToggle={() => updateNotification('goalAchievements')} 
                      />
                      <SubMenuLink 
                        label="Report Notifications"
                        desc="Customize your report delivery preferences"
                        onClick={() => setIsReportSubView(true)}
                      />
                      <NotificationToggle 
                        label="Marketing & Promotions" 
                        desc="Special offers and new feature updates" 
                        enabled={notifications.marketing} 
                        onToggle={() => updateNotification('marketing')} 
                      />
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsReportSubView(false)}
                        className="mb-4 flex items-center gap-2 text-[#649566] font-bold hover:underline cursor-pointer w-max"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        {t('Back')}
                      </button>
                      <NotificationToggle 
                        label="Daily Reports" 
                        desc="Daily summary of your spending and savings" 
                        enabled={notifications.dailyReports} 
                        onToggle={() => updateNotification('dailyReports')} 
                      />
                      <NotificationToggle 
                        label="Weekly Reports" 
                        desc="Get a summary of your weekly spending habits" 
                        enabled={notifications.weeklyReports} 
                        onToggle={() => updateNotification('weeklyReports')} 
                      />
                      <NotificationToggle 
                        label="Monthly Reports" 
                        desc="Detailed analysis of your monthly finances" 
                        enabled={notifications.monthlyReports} 
                        onToggle={() => updateNotification('monthlyReports')} 
                      />
                      <NotificationToggle 
                        label="Yearly Reports" 
                        desc="Comprehensive overview of your yearly progress" 
                        enabled={notifications.yearlyReports} 
                        onToggle={() => updateNotification('yearlyReports')} 
                      />
                    </>
                  )}
                </div>
              ) : (
                <div>
                  {t(activeTab)} {t('related settings will be displayed here.')}
                </div>
              )}
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}
