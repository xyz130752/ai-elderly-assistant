'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🧡 爸妈的小棉袄</h1>
          <div className="flex gap-4">
            <Link href="/elder" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
              老人端
            </Link>
            <Link href="/parent" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
              子女端
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <div className="text-8xl mb-6">👴👵</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            让爸妈一句话
            <br />
            <span className="text-primary">搞定数字生活</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            挂号、缴费、叫车、查天气...<br />
            只需要说一句话，AI帮您搞定
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: '🏥', label: '一键挂号' },
              { icon: '💰', label: '语音缴费' },
              { icon: '🚗', label: '帮叫车' },
              { icon: '🛡️', label: '防诈骗' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-sm font-medium text-gray-700">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/elder"
              className="bg-primary text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-primary-dark transition shadow-lg"
            >
              🎤 我是老人，开始使用
            </Link>
            <Link
              href="/parent"
              className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl text-xl font-bold hover:bg-orange-50 transition"
            >
              👨‍👩‍👧 我是子女，远程关怀
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-gray-500 text-sm">
        爸妈的小棉袄 — AI老年人数字助手
      </footer>
    </div>
  );
}
