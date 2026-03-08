'use client';

type GoalPillProps = {
  label: string;
  valueText: string;
  percent?: number;
  tone?: 'normal' | 'danger';
};

function GoalPill({ label, valueText, percent = 0, tone = 'normal' }: GoalPillProps) {
  const safe = Math.max(0, Math.min(100, percent));
  const isDanger = tone === 'danger';

  return (
    <div className="w-full rounded-full bg-white px-5 py-3.5 shadow-[0_8px_22px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
      <div className="flex items-center justify-between text-[15px]">
        <span className="text-slate-800 font-semibold">{label}</span>
        <span className={isDanger ? 'text-red-500 font-extrabold' : 'text-slate-700 font-extrabold'}>
          {valueText}
        </span>
      </div>
      <div className="mt-2.5 h-2 w-full rounded-full bg-slate-200">
        <div
          className={`h-2 rounded-full ${isDanger ? 'bg-red-500' : 'bg-[#98c195]'}`}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

function Donut({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-60 w-60 rounded-full bg-gradient-to-b from-[#cfe6c9] via-[#98c195] to-[#6ea96b] shadow-[0_24px_55px_rgba(0,0,0,0.20)]">
        <div className="absolute left-1/2 top-1/2 h-30 w-30 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-inner" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_10px_25px_rgba(255,255,255,0.35)]" />
      </div>
      <div className="mt-7 flex items-center gap-3 text-slate-500">
        <span className="text-[15px] font-semibold">{label}</span>
        <span className="text-2xl font-extrabold text-slate-600">{amount}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <section className="aspect-[50/51] rounded-2xl bg-white p-8 shadow-xl flex flex-col">
        <div className="text-[22px] font-semibold text-[#649566]">Goals</div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-2 text-center text-sm text-slate-400 font-semibold">
            <div>Daily</div>
            <div>Monthly</div>
          </div>
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <GoalPill label="Shopping" valueText="58%" percent={58} />
              <GoalPill label="Snack" valueText="20%" percent={20} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <GoalPill label="Golf" valueText="0%" percent={0} />
              <GoalPill label="PC room" valueText="50%" percent={50} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <GoalPill label="Coffee" valueText="110%" percent={100} tone="danger" />
              <GoalPill label="Text" valueText="-%" percent={12} />
            </div>
          </div>
        </div>
      </section>

      <section className="aspect-[50/51] rounded-2xl bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.12)] flex flex-col">
        <div className="flex items-start justify-between">
          <div className="text-[22px] font-semibold text-[#649566]">Total Spending</div>
          <div className="text-[28px] font-extrabold text-slate-900">$ 1,082</div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Donut label="Grocery" amount="$ 536" />
        </div>
      </section>
    </div>
  );
}