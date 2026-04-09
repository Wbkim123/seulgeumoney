'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { HiCamera, HiCalendarDays, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

interface AccountData {
  name: string;
  dob: string;
  phone: string;
  address: string;
  email: string;
  profilePic: string;
}

interface AccountSettingProps {
  onClose: () => void;
}

export default function AccountSetting({ onClose }: AccountSettingProps) {
  const [initialData, setInitialData] = useState<AccountData | null>(null);
  const [data, setData] = useState<AccountData>({
    name: 'Seulgee-jjeossi',
    dob: '1987-05-15',
    phone: '+82 10-1234-5678',
    address: 'Seoul, Republic of Korea',
    email: 'money.uncle@email.com',
    profilePic: '/seuljeossi.png',
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('seulgeumoney_account_data');
    let baseData = data;
    if (saved) {
      try {
        baseData = JSON.parse(saved);
        setData(baseData);
      } catch (e) {
        console.error('Failed to parse account data', e);
      }
    }
    setInitialData(baseData);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  const handleChange = (field: keyof AccountData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(data) : false;

  const handleCloseAttempt = () => {
    if (!isDirty) {
      onClose();
    } else {
      const leave = window.confirm(
        "You have unsaved changes. Do you want to leave without saving? \n\nClick 'OK' to Discard, or 'Cancel' to Keep Editing."
      );
      if (leave) onClose();
    }
  };

  useEffect(() => {
    const handleEvent = () => handleCloseAttempt();
    window.addEventListener('accountSettingCloseAttempt', handleEvent);
    return () => window.removeEventListener('accountSettingCloseAttempt', handleEvent);
  }, [isDirty, initialData, data]);

  const handleSave = () => {
    localStorage.setItem('seulgeumoney_account_data', JSON.stringify(data));
    setInitialData(data);
    alert('Changes saved successfully!');
    onClose();
  };

  const handleCancel = () => {
    handleCloseAttempt();
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

  const [viewDate, setViewDate] = useState(new Date(data.dob || '1987-05-15'));
  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const handleMonthChange = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const handleYearChange = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
  };

  const selectDate = (day: number) => {
    const y = viewDate.getFullYear();
    const m = String(viewDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const newDob = `${y}-${m}-${d}`;
    handleChange('dob', newDob);
    setShowDatePicker(false);
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  if (!isLoaded) return null;

  // 💡 [수정 포인트 1] 입력창 내부 위아래 여백(Padding)을 py-3에서 py-2.5로 살짝 줄임
  const inputStyles = "w-full rounded-2xl bg-[#f8fafb] px-5 py-2.5 text-[14px] font-semibold text-slate-700 outline-none ring-1 ring-black/5 border border-transparent focus:border-[#649566] focus:bg-white transition-all";

  return (
    <div className="flex min-h-[calc(100vh-140px)] w-full items-start justify-center px-6 pt-2 pb-10">
      {/* 💡 [수정 포인트 2] 박스의 상하 여백을 p-10에서 px-10 py-7 로 변경하여 위아래 길이를 줄임 */}
      <div className="w-full max-w-[720px] rounded-[40px] border border-white bg-white/95 px-10 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.12)] animate-fade-in flex flex-col relative z-10">
        
        {/* 💡 [수정 포인트 3] 타이틀과 프로필 사진 사이 여백(mb-6)을 mb-4로 줄임 */}
        <div className="mb-4 flex flex-col gap-1">
          <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Personal Info</h1>
          <p className="text-[13px] font-medium text-slate-400">View and update your personal details</p>
        </div>

        {/* 💡 [수정 포인트 4] 프로필 사진과 폼 사이의 여백(mb-8)을 mb-5로 줄임 */}
        <div className="mb-5 flex items-center gap-8">
          <div 
            className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-white shadow-md ring-4 ring-slate-50 transition-all hover:ring-[#649566]/20"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image src={data.profilePic} alt="Profile" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <HiCamera size={28} className="text-white" />
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          <div className="flex flex-col">
            <h3 className="text-[22px] font-bold text-slate-800 leading-tight">{data.name}</h3>
            <span className="text-[14px] font-extrabold text-[#649566]">Verified Account</span>
          </div>
        </div>

        {/* 💡 [수정 포인트 5] 인풋 박스들 사이의 상하 간격(gap-y-4)을 gap-y-3으로 줄임 */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <div className="group flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 ml-1 group-focus-within:text-[#649566] transition-colors">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="group flex flex-col gap-1.5 relative">
            <label className={`text-[12px] font-bold ml-1 transition-colors ${showDatePicker ? 'text-[#649566]' : 'text-slate-500 group-focus-within:text-[#649566]'}`}>
              Date of Birth
            </label>
            <div 
              className="relative group cursor-pointer"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <div className={`${inputStyles} flex items-center ${showDatePicker ? 'border-[#649566] bg-white ring-1 ring-[#649566]' : ''}`}>
                {data.dob || "Select Date"}
              </div>
              <HiCalendarDays size={20} className={`absolute right-5 top-1/2 -translate-y-1/2 transition-colors ${showDatePicker ? 'text-[#649566]' : 'text-slate-400 group-hover:text-[#649566]'}`} />
            </div>

            {showDatePicker && (
              <div 
                ref={datePickerRef}
                className="absolute top-full mt-2 left-0 z-50 w-[300px] bg-white rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.15)] ring-1 ring-black/5 p-5 animate-fade-in"
              >
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><HiChevronLeft size={20} className="text-[#649566]" /></button>
                  <div className="flex flex-col items-center">
                    <span className="text-[14px] font-bold text-slate-800">{monthNames[currentMonth]}</span>
                    <select 
                      value={currentYear} 
                      onChange={(e) => handleYearChange(parseInt(e.target.value))}
                      className="text-[12px] font-bold text-[#649566] bg-transparent outline-none cursor-pointer"
                    >
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><HiChevronRight size={20} className="text-[#649566]" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[10px] font-extrabold text-slate-300">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: firstDayOfMonth(currentYear, currentMonth) }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth(currentYear, currentMonth) }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = data.dob === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    return (
                      <button 
                        key={day}
                        onClick={() => selectDate(day)}
                        className={`aspect-square flex items-center justify-center rounded-xl text-[13px] font-bold transition-all ${isSelected ? 'bg-[#649566] text-white shadow-md' : 'hover:bg-[#649566]/10 text-slate-600'}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="group col-span-2 flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 ml-1 group-focus-within:text-[#649566] transition-colors">Phone Number</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="group col-span-2 flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 ml-1 group-focus-within:text-[#649566] transition-colors">Home Address</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className={inputStyles}
            />
          </div>

          <div className="group col-span-2 flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-slate-500 ml-1 group-focus-within:text-[#649566] transition-colors">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>

        {/* 💡 [수정 포인트 6] 하단 버튼 영역의 위쪽 여백(mt-8)과 선 안쪽 패딩(pt-6)을 mt-5, pt-4로 대폭 줄임 */}
        <div className="mt-5 flex justify-end gap-3 border-t border-slate-50 pt-4">
          <button onClick={handleCancel} className="rounded-xl px-6 py-2.5 text-[13px] font-bold text-slate-400 hover:bg-black/5 transition-colors cursor-pointer">Cancel</button>
          <button onClick={handleSave} className="rounded-xl bg-[#649566] px-10 py-2.5 text-[13px] font-bold text-white shadow-xl shadow-[#649566]/20 hover:bg-[#527a54] hover:-translate-y-0.5 transition-all cursor-pointer">Save Changes</button>
        </div>
      </div>
    </div>
  );
}