'use client';

import { useState } from 'react';
import Link from 'next/link';

// 缴费项目配置（小程序appId需要从小程序管理后台获取）
const PAYMENT_ITEMS = [
  { 
    icon: '💡', label: '电费', desc: '交电费', 
    appId: 'wx5b2c549d952fadca',  // 网上国网
    path: '/pages/index/index',
  },
  { 
    icon: '💧', label: '水费', desc: '交水费', 
    appId: '',
    path: '',
  },
  { 
    icon: '🔥', label: '燃气费', desc: '交燃气费', 
    appId: '',
    path: '',
  },
  { 
    icon: '📱', label: '话费', desc: '充话费', 
    appId: 'wx5b2c549d952fadca',  // 微信充值
    path: '/pages/recharge/index',
  },
  { 
    icon: '📺', label: '有线电视', desc: '交有线电视费', 
    appId: '',
    path: '',
  },
  { 
    icon: '🏠', label: '物业费', desc: '交物业费', 
    appId: '',
    path: '',
  },
];

export default function PaymentPage() {
  const [redirecting, setRedirecting] = useState<string | null>(null);

  const isWechat = () => {
    if (typeof navigator === 'undefined') return false;
    return /micromessenger/i.test(navigator.userAgent);
  };

  const handlePayment = (item: typeof PAYMENT_ITEMS[0]) => {
    if (!item.appId) {
      alert(`"${item.label}"暂未开通小程序，请手动搜索`);
      return;
    }

    setRedirecting(item.label);

    if (isWechat()) {
      // 在微信内，直接跳转小程序
      // 方式1：使用微信URL Scheme
      const wxUrl = `weixin://dl/business/?t=${encodeURIComponent(item.appId + ':' + item.path)}`;
      window.location.href = wxUrl;
      
      setTimeout(() => setRedirecting(null), 3000);
    } else {
      // 不在微信内，先打开微信
      try {
        window.location.href = 'weixin://';
      } catch (e) {}
      
      setTimeout(() => {
        alert(`请在微信中打开，将自动跳转"${item.label}"小程序`);
        setRedirecting(null);
      }, 2000);
    }
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
            <p className="text-sm text-gray-400 mt-4">如果没有自动跳转，请手动打开微信</p>
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
