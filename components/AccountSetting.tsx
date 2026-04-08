'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { HiCamera } from 'react-icons/hi2';

interface AccountData {
  name: string;
  dob: string;
  phone: string;
  address: string;
  email: string;
  profilePic: string;
}

export default function AccountSetting() {
  const [data, setData] = useState<AccountData>({
    name: 'User Name',
    dob: '1995-01-01',
    phone: '010-1234-5678',
    address: 'Seoul, Republic of Korea',
    email: 'user@example.com',
    profilePic: '/logo.png', // 기본 슬저씨/돈뭉치 이미지
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 로컬 스토리지에서 기존 데이터 불러오기
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

  // 값이 입력될 때마다 State 업데이트 및 로컬 스토리지에 자동 저장
  const handleChange = (field: keyof AccountData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    localStorage.setItem('seulgeumoney_account_data', JSON.stringify(newData));
  };

  // 프로필 사진 변경 로직
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
    // ✨ 화면 중앙 고정 및 전체 스크롤 방지
    <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center overflow-hidden">
      
      {/* 🟢 사진과 완벽히 동일한 메인 박스 레이아웃 */}
      <div className="w-full max-w-[700px] rounded-[32px] bg-white p-10 md:p-12 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        
        {/* 상단 타이틀 영역 */}
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#2d3748]">Personal Info</h1>
          <p className="mt-1 text-[14px] font-medium text-[#718096]">
            View and update your personal details
          </p>
        </div>

        {/* 프로필 사진 및 닉네임/레벨 영역 */}
        <div className="mb-10 flex items-center gap-6">
          <div 
            className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border-2 border-slate-50 shadow-sm ring-4 ring-slate-50/50 transition-all hover:ring-slate-100"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image 
              src={data.profilePic} 
              alt="Profile" 
              fill 
              className="object-cover" 
              unoptimized 
            />
            {/* 사진 변경을 위한 호버 오버레이 */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <HiCamera size={24} className="text-white" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />

          <div className="flex flex-col gap-0.5">
            <h3 className="text-[20px] font-bold text-[#2d3748]">{data.name || 'User Name'}</h3>
            <p className="text-[14px] font-bold text-[#649566]">Level: Master Savor</p>
          </div>
        </div>

        {/* 폼 입력 영역 */}
        <div className="flex flex-col gap-6">
          
          {/* 첫 번째 줄: Name & Date of Birth (2단 구성) */}
          <div className="flex gap-6">
            <div className="flex flex-1 flex-col gap-2.5">
              <label className="text-[13px] font-bold text-[#718096]">Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="User Name"
                className="w-full rounded-2xl border border-transparent bg-[#f7fafc] px-5 py-4 text-[14px] font-medium text-[#2d3748] outline-none transition-all focus:border-[#649566] focus:bg-white focus:ring-1 focus:ring-[#649566]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              <label className="text-[13px] font-bold text-[#718096]">Date of Birth</label>
              <input
                type="date"
                value={data.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full rounded-2xl border border-transparent bg-[#f7fafc] px-5 py-4 text-[14px] font-medium text-[#2d3748] outline-none transition-all focus:border-[#649566] focus:bg-white focus:ring-1 focus:ring-[#649566]"
              />
            </div>
          </div>

          {/* 두 번째 줄: Phone Number */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-bold text-[#718096]">Phone Number</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Phone Number"
              className="w-full rounded-2xl border border-transparent bg-[#f7fafc] px-5 py-4 text-[14px] font-medium text-[#2d3748] outline-none transition-all focus:border-[#649566] focus:bg-white focus:ring-1 focus:ring-[#649566]"
            />
          </div>

          {/* 세 번째 줄: Home Address */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-bold text-[#718096]">Home Address</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Home Address"
              className="w-full rounded-2xl border border-transparent bg-[#f7fafc] px-5 py-4 text-[14px] font-medium text-[#2d3748] outline-none transition-all focus:border-[#649566] focus:bg-white focus:ring-1 focus:ring-[#649566]"
            />
          </div>

          {/* 네 번째 줄: Email */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-bold text-[#718096]">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="user@example.com"
              className="w-full rounded-2xl border border-transparent bg-[#f7fafc] px-5 py-4 text-[14px] font-medium text-[#2d3748] outline-none transition-all focus:border-[#649566] focus:bg-white focus:ring-1 focus:ring-[#649566]"
            />
          </div>

        </div>

      </div>
    </div>
  );
}