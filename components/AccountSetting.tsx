'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { HiPlus, HiChevronRight } from 'react-icons/hi2';

interface AccountData {
  name: string;
  dob: string;
  phone: string;
  address: string;
  email: string;
  profilePic: string;
}

export default function AccountSetting() {
  // 사진에 있는 초기 데이터 형식 반영
  const [data, setData] = useState<AccountData>({
    name: 'Hayden',
    dob: '2002.02.09',
    phone: 'Hayden',
    address: '4169 38TH ST, Sandi...',
    email: 'hwk004@ucsd.edu',
    profilePic: '/logo.png', 
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 로컬 스토리지에서 데이터 불러오기
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

  // Save 버튼 클릭 시 로컬 스토리지에 저장
  const handleSave = () => {
    localStorage.setItem('seulgeumoney_account_data', JSON.stringify(data));
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
    // ✨ 부모 컨테이너: flex와 h-full을 사용하여 화면 중앙에 배치하고 스크롤(overflow-hidden)을 막았습니다.
    <div className="flex h-[calc(100vh-120px)] w-full items-center justify-center overflow-hidden">
      
      {/* 🟢 중앙 단일 박스 (사진과 동일한 레이아웃) */}
      <div className="w-full max-w-[650px] rounded-[24px] bg-white px-10 py-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        
        {/* 타이틀 */}
        <h2 className="mb-10 text-center text-[18px] font-medium text-[#649566]">
          Account Setting
        </h2>

        {/* 프로필 사진 영역 */}
        <div className="relative mx-auto mb-10 h-[90px] w-[90px]">
          <div 
            className="h-full w-full cursor-pointer overflow-hidden rounded-full border border-slate-100 bg-slate-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image 
              src={data.profilePic} 
              alt="Profile" 
              fill 
              className="object-cover" 
              unoptimized 
            />
          </div>
          
          {/* 사진 속 우측 하단 플러스(+) 아이콘 */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 flex h-6 w-6 translate-x-1 translate-y-1 items-center justify-center rounded-full border border-slate-200 bg-white text-[#649566] transition-colors hover:bg-slate-50 cursor-pointer"
          >
            <HiPlus size={14} strokeWidth={1} />
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* 개인 정보 목록 (사진 속 글자색상과 화살표 디자인 완벽 복제) */}
        <div className="mb-10 flex flex-col gap-5 px-4">
          {[
            { label: 'Name:', key: 'name', type: 'text' },
            { label: 'Birth of Date:', key: 'dob', type: 'text' },
            { label: 'Phone:', key: 'phone', type: 'text' },
            { label: 'Home Address:', key: 'address', type: 'text' },
            { label: 'Email:', key: 'email', type: 'text' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between text-[15px] text-[#649566]">
              <span>{item.label}</span>
              
              <div className="flex items-center gap-2">
                {/* ✨ 입력창이지만 테두리를 없애고 투명하게 만들어서 
                  사진 속 정적인 텍스트처럼 보이게 하면서도 클릭해서 수정이 가능하도록 구현했습니다. 
                */}
                <input
                  type={item.type}
                  value={data[item.key as keyof AccountData]}
                  onChange={(e) => handleChange(item.key as keyof AccountData, e.target.value)}
                  className="w-[220px] bg-transparent text-right outline-none placeholder-[#649566]/50"
                />
                <HiChevronRight size={16} strokeWidth={1} className="text-[#649566]" />
              </div>
            </div>
          ))}
        </div>

        {/* 중앙 하단 Save 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="rounded-lg bg-[#649566] px-8 py-1.5 text-[14px] font-medium text-white transition-colors hover:bg-[#527a54] active:scale-95 cursor-pointer"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}