import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seulgeumoney',
  icons: {
    icon: [{ url: '/logo.png?v=20260611', type: 'image/png' }],
    shortcut: [{ url: '/logo.png?v=20260611', type: 'image/png' }],
    apple: [{ url: '/logo.png?v=20260611', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
