'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// 高德地图JS API类型声明
declare global {
  interface Window {
    AMap: any;
  }
}

const CAR_TYPES = [
  { id: 'fast', icon: '🚗', label: '快车', desc: '经济实惠', multiplier: 1 },
  { id: 'comfort', icon: '🚙', label: '舒适型', desc: '宽敞舒适', multiplier: 1.5 },
  { id: 'business', icon: '🚐', label: '商务车', desc: '可坐6人', multiplier: 2.2 },
];

// 深圳常用地点（带坐标）
const COMMON_PLACES = [
  { name: '龙华区人民医院', address: '深圳市龙华区建设东路', lat: 22.6425, lng: 114.0218 },
  { name: '深圳市第二人民医院', address: '深圳市福田区笋岗西路', lat: 22.5562, lng: 114.0585 },
  { name: '北大深圳医院', address: '深圳市福田区莲花路1120号', lat: 22.5653, lng: 114.0564 },
  { name: '香港大学深圳医院', address: '深圳市南山区白石路东8号', lat: 22.5368, lng: 113.9422 },
  { name: '龙华广场', address: '深圳市龙华区人民路', lat: 22.6398, lng: 114.0245 },
  { name: '深圳北站', address: '深圳市龙华区致远中路', lat: 22.6100, lng: 114.0286 },
  { name: '龙华文化广场', address: '深圳市龙华区东环二路', lat: 22.6358, lng: 114.0389 },
  { name: '观澜湖', address: '深圳市龙华区观澜街道', lat: 22.7258, lng: 114.0725 },
];

