'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ElderCard } from '@/components/parent/ElderCard';

const MOCK_ELDERS = [
  {
    id: '1',
    name: '爸爸',
    status: 'online' as const,
    lastActive: new Date(Date.now() - 10 * 60 * 1000),
    todayActivity: { voiceCount: 8, healthStatus: 'normal' as const, medicationTaken: true },
  },
  {
    id: '2',
    name: '妈妈',
    status: 'online' as const,
    lastActive: new Date(Date.now() - 60 * 60 * 1000),
    todayActivity: { voiceCount: 3, healthStatus: 'warning' as const, medicationTaken: false },
  },
];

export default function ParentPage() {
  const [elders] = useState(MOCK_ELDERS);
  const [showMenu, setShowMenu] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold">🧡 小棉袄 · 家人版</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 快捷功能入口 */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">🔧 管理功能</h2>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/parent/medication" style={{ textDecoration: 'none' }}>
              <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer text-center">
                <span style={{ fontSize: '32px' }}>💊</span>
                <div className="font-bold text-gray-800 mt-2">用药管理</div>
              </div>
            </Link>
            <Link href="/parent/payment" style={{ textDecoration: 'none' }}>
              <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer text-center">
                <span style={{ fontSize: '32px' }}>💰</span>
                <div className="font-bold text-gray-800 mt-2">帮缴费</div>
              </div>
            </Link>
            <Link href="/parent/ride" style={{ textDecoration: 'none' }}>
              <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer text-center">
                <span style={{ fontSize: '32px' }}>🚗</span>
                <div className="font-bold text-gray-800 mt-2">帮叫车</div>
              </div>
            </Link>
          </div>
        </section>

        {/* 我的家人 */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">👨‍👩‍👧 我的家人</h2>
          {elders.map((elder) => (
            <div key={elder.id} className="relative">
              <ElderCard 
                elder={elder} 
                onRemoteControl={(id) => setShowMenu(showMenu === id ? null : id)} 
              />
              {/* 远程操作菜单 */}
              {showMenu === elder.id && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: '16px',
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  border: '1px solid #E5E7EB',
                  padding: '8px',
                  zIndex: 50,
                  minWidth: '160px',
                }}>
                  <Link 
                    href="/parent/medication" 
                    style={{ textDecoration: 'none' }}
                    onClick={() => setShowMenu(null)}
                  >
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#333',
                      fontSize: '14px',
                    }}>
                      <span>💊</span> 管理用药
                    </div>
                  </Link>
                  <Link 
                    href="/parent/payment" 
                    style={{ textDecoration: 'none' }}
                    onClick={() => setShowMenu(null)}
                  >
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#333',
                      fontSize: '14px',
                    }}>
                      <span>💰</span> 帮缴费
                    </div>
                  </Link>
                  <Link 
                    href="/parent/ride" 
                    style={{ textDecoration: 'none' }}
                    onClick={() => setShowMenu(null)}
                  >
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#333',
                      fontSize: '14px',
                    }}>
                      <span>🚗</span> 帮叫车
                    </div>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* 异常提醒 */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">⚠️ 异常提醒</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm border space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <span className="text-2xl">🔴</span>
              <div className="flex-1">
                <div className="font-medium text-red-800">妈妈接到可疑电话</div>
                <div className="text-sm text-red-600">疑似诈骗，已拦截 · 10:32</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl">🟡</span>
              <div className="flex-1">
                <div className="font-medium text-yellow-800">妈妈今日未服药</div>
                <div className="text-sm text-yellow-600">降压药提醒已过3小时 · 09:15</div>
              </div>
            </div>
          </div>
        </section>

        {/* 本周概览 */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">📊 本周概览</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '语音交互', value: '45次', color: 'text-primary' },
              { label: '就医', value: '2次', color: 'text-blue-500' },
              { label: '缴费', value: '5次', color: 'text-green-500' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border text-center">
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-sm text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
