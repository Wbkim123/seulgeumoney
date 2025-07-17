'use client';

import { useState } from 'react';
import Sidebar from '../components/sidebar';
import CalendarSidebar from '../components/sidecalendar';
import { HiOutlineBars3 } from 'react-icons/hi2';
import Image from 'next/image';

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false); // 마우스 호버 상태
  const [isCalendarButtonVisible, setCalendarButtonVisible] = useState(true);

  const handleCloseCalendar = () => {
    setCalendarOpen(false);
    setCalendarButtonVisible(false);
    setTimeout(() => {
      setCalendarButtonVisible(true);
    }, 200);  // 원하는 지연 시간 (예: 300ms)
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* 🔲 사이드바 열기 버튼 */}
      <div
        className="relative inline-block m-4"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className="relative z-10 p-2 text-white bg-gray-800 rounded hover:bg-gray-700 cursor-pointer"
        >
          <HiOutlineBars3 size={24} />
        </button>

        {/* 🟢 슬쩍이 캐릭터 이미지 */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 left-0 z-0 transition-transform duration-550 ${
            isHovering ? 'translate-x-[25px]' : 'translate-x-0'
          } min-w-[40px] min-h-[40px]`}
        >
          <Image
            src="/seuljeossi_right.png"
            alt="슬저씨 오른쪽"
            width={48}
            height={48}
            unoptimized
          />
        </div>
      </div>
      
      {/* 오른쪽 캘린더 열기 버튼 */}

      {isCalendarButtonVisible && !isCalendarOpen && (
        <div className="fixed top-1/2 right-0 transform -translate-y-1/2">
          <button onClick={() => setCalendarOpen(true)} className="relative p-0 border-none bg-transparent w-[25px] h-[500px] cursor-pointer">
            <svg width="25" height="500" className="absolute top-0 left-0">
              <g transform="rotate(-90, 40, 250)">
                <polygon points="40,0 40,0 80,250 0,250" fill="#1E293B" />
              </g>
            </svg>
            <span className="relative text-white font-bold text-2xl">
              &lt;
            </span>
          </button>
        </div>
      )}

      {/* 사이드바 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 캘린더 오버레이 */}
      {isCalendarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleCloseCalendar}
        ></div>
      )}

      {/* 캘린더 사이드바 */}
      <CalendarSidebar isOpen={isCalendarOpen} onClose={handleCloseCalendar} />

      {/* 메인 콘텐츠 */}
      <main className="p-4 text-[#98c195]">
        <h1 className="text-2xl font-bold">Main Content</h1>
      </main>
    </div>
  );
}
