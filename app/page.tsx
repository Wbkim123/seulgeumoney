import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'Track spending clearly',
    description: 'See daily expenses, category totals, and trends without digging through a spreadsheet.',
  },
  {
    title: 'Set practical goals',
    description: 'Create daily, monthly, and yearly targets so your budget stays visible while you spend.',
  },
  {
    title: 'Review your money rhythm',
    description: 'Use reports and calendar views to understand what changed and where to adjust next.',
  },
];

export default function IndexPage() {
  return (
    <main className="min-h-screen bg-background text-text-main">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Seulgeumoney home">
            <Image src="/logo.png" alt="Seulgeumoney" width={150} height={44} priority />
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/auth/login/"
              className="rounded-full px-4 py-2 text-sm font-bold text-[var(--primary)] transition hover:bg-surface"
            >
              Log in
            </Link>
            <Link
              href="/auth/register/"
              className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] transition hover:bg-primary-hover"
            >
              Sign up
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
              Personal finance workspace
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.05] text-text-main sm:text-6xl">
              Seulgeumoney
            </h1>
            <p className="mt-6 max-w-xl text-lg font-bold leading-8 text-text-muted">
              A simple money dashboard for tracking spending, reviewing reports, and keeping savings goals in one calm place.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/auth/register/"
                className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition hover:bg-primary-hover"
              >
                Get started
              </Link>
              <Link
                href="/auth/login/"
                className="rounded-full border border-border-custom bg-surface px-6 py-3 text-sm font-extrabold text-text-main transition hover:border-[var(--primary)]"
              >
                I already have an account
              </Link>
            </div>
          </div>

          <div className="relative flex min-h-[420px] items-center justify-center">
            <div className="absolute inset-x-8 bottom-4 top-16 rounded-[32px] bg-surface shadow-[0_28px_70px_rgba(0,0,0,0.13)]" />
            <div className="relative w-full max-w-[460px] rounded-[28px] border border-border-custom/60 bg-surface p-6 shadow-[0_22px_55px_rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-extrabold text-[var(--primary)]">This month</p>
                  <p className="mt-1 text-3xl font-extrabold text-text-main">$1,082</p>
                </div>
                <Image src="/seuljeossi.png" alt="Seulgeumoney character" width={92} height={92} priority />
              </div>
              <div className="mt-7 grid gap-3">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-2xl bg-background px-5 py-4">
                    <h2 className="text-base font-extrabold text-text-main">{feature.title}</h2>
                    <p className="mt-1 text-sm font-bold leading-6 text-text-muted">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
