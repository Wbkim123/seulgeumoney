'use client';

import React, { useState } from 'react';
import { HiXMark } from 'react-icons/hi2';

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

  if (!isOpen) return null;

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
            App Setting
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
                    {tab}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* 우측 컨텐츠 영역 (선택된 탭에 따라 내용이 바뀜) */}
          <main className="flex-1 p-8 overflow-y-auto">
            <h3 className="text-[20px] font-bold text-slate-800 mb-6">
              {activeTab} Settings
            </h3>
            
            <div className="text-[14px] text-slate-500">
              {/* 여기에 나중에 각 탭에 맞는 설정 폼들을 넣어주시면 됩니다. */}
              {activeTab} related settings will be displayed here.
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}