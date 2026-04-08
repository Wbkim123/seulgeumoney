'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { HiCamera, HiCalendarDays } from 'react-icons/hi2';

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
    name: 'Seulgee-jjeossi',
    dob: '1987-05-15',
    phone: '+82 10-1234-5678',
    address: 'Seoul, Republic of Korea',
    email: 'money.uncle@email.com',
    profilePic: '/seuljeossi.png',
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

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
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('seulgeumoney_account_data', JSON.stringify(data));
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    const saved = localStorage.getItem('seulgeumoney_account_data');
    if (saved) setData(JSON.parse(saved));
    alert('Changes discarded.');
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

  const openDatePicker = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (e) {
        dateInputRef.current.focus();
      }
    }
  };

  if (!isLoaded) return null;

  return (
    // ✨ 박스를 화면 상단으로 올리고 전체 스크롤 원천 차단
    <div className="flex h-[calc(100vh-140px)] w-full items-start justify-center overflow-hidden pt-2 sm:pt-4">
      
      {/* 전체 높이를 더 줄임 (p-8 -> p-6, gap-y-6 -> gap-y-4) */}
      <div className="w-full max-w-[660px] rounded-[32px] border border-white bg-white/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.14)] animate-fade-in flex flex-col">
        
        {/* Title Area (간격 더 축소) */}
        <div className="mb-4">
          <h1 className="text-[22px] font-bold text-slate-800 tracking-tight leading-none">Personal Info</h1>
          <p className="mt-1 text-[12px] font-medium text-slate-400">
            View and update your personal details
          </p>
        </div>

        {/* Profile Section (콤팩트화) */}
        <div className="mb-6 flex items-center gap-4">
          <div 
            className="group relative h-14 w-14 cursor-pointer overflow-hidden rounded-full border-2 border-white shadow-sm ring-4 ring-slate-50 transition-all hover:ring-[#649566]/20"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image 
              src={data.profilePic} 
              alt="Profile" 
              fill 
              className="object-cover" 
              unoptimized 
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <HiCamera size={18} className="text-white" />
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
            <h3 className="text-[16px] font-bold text-slate-800 leading-tight">{data.name}</h3>
            <span className="text-[11px] font-extrabold text-[#649566]">Verified Profile</span>
          </div>
        </div>

        {/* Form Fields (gap-y-3으로 더 축소, py-2.5로 입력창 높이 축소) */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 ml-1">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-xl bg-[#f8fafb] px-4 py-2.5 text-[13px] font-semibold text-slate-700 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-[#649566]/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 ml-1">Date of Birth</label>
            <div className="relative group">
              <input
                type="date"
                ref={dateInputRef}
                value={data.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full cursor-pointer rounded-xl bg-[#f8fafb] px-4 py-2.5 text-[13px] font-semibold text-slate-700 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-[#649566]/20 focus:bg-white transition-all [appearance:none] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:bg-transparent [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
              <HiCalendarDays size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#649566] pointer-events-none transition-colors" />
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 ml-1">Phone Number</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full rounded-xl bg-[#f8fafb] px-4 py-2.5 text-[13px] font-semibold text-slate-700 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-[#649566]/20 focus:bg-white transition-all"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 ml-1">Home Address</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full rounded-xl bg-[#f8fafb] px-4 py-2.5 text-[13px] font-semibold text-slate-700 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-[#649566]/20 focus:bg-white transition-all"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 ml-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-xl bg-[#f8fafb] px-4 py-2.5 text-[13px] font-semibold text-slate-700 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-[#649566]/20 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Buttons Section (상단 마진 및 패딩 축소) */}
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-50 pt-5">
          <button 
            onClick={handleCancel}
            className="rounded-xl px-5 py-2 text-[12px] font-bold text-slate-400 hover:bg-black/5 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="rounded-xl bg-[#649566] px-8 py-2 text-[12px] font-bold text-white shadow-xl shadow-[#649566]/20 hover:bg-[#527a54] hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
