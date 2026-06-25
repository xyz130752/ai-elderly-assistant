const AMAP_KEY = '62e1811f9a56126267ab073e33ba2df0';
const AMAP_BASE = 'https://restapi.amap.com/v3';

// 地理编码：地址 → 经纬度
export async function geocode(address: string, city?: string): Promise<{
  location: string;
  formattedAddress: string;
} | null> {
  const params = new URLSearchParams({ key: AMAP_KEY, address });
  if (city) params.set('city', city);

  const res = await fetch(`${AMAP_BASE}/geocode/geo?${params}`);
  const data = await res.json();

  if (data.status === '1' && data.geocodes?.[0]) {
    const geo = data.geocodes[0];
    return {
      location: geo.location,
      formattedAddress: geo.formatted_address,
    };
  }
  return null;
}

// 驾车路线规划
export async function drivingRoute(
  origin: string,
  destination: string
): Promise<{
  distance: string;
  duration: string;
  steps: string[];
} | null> {
  const params = new URLSearchParams({
    key: AMAP_KEY,
    origin,
    destination,
    strategy: '0',
  });

  const res = await fetch(`${AMAP_BASE}/direction/driving?${params}`);
  const data = await res.json();

  if (data.status === '1' && data.route?.paths?.[0]) {
    const path = data.route.paths[0];
    const steps = (path.steps || []).map((s: any) => s.instruction);

    return {
      distance: formatDistance(parseInt(path.distance)),
      duration: formatDuration(parseInt(path.duration)),
      steps,
    };
  }
  return null;
}

// 公交路线规划
export async function transitRoute(
  origin: string,
  destination: string,
  city: string
): Promise<{
  distance: string;
  duration: string;
  steps: string[];
} | null> {
  const params = new URLSearchParams({
    key: AMAP_KEY,
    origin,
    destination,
    city,
    strategy: '0',
  });

  const res = await fetch(`${AMAP_BASE}/direction/transit/integrated?${params}`);
  const data = await res.json();

  if (data.status === '1' && data.route?.transits?.[0]) {
    const transit = data.route.transits[0];
    const steps: string[] = [];

    for (const seg of transit.segments || []) {
      if (seg.bus?.buslines?.[0]) {
        const bus = seg.bus.buslines[0];
        steps.push(`乘坐 ${bus.name}（${bus.departure_stop.name} → ${bus.arrival_stop.name}，约${Math.round(bus.via_num)}站）`);
      } if (seg.railway?.name) {
        steps.push(`乘坐 ${seg.railway.name}（${seg.railway.departure_stop.name} → ${seg.railway.arrival_stop.name}）`);
      } if (seg.walking?.distance && parseInt(seg.walking.distance) > 0) {
        steps.push(`步行 ${formatDistance(parseInt(seg.walking.distance))}`);
      }
    }

    return {
      distance: formatDistance(parseInt(transit.distance)),
      duration: formatDuration(parseInt(transit.duration)),
      steps,
    };
  }
  return null;
}

// 周边搜索：找附近的医院、餐厅等
export async function nearbySearch(
  location: string,
  keyword: string,
  radius?: number
): Promise<Array<{
  name: string;
  address: string;
  distance: string;
  tel: string;
}>> {
  const params = new URLSearchParams({
    key: AMAP_KEY,
    location,
    keyword,
    radius: String(radius || 3000),
  });

  const res = await fetch(`${AMAP_BASE}/place/around?${params}`);
  const data = await res.json();

  if (data.status === '1' && data.pois) {
    return data.pois.slice(0, 5).map((poi: any) => ({
      name: poi.name,
      address: poi.address || '',
      distance: poi.distance ? formatDistance(parseInt(poi.distance)) : '',
      tel: poi.tel || '',
    }));
  }
  return [];
}

function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}公里`;
  }
  return `${meters}米`;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}小时${mins}分钟`;
  return `${mins}分钟`;
}
