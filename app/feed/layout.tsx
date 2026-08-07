import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instagram Feed Clone',
  description: 'Pixel-perfect Instagram main feed with Stories, Posts, and interactive actions.',
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
