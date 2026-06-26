'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 缴费项目配置
const PAYMENT_ITEMS = [
  { 
    icon: '💡', label: '电费', desc: '交电费', 
    searchName: '网上国网',
    qrcode: '/qrcode/wangshangguowang.png',  // 需要替换为真实二维码
    color: '#FF6B35',
  },
  { 
    icon: '💧', label: '水费', desc: '交水费', 
    searchName: '中国水务',
    qrcode: '/qrcode/zhongguoshuiwu.png',
    color: '#3B82F6',
  },
  { 
    icon: '🔥', label: '燃气费', desc: '交燃气费', 
    searchName: '中国燃气',
    qrcode: '/qrcode/zhongguoranqi.png',
    color: '#EF4444',
  },
  { 
    icon: '📱', label: '话费', desc: '充话费', 
    searchName: '微信充值',
    qrcode: '/qrcode/weixinchongzhi.png',
    color: '#10B981',
  },
  { 
    icon: '📺', label: '有线电视', desc: '交有线电视费', 
    searchName: '中国广电',
    qrcode: '/qrcode/zhongguoguangdian.png',
    color: '#8B5CF6',
  },
  { 
    icon: '🏠', label: '物业费', desc: '交物业费', 
    searchName: '小区物业',
    qrcode: '',
    color: '#6B7280',
  },
];

export default function PaymentPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedItem = PAYMENT_ITEMS.find(i => i.label === selected);

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
        {!selected ? (
          <>
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👤</span>
                <div>
                  <div className="font-bold text-gray-800">为爸爸缴费</div>
                  <div className="text-sm text-gray-500">选择缴费项目，扫描二维码进入小程序</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSelected(item.label)}
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
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-6">
              <span style={{ fontSize: '48px' }}>{selectedItem?.icon}</span>
              <div>
                <div className="text-xl font-bold text-gray-800">{selectedItem?.label}</div>
                <div className="text-sm text-gray-500">扫描二维码进入"{selectedItem?.searchName}"小程序</div>
              </div>
            </div>
            
            {/* 二维码区域 */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm">
                {selectedItem?.qrcode ? (
                  <div className="relative" style={{ width: '200px', height: '200px' }}>
                    <Image 
                      src={selectedItem.qrcode}
                      alt={`${selectedItem.searchName}小程序二维码`}
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div 
                    className="flex items-center justify-center text-gray-400"
                    style={{ width: '200px', height: '200px' }}
                  >
                    <div className="text-center">
                      <div style={{ fontSize: '48px' }}>📱</div>
                      <div className="mt-2">二维码待添加</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 操作说明 */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-blue-700">
                <div className="font-bold mb-2">📌 操作步骤：</div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>打开微信</li>
                  <li>点击右上角"+" → 扫一扫</li>
                  <li>扫描上方二维码</li>
                  <li>进入小程序完成缴费</li>
                </ol>
              </div>
            </div>

            {/* 备选方案 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-600">
                <div className="font-bold mb-2">💡 或者手动搜索：</div>
                <div>打开微信 → 搜索 → 输入"<strong>{selectedItem?.searchName}</strong>"</div>
              </div>
            </div>

            <button 
              onClick={() => setSelected(null)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold"
            >
              返回选择
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
