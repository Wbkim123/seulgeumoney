'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonalInfoPage() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [country, setCountry] = useState('us');
  const [phoneLocal, setPhoneLocal] = useState('');
  const router = useRouter();

  const countryDialCodes: { [key: string]: string } = {
    us: '+1',
    kr: '+82',
  };

  const formatPhoneNumber = (country: string, number: string) => {
    if (country === 'kr') {
      if (number.length <= 3) return number;
      if (number.length <= 7) return `${number.slice(0,3)}-${number.slice(3)}`;
      return `${number.slice(0,3)}-${number.slice(3,7)}-${number.slice(7,11)}`;
    } else if (country === 'us') {
      if (number.length <= 3) return number;
      if (number.length <= 6) return `(${number.slice(0,3)}) ${number.slice(3)}`;
      return `(${number.slice(0,3)}) ${number.slice(3,6)}-${number.slice(6,10)}`;
    }
    return number;
  };

  // ✅ 모든 필드가 채워져야 활성화
  const isFormValid = name && birthDate && country && phoneLocal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const fullPhone = `${countryDialCodes[country]} ${phoneLocal}`;
      console.log('Name:', name);
      console.log('Birth of date:', birthDate);
      console.log('Country:', country);
      console.log('Phone number:', fullPhone);

      // ✅ 다음 단계로 이동
      router.push('/register/success');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">
      <div className="w-full max-w-sm p-6 border border-border-custom/50 rounded-lg shadow-md bg-surface">

        <h2 className="text-2xl font-semibold text-center mb-4 text-text-main">
          Personal Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-main mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border-custom/50 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-border-custom/10 text-text-main placeholder-text-muted bg-transparent"
              placeholder="Your name"
              required
            />
          </div>

          {/* Birth of date */}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-text-main mb-1">
              Birth of date
            </label>
            <input
              type="date"
              id="birthDate"
              lang="en"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full border border-border-custom/50 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-border-custom/10 text-text-main bg-transparent"
              required
            />
          </div>

          {/* Country selector */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-text-main mb-1">
              Country of residence
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setPhoneLocal(''); // 나라 바꾸면 번호 초기화
              }}
              className="w-full border border-border-custom/50 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-border-custom/10 text-text-main bg-transparent"
              required
            >
              <option value="us" className="bg-surface">United States (+1)</option>
              <option value="kr" className="bg-surface">Korea (+82)</option>
            </select>
          </div>

          {/* Phone number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-main mb-1">
              Phone number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-border-custom/50 rounded-l-md bg-surface-alt text-text-muted">
                {countryDialCodes[country]}
              </span>
              <input
                type="tel"
                id="phone"
                value={formatPhoneNumber(country, phoneLocal)}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  setPhoneLocal(cleaned);
                }}
                inputMode="numeric"
                className="w-full border border-border-custom/50 rounded-r-md p-2 focus:outline-none focus:ring-2 focus:ring-border-custom/10 text-text-main placeholder-text-muted bg-transparent"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full font-semibold py-2 rounded-md transition ${
              isFormValid
                ? 'bg-primary-light hover:bg-primary text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