export default function RidePage() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupPlace, setPickupPlace] = useState<typeof COMMON_PLACES[0] | null>(null);
  const [destPlace, setDestPlace] = useState<typeof COMMON_PLACES[0] | null>(null);
  const [carType, setCarType] = useState('fast');
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string; price: number } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // 加载高德地图
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=62e1811f9a56126267ab073e33ba2df0';
    script.async = true;
    script.onload = () => {
      if (window.AMap && mapRef.current) {
        mapInstanceRef.current = new window.AMap.Map(mapRef.current, {
          zoom: 12,
          center: [114.0245, 22.6398], // 龙华
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // 模拟路线规划
  const planRoute = (from: string, to: string) => {
    const mockRoutes: Record<string, { distance: string; duration: string; price: number }> = {
      '龙华区人民医院-深圳市第二人民医院': { distance: '18.5公里', duration: '约35分钟', price: 45 },
      '龙华广场-深圳北站': { distance: '5.2公里', duration: '约15分钟', price: 18 },
      '龙华区人民医院-北大深圳医院': { distance: '22.3公里', duration: '约45分钟', price: 55 },
    };
    
    const key = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;
    
    if (mockRoutes[key]) {
      return mockRoutes[key];
    } else if (mockRoutes[reverseKey]) {
      return mockRoutes[reverseKey];
    } else {
      const distance = (Math.random() * 20 + 3).toFixed(1);
      return {
        distance: `${distance}公里`,
        duration: `约${Math.round(parseFloat(distance) * 2.5)}分钟`,
        price: Math.round(parseFloat(distance) * 3 + 10),
      };
    }
  };

  const handlePlanRoute = () => {
    if (!pickup || !destination) {
      alert('请输入出发地和目的地');
      return;
    }
    const info = planRoute(pickup, destination);
    setRouteInfo(info);
    
    // 在地图上标记
    if (mapInstanceRef.current && window.AMap) {
      mapInstanceRef.current.clearMap();
      
      // 添加标记
      const pickupMarker = new window.AMap.Marker({
        position: pickupPlace ? [pickupPlace.lng, pickupPlace.lat] : [114.0245, 22.6398],
        label: { content: '● 出发', direction: 'top' },
      });
      
      const destMarker = new window.AMap.Marker({
        position: destPlace ? [destPlace.lng, destPlace.lat] : [114.05, 22.65],
        label: { content: '● 到达', direction: 'top' },
      });
      
      mapInstanceRef.current.add([pickupMarker, destMarker]);
      mapInstanceRef.current.setFitView();
    }
  };

  const selectedCar = CAR_TYPES.find(c => c.id === carType);
  const finalPrice = routeInfo ? Math.round(routeInfo.price * (selectedCar?.multiplier || 1)) : 0;

  // 跳转到高德地图App打车
  const handleGaodeRide = () => {
    const slat = pickupPlace?.lat || 22.6398;
    const slon = pickupPlace?.lng || 114.0245;
    const dlat = destPlace?.lat || 22.65;
    const dlon = destPlace?.lng || 114.05;
    const sname = encodeURIComponent(pickup || '出发地');
    const dname = encodeURIComponent(destination || '目的地');
    
    // 高德地图URI Scheme - 打车功能
    const gaodeUrl = `androidamap://route?sourceApplication=amap&slat=${slat}&slon=${slon}&sname=${sname}&dlat=${dlat}&dlon=${dlon}&dname=${dname}&dev=0&t=0`;
    
    // 尝试打开高德地图App
    window.location.href = gaodeUrl;
    
    // 如果没安装高德，跳转到H5页面
    setTimeout(() => {
      const h5Url = `https://uri.amap.com/navigation?from=${slon},${slat},${sname}&to=${dlon},${dlat},${dname}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`;
      window.open(h5Url, '_blank');
    }, 500);
  };

  const handleSubmit = () => {
    if (!pickup || !destination) {
      alert('请输入出发地和目的地');
      return;
    }
    if (!routeInfo) {
      handlePlanRoute();
      return;
    }
    // 直接跳转到高德地图打车
    handleGaodeRide();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/parent" className="text-white text-2xl">←</Link>
          <h1 className="text-xl font-bold">🚗 帮叫车</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        {/* 地图区域 */}
        <div 
          ref={mapRef} 
          className="bg-white rounded-xl shadow-sm border overflow-hidden mb-4"
          style={{ height: '200px', background: '#e8f4f8' }}
        >
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div style={{ fontSize: '48px' }}>🗺️</div>
              <div>地图加载中...</div>
            </div>
          </div>
        </div>

        {/* 出发地和目的地 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
          <div className="space-y-3">
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">●</span>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => { setPickup(e.target.value); setShowPickupSuggestions(true); setPickupPlace(null); }}
                  onFocus={() => setShowPickupSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                  placeholder="爸爸在哪里上车"
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              </div>
              {showPickupSuggestions && (
                <div className="absolute left-8 right-0 top-12 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {COMMON_PLACES.filter(p => !pickup || p.name.includes(pickup) || p.address.includes(pickup)).map((place) => (
                    <div
                      key={place.name}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                      onClick={() => { 
                        setPickup(place.name); 
                        setPickupPlace(place);
                        setShowPickupSuggestions(false); 
                      }}
                    >
                      <div className="font-medium">{place.name}</div>
                      <div className="text-sm text-gray-500">{place.address}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="text-red-500 text-xl">●</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => { setDestination(e.target.value); setShowDestSuggestions(true); setDestPlace(null); }}
                  onFocus={() => setShowDestSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                  placeholder="爸爸要去哪里"
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              </div>
              {showDestSuggestions && (
                <div className="absolute left-8 right-0 top-12 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {COMMON_PLACES.filter(p => !destination || p.name.includes(destination) || p.address.includes(destination)).map((place) => (
                    <div
                      key={place.name}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                      onClick={() => { 
                        setDestination(place.name); 
                        setDestPlace(place);
                        setShowDestSuggestions(false); 
                      }}
                    >
                      <div className="font-medium">{place.name}</div>
                      <div className="text-sm text-gray-500">{place.address}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handlePlanRoute}
            className="mt-3 w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium"
          >
            🗺️ 规划路线
          </button>
        </div>

        {/* 路线信息 */}
        {routeInfo && (
          <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-500">距离</div>
                <div className="text-lg font-bold">{routeInfo.distance}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">预计时间</div>
                <div className="text-lg font-bold">{routeInfo.duration}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">预计费用</div>
                <div className="text-lg font-bold text-primary">¥{finalPrice}</div>
              </div>
            </div>
          </div>
        )}

        {/* 选择车型 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
          <div className="font-bold text-gray-800 mb-3">选择车型</div>
          <div className="space-y-2">
            {CAR_TYPES.map((car) => (
              <button
                key={car.id}
                onClick={() => setCarType(car.id)}
                className={`w-full p-3 rounded-xl border text-left transition-all ${
                  carType === car.id 
                    ? 'border-primary bg-orange-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '28px' }}>{car.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold">{car.label}</div>
                    <div className="text-sm text-gray-500">{car.desc}</div>
                  </div>
                  {routeInfo && (
                    <div className="text-primary font-bold">
                      ¥{Math.round(routeInfo.price * car.multiplier)}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 确认叫车按钮 - 直接跳转高德地图 */}
        <button 
          onClick={handleSubmit}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg mb-4"
        >
          {routeInfo ? `确认叫车 ¥${finalPrice} → 打开高德地图` : '规划路线'}
        </button>

        {/* 提示 */}
        <div className="bg-blue-50 rounded-xl p-4 text-center text-blue-700 text-sm">
          💡 点击"确认叫车"将自动打开高德地图App帮爸爸叫车
          <br/>
          <span className="text-blue-500">（需在爸爸手机上安装高德地图）</span>
        </div>
      </main>
    </div>
  );
}
