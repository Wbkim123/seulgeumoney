'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HiCamera } from 'react-icons/hi2';
import Image from 'next/image';

interface AccountData {
  name: string;
  dob: string;
  phone: string;
  address: string;
  email: string;
  profilePic: string;
}

export default function AccountSetting() {
  // 1. 기존에 작성하신 데이터 관리 로직 유지
  const [data, setData] = useState<AccountData>({
    name: 'username_87',
    dob: '1987-05-15',
    phone: '010-1234-5678',
    address: 'Seoul, Republic of Korea',
    email: 'money.uncle@email.com',
    profilePic: '/logo.png', // 기본값
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 왼쪽 사이드바 활성화 탭 상태 관리
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    const saved = localStorage.getItem('seulgeumoney_account_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse account data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleChange = (field: keyof AccountData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    localStorage.setItem('seulgeumoney_account_data', JSON.stringify(newData));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('profilePic', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isLoaded) return null;

  return (
    // 사진과 동일한 전체 페이지 레이아웃 (좌측 메뉴, 우측 상세 정보)
    <div className="flex h-full w-full gap-8 p-8 md:p-10 pb-0">
      
      {/* 🟢 왼쪽: 설정 카테고리 사이드바 */}
      <aside className="w-[280px] shrink-0 rounded-[32px] bg-white px-6 py-10 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <h2 className="mb-8 px-4 text-[13px] font-extrabold text-[#649566] tracking-wider">
          ACCOUNT SETTING
        </h2>
        
        <nav className="flex flex-col gap-2">
          {[
            { id: 'account', label: 'Account Settings' },
            { id: 'security', label: 'Security' },
            { id: 'payment', label: 'Payment Methods' },
            { id: 'notification', label: 'Notification Setting' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-[14px] font-bold transition-colors ${
                  isActive 
                    ? 'bg-slate-50 text-[#649566]' 
                    : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[#649566]' : 'bg-transparent'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 🟢 오른쪽: Personal Info 상세 영역 */}
      <main className="flex-1 rounded-[32px] bg-white p-10 md:p-12 shadow-[0_18px_50px_rgba(0,0,0,0.06)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
        
        {/* 상단 타이틀 */}
        <div className="mb-10">
          <h1 className="text-[28px] font-bold text-slate-800">Personal Info</h1>
          <p className="mt-1 text-[14px] font-medium text-slate-400">
            View and update your personal details
          </p>
        </div>

        {/* 프로필 사진 및 이름 영역 (기존 사진 변경 로직 결합) */}
        <div className="mb-10 flex items-center gap-6">
          <div 
            className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-slate-50 shadow-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image 
              src={data.profilePic} 
              alt="Profile" 
              fill 
              className="object-cover" 
              unoptimized 
            />
            {/* 호버 시 연필/카메라 아이콘 표시 */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <HiCamera size={26} className="text-white" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />

          <div className="flex flex-col">
            <h3 className="text-[20px] font-bold text-slate-800">{data.name || 'User Name'}</h3>
            <p className="text-[14px] font-semibold text-[#649566]">Level: Master Savor</p>
          </div>
        </div>

        {/* 폼 입력 영역 (사진 레이아웃 반영: Name, DOB는 한 줄에 배치) */}
        <div className="flex max-w-[600px] flex-col gap-6">
          
          {/* 첫 번째 줄: Name & DOB */}
          <div className="flex gap-6">
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-500">Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Name"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-[14px] font-medium text-slate-700 outline-none transition-all focus:border-[#649566] focus:bg-white focus:ring-1 focus:ring-[#649566]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-[13px] font-bold text-slate-500">Date of Birth</label>
              <input
                type="date"
                value={data.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-[14px] font-medium text-slate-700 outline-none transition-all focus:border-[#649566] focus:bg-white focus:ring-1 focus:ring-[#649566]"
              />
            </div>
          </div>

          {/* 두 번째 줄: Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-500">Phone Number</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Phone Number"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-[14px] font-medium text-slate-700 outline-none transition-all focus:border-[#649566] focus:bg-white focus:ring-1 focus:ring-[#649566]"
            />
          </div>

          {/* 세 번째 줄: Home Address */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-500">Home Address</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Home Address"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-[14px] font-medium text-slate-700 outline-none transition-all focus:border-[#649566] focus:bg-white focus:ring-1 focus:ring-[#649566]"
            />
          </div>

          {/* 네 번째 줄: Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-slate-500">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-[14px] font-medium text-slate-700 outline-none transition-all focus:border-[#649566] focus:bg-white focus:ring-1 focus:ring-[#649566]"
            />
          </div>

        </div>ㄴ

      </main>
    </div>
  );
}