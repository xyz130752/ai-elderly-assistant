import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '爸妈的小棉袄 - AI老年人数字助手',
  description: '让爸妈一句话搞定挂号、缴费、叫车、查天气',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}
