'use client';

import React, { useState } from 'react';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import Image from 'next/image';

// ✨ 데이터 인터페이스 정의 (아이콘/도트/로고 데이터를 위한 필드 추가)
interface AccountItem {
  id: number;
  name: string;
  amount: string; // 이미지처럼 포맷팅된 문자열로 저장
  dotColor?: string; // Income/Outcome용 캘린더 도트 색상
  emoji?: string; // Goals용 이모지
  bankLogo?: string; // Bank용 (이미지 경로)
}

// ✨ 이미지와 동일하게 Mock 데이터 업데이트
const initialIncome: AccountItem[] = [
  { id: 1, name: '슬금 통장', amount: '$ 1,200,000', dotColor: 'bg-[#649566]' }, // 초록 도트
];

const initialOutcome: AccountItem[] = [
  { id: 1, name: '신한 카드', amount: '$ 800,000', dotColor: 'bg-[#ee5253]' }, // 빨강 도트
  { id: 2, name: '현대 카드', amount: '$ 1,500,000', dotColor: 'bg-[#ee5253]' }, // 빨강 도트
  { id: 3, name: '삼성 카드', amount: '$ 500,000', dotColor: 'bg-[#ee5253]' }, // 빨강 도트
];

const initialGoals: AccountItem[] = [
  { id: 1, name: '저축', amount: '$ 5,000,000', emoji: '🐷' }, // 돼지 저금통 이모지
  { id: 2, name: '주식', amount: '$ 2,000,000', emoji: '📈' }, // 차트 이모지
];

const initialBank: AccountItem[] = [
  // ✨ 실제 카드사 로고 이미지 파일이 public/logos 폴더에 있어야 합니다.
  { id: 1, name: '슬금 통장', amount: '$ 1,200,000', bankLogo: '/logos/shinhan.png' }, 
  { id: 2, name: '세금 통장', amount: '$ 6,000,000', bankLogo: '/logos/hyundai.png' }, 
  { id: 3, name: '사업 통장', amount: '$ 80,000,000', bankLogo: '/logos/samsung.png' }, 
];

export default function AccountSetting() {
  const [incomeItems, setIncomeItems] = useState<AccountItem[]>(initialIncome);
  const [outcomeItems, setOutcomeItems] = useState<AccountItem[]>(initialOutcome);
  const [goalsItems, setGoalsItems] = useState<AccountItem[]>(initialGoals);
  const [bankItems, setBankItems] = useState<AccountItem[]>(initialBank);

  const handleDelete = (category: string, id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    switch (category) {
      case 'Income': setIncomeItems(prev => prev.filter(item => item.id !== id)); break;
      case 'Outcome': setOutcomeItems(prev => prev.filter(item => item.id !== id)); break;
      case 'Goals': setGoalsItems(prev => prev.filter(item => item.id !== id)); break;
      case 'Bank': setBankItems(prev => prev.filter(item => item.id !== id)); break;
    }
  };

  // ✨ 섹션 렌더링 함수 수정
  const renderSectionItems = (category: string, items: AccountItem[]) => (
    <section className="mb-8">
      {/* ✨ 섹션 타이틀 스타일 수정: 회색 볼드 작은 글씨 */}
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {category}
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          /* ✨ 항목 카드 스타일 전면 수정: 흰색 둥근 테두리, 내부 패딩 충분히 */
          <article
            key={item.id}
            className="flex items-center justify-between rounded-full bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            {/* 왼쪽: 아이콘 + 이름 영역 (플렉스 배치) */}
            <div className="flex items-center gap-4">
              
              {/* ✨ 아이콘 렌더링 로직 (Bank, Goals, Dot 분기) */}
              {category === 'Bank' && item.bankLogo && (
                <div className="relative h-8 w-8 overflow-hidden rounded-full border ring-1 ring-black/5 shrink-0">
                  <Image src={item.bankLogo} alt={item.name} fill className="object-cover" />
                </div>
              )}
              {category === 'Goals' && item.emoji && (
                <span className="text-2xl shrink-0">{item.emoji}</span>
              )}
              {(category === 'Income' || category === 'Outcome') && item.dotColor && (
                <div className={`h-2.5 w-2.5 rounded-full ${item.dotColor} shrink-0`} />
              )}
              
              {/* ✨ 이름 스타일 수정: 볼드체 어두운 회색 */}
              <span className="text-[15px] font-bold text-slate-800">
                {item.name}
              </span>
            </div>

            {/* 오른쪽: 금액 + 버튼 영역 (플렉스 배치) */}
            <div className="flex items-center gap-4">
              {/* ✨ 금액 스타일 수정: 볼드체 어두운 회색 */}
              <span className="text-[15px] font-bold text-slate-800">
                {item.amount}
              </span>
              
              {/* ✨ 버튼 영역 및 아이콘 색상 수정: 연한 회색 아이콘 */}
              <div className="flex items-center gap-1 text-slate-300">
                <button className="rounded-full p-2 hover:bg-slate-100 hover:text-[#649566] cursor-pointer transition">
                  <HiOutlinePencilSquare size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(category, item.id)}
                  className="rounded-full p-2 hover:bg-slate-100 hover:text-[#ee5253] cursor-pointer transition"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    // ✨ 전체 배경색 (`f8f9fc`) 및 레이아웃 수정
    <div className="min-h-screen w-full bg-[#f8f9fc] p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        {/* ✨ 사용자 이름 타이틀 추가: 볼드체 큰 글씨 */}
        <h1 className="mb-10 text-[24px] font-bold text-slate-900">슬금</h1>

        {/* ✨ 섹션 렌더링 호출 */}
        {renderSectionItems('Income', incomeItems)}
        {renderSectionItems('Outcome', outcomeItems)}
        {renderSectionItems('Goals', goalsItems)}
        {renderSectionItems('Bank', bankItems)}
      </div>
    </div>
  );
}