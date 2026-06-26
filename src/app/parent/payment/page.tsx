'use client';

import { useState } from 'react';
import Link from 'next/link';

const PAYMENT_ITEMS = [
  { icon: '💡', label: '电费', desc: '交电费', searchName: '网上国网' },
  { icon: '💧', label: '水费', desc: '交水费', searchName: '中国水务' },
  { icon: '🔥', label: '燃气费', desc: '交燃气费', searchName: '中国燃气' },
  { icon: '📱', label: '话费', desc: '充话费', searchName: '微信充值' },
  { icon: '📺', label: '有线电视', desc: '交有线电视费', searchName: '中国广电' },
  { icon: '🏠', label: '物业费', desc: '交物业费', searchName: '小区物业' },
];

export default function PaymentPage() {
  const [redirecting, setRedirecting] = useState<string | null>(null);

  const isWechat = () => {
    if (typeof navigator === 'undefined') return false;
    return /micromessenger/i.test(navigator.userAgent);
  };

  const handlePayment = (item: typeof PAYMENT_ITEMS[0]) => {
    setRedirecting(item.searchName);

    if (isWechat()) {
      // 在微信内，尝试跳转小程序
      // 使用微信URL Scheme打开小程序搜索
      const appId = getMiniProgramAppId(item.searchName);
      if (appId) {
        window.location.href = `weixin://dl/business/?t=${appId}`;
      } else {
        // 没有appId，引导搜索
        alert(`请在微信顶部搜索框搜索"${item.searchName}"小程序`);
        setRedirecting(null);
      }
    } else {
      // 不在微信内，先打开微信
      alert(`请打开微信，搜索"${item.searchName}"小程序进行缴费`);
      try {
        window.location.href = 'weixin://';
      } catch (e) {}
      setTimeout(() => setRedirecting(null), 3000);
    }
  };

  // 小程序appId映射
  const getMiniProgramAppId = (name: string): string | null => {
    const map: Record<string, string> = {
      '网上国网': 'gh_9a39c0c7b8a4',
      '微信充值': 'gh_xxxxxxxxxxxx',
    };
    return map[name] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/parent" className="text-white text-2xl">←</Link>
          <h1 className="text-xl font-bold">💰 帮缴费</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {redirecting ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
            <div style={{ fontSize: '64px', animation: 'pulse 1.5s infinite' }}>⏳</div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">正在跳转...</h2>
            <p className="text-gray-500 mt-2">正在打开"{redirecting}"小程序</p>
            <p className="text-sm text-gray-400 mt-4">如果没有自动跳转，请手动搜索小程序</p>
            <button 
              onClick={() => setRedirecting(null)}
              className="mt-6 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-bold"
            >
              取消
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👤</span>
                <div>
                  <div className="font-bold text-gray-800">为爸爸缴费</div>
                  <div className="text-sm text-gray-500">点击项目，自动跳转微信小程序</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handlePayment(item)}
                  className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '32px' }}>{item.icon}</span>
                    <div>
                      <div className="font-bold text-gray-800">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
