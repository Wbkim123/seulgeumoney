'use client';

import React, { useState, useEffect } from 'react';

interface SideCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


const SideCalendar: React.FC<SideCalendarProps> = ({ isOpen, onClose }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: number; year: number } | null>({
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear()
  });

  useEffect(() => {
    if (isOpen) {
      setCurrentDate(today);
      setSelectedDate({
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear()
      });
    }
  }, [isOpen]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarCells = [];
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isFutureDate = (day: number) => {
    const dateToCheck = new Date(year, month, day);
    return dateToCheck > today;
  };

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(
      <span key={`empty-${i}`} className="text-gray-300">-</span>
    );
  }

  for (let i = 1; i <= lastDate; i++) {
    const isTodayCell =
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    
    const isSelected =
      selectedDate &&
      i === selectedDate.day &&
      month === selectedDate.month &&
      year === selectedDate.year;

    const future = isFutureDate(i);

    calendarCells.push(
      <button
        key={i}
        onClick={() => !future && setSelectedDate({ day: i, month: month, year: year })}
        disabled={future}
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isSelected
              ? 'bg-[#649566] text-white font-bold cursor-pointer'
              : isTodayCell
              ? 'border border-[#98c195] text-[#98c195] cursor-pointer'
              : future
              ? 'text-gray-300'
              : 'text-[#98c195] cursor-pointer'
        }`}
      >
        {i}
      </button>
    );
  }


  return (
    <div
      style={{
        right: isOpen ? '1.5rem' : '-21rem',
        top: '50%',
        transform: 'translateY(-50%)',
        transition: 'right 0.3s ease',
      }}
      className="fixed w-80 h-80 bg-white shadow-lg z-50 rounded-lg border flex flex-col"
    >
        {/* 상단 헤더 */}
        <div className="p-2 flex justify-between items-center border-b">
            <h2 className="text-[#98c195] font-bold text-lg">Calendar</h2>
            <button onClick={onClose} className="text-[#98c195] hover:text-[#649566] text-2xl cursor-pointer">
                &times;
            </button>
        </div>

        {/* 년도/월 + 양옆 화살표 */}
        <div className="flex justify-between items-center p-2 border-b">
            <button onClick={prevMonth} className="text-[#98c195] hover:text-[#649566] text-lg cursor-pointer">
                &lt;
            </button>
        <span className="text-[#98c195] font-semibold text-center">
            {monthNames[month]} {year}
        </span>
        <button onClick={nextMonth} className="text-[#98c195] hover:text-[#649566] text-lg cursor-pointer">
            &gt;
        </button>
    </div>

      {/* 캘린더 본문 */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1 p-2 text-xs">
        {days.map(day => (
          <div key={day} className="text-center font-bold text-[#98c195] flex items-center justify-center h-6">
            {day}
          </div>
        ))}
        {calendarCells.map((cell, index) => (
          <div key={index} className="flex items-center justify-center h-6">
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideCalendar;
