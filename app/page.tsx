'use client';

import { useState } from 'react';
import Sidebar from '../components/sidebar';
import { HiOutlineBars3 } from 'react-icons/hi2';
import Image from 'next/image';

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false); // 마우스 호버 상태

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
          className="relative z-10 p-2 text-white bg-gray-800 rounded hover:bg-gray-700"
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

      {/* 사이드바 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 메인 콘텐츠 */}
      <main className="p-4 text-[#98c195]">
        <h1 className="text-2xl font-bold">Main Content</h1>
      </main>
    </div>
  );
}
