'use client';

import { useState } from 'react';
import Sidebar from '../../components/sidebar';
import CalendarSidebar from '../../components/sidecalendar';
import AccountSetting from '../../components/AccountSetting';
import Image from 'next/image';
import { HiOutlineBars3, HiUser, HiChevronLeft } from 'react-icons/hi2';
import { GoalsProvider } from './GoalsContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isCalendarHovering, setCalendarHovering] = useState(false);
  const [isCalendarButtonVisible, setCalendarButtonVisible] = useState(true);

  const handleCloseCalendar = () => {
    setCalendarOpen(false);
    setCalendarButtonVisible(false);
    setTimeout(() => setCalendarButtonVisible(true), 200);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleAccountToggle = () => {
    if (isAccountOpen) {
      window.dispatchEvent(new Event('accountSettingCloseAttempt'));
    } else {
      setIsAccountOpen(true);
    }
  };

  return (
    <GoalsProvider>
      <div className="relative min-h-screen bg-[#eef0f3] flex flex-col">
        {/* Header */}
        <header className="w-full h-[96px] px-10 py-5 flex items-center justify-between">
          {/* Left */}
          <div
            className="relative inline-flex items-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="relative z-10 rounded-md bg-slate-900 p-2 text-white shadow hover:bg-slate-800 cursor-pointer"
              aria-label="Open sidebar"
            >
              <HiOutlineBars3 size={24} />
            </button>
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 transition-transform duration-500 ${
                isHovering ? 'translate-x-[24.5px]' : 'translate-x-0'
              }`}
            >
              <Image src="/seuljeossi_right.png" alt="슬저씨" width={48} height={48} unoptimized />
            </div>
          </div>

          {/* Profile / Back button */}
          <button
            onClick={handleAccountToggle}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:scale-105 transition-all duration-200 cursor-pointer"
            aria-label={isAccountOpen ? "Back to page" : "Account Settings"}
          >
            {isAccountOpen ? (
              <HiChevronLeft size={30} className="text-[#98c195]" />
            ) : (
              <HiUser size={30} className="text-[#98c195]" />
            )}
          </button>
        </header>

        {/* Calendar Open Button */}
        {isCalendarButtonVisible && !isCalendarOpen && (
          <div className="fixed top-1/2 right-0 z-30 -translate-y-1/2">
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-500 ${
                isCalendarHovering ? '-translate-x-[15px]' : 'translate-x-[60px]'
              }`}
            >
              <Image src="/seuljeossi_left.png" alt="슬저씨" width={48} height={48} unoptimized />
            </div>

              <button
              onClick={() => {
                  setCalendarOpen(true);
                  setCalendarHovering(false); 
              }}
              className="relative z-10 h-[500px] w-[25px] cusrsor-pointer border-none bg-transparent p-0 pointer-events-none"
              aria-label="Open calendar"
              >
              <svg width="25" height="500" className="absolute left-0 top-0 pointer-events-none">
                <g transform="rotate(-90, 40, 250)">
                  <polygon
                    points="40,0 40,0 80,250 0,250"
                    fill="#1E293B"
                    className="pointer-events-auto cursor-pointer"
                    onMouseEnter={() => setCalendarHovering(true)}
                    onMouseLeave={() => setCalendarHovering(false)}
                  />
                </g>
              </svg>
              <span className="relative text-2xl font-bold text-white pointer-events-none">&lt;</span>
            </button>
          </div>
        )}

        {/* Sidebars */}
        {isSidebarOpen && <div className="fixed inset-0 z-40" onClick={handleCloseSidebar} />}
        <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        {isCalendarOpen && <div className="fixed inset-0 z-40" onClick={handleCloseCalendar} />}
        <CalendarSidebar isOpen={isCalendarOpen} onClose={handleCloseCalendar} />

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-6 pb-10">
          <div className="w-full max-w-[1100px]">
            {isAccountOpen ? (
              <AccountSetting onClose={() => setIsAccountOpen(false)} />
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </GoalsProvider>
  );
}