'use client';

import { useState } from 'react';
import Link from 'next/link';

const PAYMENT_ITEMS = [
  { icon: '💡', label: '电费', desc: '交电费', placeholder: '请输入电费户号', searchName: '网上国网' },
  { icon: '💧', label: '水费', desc: '交水费', placeholder: '请输入水费户号', searchName: '中国水务' },
  { icon: '🔥', label: '燃气费', desc: '交燃气费', placeholder: '请输入燃气户号', searchName: '中国燃气' },
  { icon: '📱', label: '话费', desc: '充话费', placeholder: '请输入手机号', searchName: '微信充值' },
  { icon: '📺', label: '有线电视', desc: '交有线电视费', placeholder: '请输入有线电视卡号', searchName: '中国广电' },
  { icon: '🏠', label: '物业费', desc: '交物业费', placeholder: '请输入物业费户号', searchName: '小区物业' },
];

export default function PaymentPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');

  const selectedItem = PAYMENT_ITEMS.find(i => i.label === selected);

  // 检测是否在微信内
  const isWechat = () => {
    if (typeof navigator === 'undefined') return false;
    return /micromessenger/i.test(navigator.userAgent);
  };

  // 处理缴费
  const handlePayment = () => {
    if (!accountNo.trim()) {
      alert('请输入户号');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('请输入正确的金额');
      return;
    }

    if (!selectedItem) return;

    const searchName = selectedItem.searchName;

    if (isWechat()) {
      // 在微信内，提示搜索小程序
      alert(`请在微信顶部搜索框搜索"${searchName}"小程序进行缴费\n\n户号：${accountNo}\n金额：¥${amount}`);
    } else {
      // 不在微信内，提示打开微信
      alert(`请打开微信，搜索"${searchName}"小程序进行缴费\n\n户号：${accountNo}\n金额：¥${amount}`);
      
      // 尝试打开微信
      try {
        window.location.href = 'weixin://';
      } catch (e) {
        // 无法打开微信，忽略
      }
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
        {!selected ? (
          <>
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👤</span>
                <div>
                  <div className="font-bold text-gray-800">为爸爸缴费</div>
                  <div className="text-sm text-gray-500">选择缴费项目，通过微信小程序缴费</div>
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
                <div className="text-sm text-gray-500">将通过微信小程序"{selectedItem?.searchName}"缴费</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">户号/账号</label>
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  placeholder={selectedItem?.placeholder}
                  className="w-full px-4 py-3 border rounded-xl text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">缴费金额(元)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="请输入金额"
                  min="1"
                  className="w-full px-4 py-3 border rounded-xl text-lg"
                />
              </div>
            </div>

            {/* 提示信息 */}
            <div className="mt-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
              💡 确认后将提示您在微信中搜索"<strong>{selectedItem?.searchName}</strong>"小程序完成缴费
            </div>

            <div className="mt-6 space-y-3">
              <button 
                onClick={handlePayment}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg"
              >
                ✅ 确认缴费
              </button>
              <button 
                onClick={() => { setSelected(null); setAccountNo(''); setAmount(''); }}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold"
              >
                返回选择
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
