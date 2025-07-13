// components/Sidebar.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col justify-between`} // ✅ 전체 영역을 위아래로 분할
    >
      {/* 상단: 로고 + 메뉴 */}
      <div>
        <div className="p-4 flex justify-between items-center border-b">
          <Link href="/" onClick={onClose} className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="슬그머니 로고"
              width={60}
              height={60}
            />
          </Link>
          <button onClick={onClose} className="text-[#98c195] hover:text-[#649566] text-2xl">
            &times;
          </button>
        </div>

        <ul className="p-4 space-y-3">
          <li className="text-[#98c195] hover:text-[#649566] cursor-pointer">Spending</li>
          <li className="text-[#98c195] hover:text-[#649566] cursor-pointer">Report</li>
          <li className="text-[#98c195] hover:text-[#649566] cursor-pointer">Goals</li>
          <li className="text-[#98c195] hover:text-[#649566] cursor-pointer">App Settings</li>
          <li className="text-[#98c195] hover:text-[#649566] cursor-pointer">Account Settings</li>
        </ul>
      </div>

      {/* 하단: 고정된 계정 영역 */}
      <div className="p-4 border-t space-y-3">
        <li className="text-[#98c195] hover:text-[#649566] cursor-pointer list-none">Logout</li>
      </div>
    </div>
  );
};


export default Sidebar;
