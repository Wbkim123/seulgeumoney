'use client';

import React, { useState, useEffect } from 'react';
import { HiCamera, HiPencilSquare } from 'react-icons/hi2';

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
    address: 'Seoul, South Korea',
    email: 'user@example.com',
    profilePic: '/logo.png', // 기본값
  });

  const [isLoaded, setIsLoaded] = useState(false);

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
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto animate-fade-in py-10 px-6">
      <h1 className="text-[32px] font-bold text-[#649566] mb-12">Account Setting</h1>

      {/* Profile Picture Section */}
      <div className="relative mb-12 group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-[#649566]/20 bg-slate-50 flex items-center justify-center">
          <img 
            src={data.profilePic} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <label className="absolute bottom-0 right-0 p-2 bg-[#649566] text-white rounded-full shadow-md cursor-pointer hover:bg-[#527a54] transition-colors">
          <HiCamera size={20} />
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>

      {/* Input Fields */}
      <div className="w-full space-y-6">
        {[
          { label: 'Name', key: 'name', type: 'text' },
          { label: 'Date of Birth (BOD)', key: 'dob', type: 'date' },
          { label: 'Phone Num', key: 'phone', type: 'tel' },
          { label: 'Home Address', key: 'address', type: 'text' },
          { label: 'Email', key: 'email', type: 'email' },
        ].map((item) => (
          <div key={item.key} className="flex flex-col space-y-2">
            <label className="text-[14px] font-bold text-slate-500 ml-1">{item.label}</label>
            <div className="relative">
              <input
                type={item.type}
                value={data[item.key as keyof AccountData]}
                onChange={(e) => handleChange(item.key as keyof AccountData, e.target.value)}
                className="w-full bg-white rounded-2xl px-5 py-4 text-[15px] font-medium text-slate-700 shadow-sm ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-[#649566]/30 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                <HiPencilSquare size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center text-slate-400 text-[13px] font-medium">
        All changes are automatically saved to your local storage.
      </div>
    </div>
  );
}
