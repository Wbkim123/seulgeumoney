'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-[#171717] font-sans">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <Image src="/logo.jpg" alt="슬그머니 로고" width={50} height={50} />
          <span className="text-lg font-medium text-gray-800">Seulgeumoney</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 rounded text-gray-700 text-l font-medium hover:bg-gray-100 transition cursor-pointer"
          >
            Log in
          </button>

          <button 
            onClick={() => router.push('/auth/register')} // 회원가입이나 시작하기 페이지로 연결
            className="px-4 py-2 bg-[#649566] text-white rounded text-l font-medium hover:bg-[#4b7b52] transition cursor-pointer"
          >
            Start for Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center pt-43 px-6 space-y-20">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          Manage your spending <br />
          <span className="text-[#649566]">seulgeumoney (automatically)</span>
        </h1>

        <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
          "Seulgeumoney" is a word in Korean that means “naturally,” “unconsciously,” or “automatically.”
        </p>

        <button
          onClick={() => router.push('/auth/register')} // 회원가입이나 시작하기 페이지로 연결
          className="mt-8 px-6 py-3 bg-[#649566] text-white text-lg rounded hover:bg-[#4b7b52] transition cursor-pointer"
        >
          Start for Free
        </button>

        <Image src="/dashboard_sample.png" alt="앱 대시보드 샘플" width={800} height={400} className="mx-auto rounded shadow" />

        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Our app, Seulgeumoney, helps you build smarter financial habits naturally through automated expense tracking and insightful reports.
        </p>
      </section>

      {/* 기능 소개 */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-20">
        {[
          {
            title: 'Account Sync & Manual Input',
            desc: 'Seamlessly sync your transactions with banks, and easily record cash transactions manually.',
            img: '/feature_connect.png',
          },
          {
            title: 'Automatic Spending Categorization',
            desc: 'Our AI automatically categorizes your transactions and analyzes your spending patterns.',
            img: '/feature_category.png',
          },
          {
            title: 'Spending Reports & Insights',
            desc: 'Get daily, weekly, and monthly reports that give you a clear overview of your spending and help you manage your expenses.',
            img: '/feature_report.png',
          },
          {
            title: 'Calendar-Based Spending Tracker',
            desc: 'Visualize your daily spending with calendar integration for an intuitive tracking experience.',
            img: '/feature_calendar.png',
          },
          {
            title: 'Budget Planning & Alerts',
            desc: 'Set savings goals, manage your targets, and take on budgeting challenges. Get alerts when you exceed your budget by category or daily spending, so you can always stay on track.',
            img: '/feature_budget.png',
          },
          {
            title: 'Receipt Attachments & Scanning',
            desc: 'Attach receipts to your transactions for better tracking. You can also scan your receipts directly into the app for quick and easy record-keeping.',
            img: '/feature_receipt.png',
          },
        ].map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <Image src={feature.img} alt={feature.title} width={200} height={200} className="mb-4" />
            <h3 className="text-xl font-semibold text-[#649566] mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm max-w-xs">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* 가치 제안 */}
      <section className="bg-gray-50 py-16 text-center px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          <span className="text-[#649566]">Seulgeumoney</span> is Your Partner to Help Saving Time
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Beyond a simple budgeting app, Seulgeumoney supports your financial management with automated expense tracking and intuitive insights.
        </p>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-400 border-t">
        © 2025 DoesntMatter | Seulgeumoney — Habits that quietly find you
      </footer>
    </div>
  );
}
