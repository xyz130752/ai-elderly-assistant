'use client';

import { useState } from 'react';
import Link from 'next/link';

const PAYMENT_ITEMS = [
  { icon: '💡', label: '电费', desc: '交电费', placeholder: '请输入电费户号' },
  { icon: '💧', label: '水费', desc: '交水费', placeholder: '请输入水费户号' },
  { icon: '🔥', label: '燃气费', desc: '交燃气费', placeholder: '请输入燃气户号' },
  { icon: '📱', label: '话费', desc: '充话费', placeholder: '请输入手机号' },
  { icon: '📺', label: '有线电视', desc: '交有线电视费', placeholder: '请输入有线电视卡号' },
  { icon: '🏠', label: '物业费', desc: '交物业费', placeholder: '请输入物业费户号' },
];

export default function PaymentPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedItem = PAYMENT_ITEMS.find(i => i.label === selected);

  const handleSubmit = () => {
    if (!accountNo || !amount) {
      alert('请填写完整信息');
      return;
    }
    setSubmitted(true);
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
        {submitted ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
            <div style={{ fontSize: '64px' }}>✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">缴费成功！</h2>
            <p className="text-gray-500 mt-2">
              已为爸爸缴纳 {selectedItem?.label} ¥{amount}
            </p>
            <div className="mt-6 space-y-3">
              <button 
                onClick={() => { setSubmitted(false); setSelected(null); setAccountNo(''); setAmount(''); }}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold"
              >
                继续缴费
              </button>
              <Link href="/parent" className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-center">
                返回首页
              </Link>
            </div>
          </div>
        ) : !selected ? (
          <>
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👤</span>
                <div>
                  <div className="font-bold text-gray-800">为爸爸缴费</div>
                  <div className="text-sm text-gray-500">选择缴费项目</div>
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
                <div className="text-sm text-gray-500">{selectedItem?.desc}</div>
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
                  className="w-full px-4 py-3 border rounded-xl text-lg"
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button 
                onClick={handleSubmit}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg"
              >
                确认缴费
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
