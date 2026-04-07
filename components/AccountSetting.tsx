'use client';

import React, { useState, useRef } from 'react';
import { HiPencil } from 'react-icons/hi2';

// ✨ 왼쪽 카테고리 메뉴 목록
const settingNavItems = [
  { label: 'Account Settings', id: 'account' },
  { label: 'Security', id: 'security' },
  { label: 'Payment Methods', id: 'payment' },
  { label: 'Notification Setting', id: 'notification' },
];

// ✨ Personal Info 입력 필드 데이터
const personalInfoFields = [
  { label: 'Name', id: 'name', value: 'Seulgee-jjeossi', type: 'text' },
  { label: 'Date of Birth', id: 'dob', value: '1987-05-15', type: 'date' },
  { label: 'Phone Number', id: 'phone', value: '+82 10-1234-5678', type: 'tel' },
  { label: 'Home Address', id: 'address', value: 'Seoul, Republic of Korea', type: 'text' },
  { label: 'Email', id: 'email', value: 'money.uncle@email.com', type: 'email' },
];

export default function AccountSetting() {
  const [activeSection, setActiveSection] = useState('account');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState('/seuljeossi.png'); 

  // 프로필 사진 변경 핸들러
  const handleEditPicClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    // 전체 레이아웃 (헤더 아래 전체 영역 차지)
    <div className="flex h-[calc(100vh-140px)] w-full gap-8 p-10 pb-0 animate-fade-in">
      
      {/* 🟢 1. 왼쪽: 설정 카테고리 목록 박스 */}
      <aside className="relative w-[300px] shrink-0 overflow-hidden rounded-[32px] border border-white bg-white/95 px-5 py-12 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
        <h2 className="mb-10 px-5 text-[15px] font-extrabold text-[#649566] tracking-wider">
          ACCOUNT SETTING
        </h2>
        
        <nav className="flex flex-col gap-1">
          {settingNavItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  flex items-center gap-3
                  rounded-2xl px-5 py-4
                  text-left text-[14px] font-semibold
                  transition duration-200
                  ${isActive 
                    ? 'text-[#649566] bg-black/5 shadow-inner' 
                    : 'text-slate-400 hover:bg-black/5 hover:text-[#649566]'
                  }
                `}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[#649566]' : 'bg-transparent'}`}/>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 🟢 2. 오른쪽: 실제 Personal Info 상세 화면 박스 */}
      <main className="flex-1 overflow-y-auto rounded-[32px] border border-white bg-white p-12 shadow-[0_18px_50px_rgba(0,0,0,0.12)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
        
        {/* Title Area */}
        <div className="mb-10 flex flex-col gap-1">
          <h1 className="text-[24px] font-bold text-slate-800">
            Personal Info
          </h1>
          <p className="text-[14px] font-medium text-slate-400">
            View and update your personal details
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="relative overflow-hidden rounded-full h-24 w-24 ring-4 ring-[#f0f5f0]">
              <img 
                src={profileImage} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] font-bold text-slate-800">Profile Picture</h3>
              <button 
                onClick={handleEditPicClick}
                className="flex items-center gap-2 text-[13px] font-extrabold text-[#649566] hover:text-[#527a54] transition-colors cursor-pointer"
              >
                <HiPencil size={14} />
                Edit Picture
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
          </div>

          {/* Input Fields Grid */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-8">
            {personalInfoFields.map((field) => (
              <div key={field.id} className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-400 ml-1">
                  {field.label}
                </label>
                <div className="relative group">
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full rounded-2xl bg-[#f8fafb] px-5 py-4 text-[14px] font-semibold text-slate-700 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-[#649566]/20 focus:bg-white transition-all"
                  />
                  <HiPencil size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#649566] transition-colors" />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4 border-t border-slate-50 pt-8">
             <button className="rounded-2xl px-6 py-3 text-[14px] font-bold text-slate-400 hover:bg-black/5 transition-colors cursor-pointer">
               Discard
             </button>
             <button className="rounded-2xl bg-[#649566] px-10 py-3 text-[14px] font-bold text-white shadow-xl shadow-[#649566]/20 hover:bg-[#527a54] hover:-translate-y-0.5 transition-all cursor-pointer">
               Save Changes
             </button>
          </div>
        </div>
      </main>
    </div>
  );
}
