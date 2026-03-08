'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  HiXMark,
  HiCurrencyDollar,
  HiChartBarSquare,
  HiFlag,
  HiCalendarDays,
  HiCog6Tooth,
} from 'react-icons/hi2';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Spending', href: '/spending', icon: HiCurrencyDollar },
  { label: 'Report', href: '/report', icon: HiChartBarSquare },
  { label: 'Goals', href: '/goals', icon: HiFlag },
  { label: 'Calender', href: '/calendar', icon: HiCalendarDays }, // (사진 표기 그대로 Calender)
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      className={[
        'fixed z-50',
        'left-6 top-6 bottom-6 w-[260px]',
        'rounded-2xl',
        // ✅ 투명도: 너무 비치면 /95 또는 그냥 bg-white 추천
        'bg-white/95 backdrop-blur-md',
        'shadow-[0_18px_50px_rgba(0,0,0,0.14)]',
        'ring-1 ring-black/10',
        'transition-transform duration-300 ease-out',
        isOpen ? 'translate-x-0' : '-translate-x-[120%]',
      ].join(' ')}
      aria-hidden={!isOpen}
    >
      <div className="flex h-full flex-col">
        {/* Top: Logo + Close */}
        <div className="flex items-start justify-between px-5 py-4">
          <div className="relative h-14 w-14">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#649566] hover:bg-black/5 cursor-pointer"
            aria-label="Close sidebar"
          >
            <HiXMark size={20} />
          </button>
        </div>

        {/* ✅ Top Divider: nav와 동일한 기준(px-3 + mx-4)으로 맞추기 */}
        <div className="px-3">
          <div className="mx-4 h-px bg-black/10" />
        </div>

        {/* Menu */}
        <nav className="mt-0 px-3">
          <ul className="flex flex-col">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="
                      flex items-center gap-3
                      rounded-xl px-4 py-4
                      text-[#649566]
                      hover:bg-black/5
                      transition
                    "
                  >
                    <Icon size={18} className="text-[#649566]" />
                    <span className="text-[14px] tracking-tight">{item.label}</span>
                  </Link>

                  {/* ✅ row divider: 동일한 mx-4 */}
                  <div className="mx-4 h-px bg-black/10" />
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex-1" />

        {/* Bottom-left gear */}
        <div className="px-5 pb-5">
          <button
            className="
              inline-flex items-center justify-center
              rounded-full p-2
              text-[#649566]
              hover:bg-black/5
              transition
              cursor-pointer
            "
            aria-label="Settings"
          >
            <HiCog6Tooth size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}