'use client';

import { useState } from 'react';
import Link from 'next/link';

const PAYMENT_ITEMS = [
  { 
    icon: '💡', label: '电费', desc: '交电费', 
    placeholder: '请输入电费户号（如：44030012345678）',
    miniProgram: {
      name: '网上国网',
      appId: 'wx9a39c0c7b8a4b3e5',  // 网上国网小程序appId
      path: '/pages/index/index',
      fallback: 'https://www.95598.cn',
    }
  },
  { 
    icon: '💧', label: '水费', desc: '交水费', 
    placeholder: '请输入水费户号',
    miniProgram: {
      name: '中国水务',
      appId: '',  // 需要申请
      path: '',
      fallback: 'https://www.water.com',
    }
  },
  { 
    icon: '🔥', label: '燃气费', desc: '交燃气费', 
    placeholder: '请输入燃气户号',
    miniProgram: {
      name: '中国燃气',
      appId: '',  // 需要申请
      path: '',
      fallback: 'https://www.chinagasholdings.com',
    }
  },
  { 
    icon: '📱', label: '话费', desc: '充话费', 
    placeholder: '请输入手机号',
    miniProgram: {
      name: '微信充值',
      appId: 'wx234567890abcdef',  // 微信充值小程序
      path: '/pages/recharge/index',
      fallback: 'https://pay.weixin.qq.com',
    }
  },
  { 
    icon: '📺', label: '有线电视', desc: '交有线电视费', 
    placeholder: '请输入有线电视卡号',
    miniProgram: {
      name: '中国广电',
      appId: '',
      path: '',
      fallback: 'https://www.cctv.com',
    }
  },
  { 
    icon: '🏠', label: '物业费', desc: '交物业费', 
    placeholder: '请输入物业费户号',
    miniProgram: {
      name: '小区物业',
      appId: '',
      path: '',
      fallback: '#',
    }
  },
];

export default function PaymentPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const selectedItem = PAYMENT_ITEMS.find(i => i.label === selected);

  // 检测是否在微信内
  const isWechat = () => {
    const ua = navigator.userAgent.toLowerCase();
    return /micromessenger/.test(ua);
  };

  // 检测设备类型
  const getDeviceType = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    return 'other';
  };

  // 跳转到微信小程序
  const handlePayment = () => {
    if (!accountNo || !amount) {
      alert('请填写完整信息');
      return;
    }

    if (!selectedItem?.miniProgram) {
      alert('暂不支持此缴费类型');
      return;
    }

    setIsRedirecting(true);

    const { miniProgram } = selectedItem;

    if (isWechat()) {
      // 在微信内，尝试跳转小程序
      // 注意：真正的微信小程序跳转需要后端生成小程序码
      // 这里使用微信scheme方式
      if (miniProgram.appId) {
        // 尝试通过微信scheme打开小程序
        const wechatUrl = `weixin://dl/business/?t=${miniProgram.appId}`;
        window.location.href = wechatUrl;
        
        // 如果3秒后还在当前页面，说明无法跳转
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            // 尝试网页版
            if (miniProgram.fallback && miniProgram.fallback !== '#') {
              window.open(miniProgram.fallback, '_blank');
            } else {
              alert('请在微信中搜索"${miniProgram.name}"小程序');
            }
          }
          setIsRedirecting(false);
        }, 3000);
      } else {
        // 没有appId，提示用户搜索小程序
        alert(`请在微信中搜索"${miniProgram.name}"小程序`);
        setIsRedirecting(false);
      }
    } else {
      // 不在微信内，引导用户打开微信
      const device = getDeviceType();
      let wechatUrl = '';
      
      if (device === 'ios') {
        wechatUrl = 'weixin://';
      } else if (device === 'android') {
        wechatUrl = 'weixin://';
      }

      if (wechatUrl) {
        window.location.href = wechatUrl;
        
        // 如果3秒后还在当前页面，说明没安装微信
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            alert('请先打开微信，然后搜索"${miniProgram.name}"小程序');
          }
          setIsRedirecting(false);
        }, 3000);
      } else {
        alert('请先打开微信，然后搜索"${miniProgram.name}"小程序');
        setIsRedirecting(false);
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
        {isRedirecting ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
            <div style={{ fontSize: '64px', animation: 'pulse 1.5s infinite' }}>⏳</div>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">正在跳转...</h2>
            <p className="text-gray-500 mt-2">
              {isWechat() 
                ? `正在打开${selectedItem?.miniProgram?.name || '微信小程序'}`
                : '正在打开微信...'
              }
            </p>
            <p className="text-sm text-gray-400 mt-4">
              {isWechat() 
                ? '如果没有自动跳转，请手动搜索小程序'
                : '如果没有自动跳转，请打开微信搜索小程序'
              }
            </p>
            <button 
              onClick={() => setIsRedirecting(false)}
              className="mt-6 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-bold"
            >
              取消
            </button>
          </div>
        ) : !selected ? (
          <>
            <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👤</span>
                <div>
                  <div className="font-bold text-gray-800">为爸爸缴费</div>
                  <div className="text-sm text-gray-500">选择缴费项目，自动跳转微信小程序</div>
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

            {/* 提示信息 */}
            <div className="mt-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
              💡 点击"确认缴费"将自动跳转到<strong>微信小程序</strong>
              <br/>
              {isWechat() 
                ? <span className="text-blue-500">（已在微信中，可直接跳转）</span>
                : <span className="text-blue-500">（需要打开微信才能使用小程序）</span>
              }
            </div>

            <div className="mt-6 space-y-3">
              <button 
                onClick={handlePayment}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg"
              >
                {isWechat() 
                  ? `📱 确认缴费 → 打开${selectedItem?.miniProgram?.name || '小程序'}`
                  : '📱 确认缴费 → 打开微信'
                }
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
