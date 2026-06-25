'use client';

interface ElderCardProps {
  elder: {
    id: string;
    name: string;
    status: 'online' | 'offline';
    lastActive: Date;
    todayActivity: {
      voiceCount: number;
      healthStatus: 'normal' | 'warning' | 'danger';
      medicationTaken: boolean;
    };
  };
  onRemoteControl: (elderId: string) => void;
}

export function ElderCard({ elder, onRemoteControl }: ElderCardProps) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
  };

  const healthBadges = {
    normal: { text: '正常', className: 'bg-green-100 text-green-800' },
    warning: { text: '注意', className: 'bg-yellow-100 text-yellow-800' },
    danger: { text: '异常', className: 'bg-red-100 text-red-800' },
  };

  const badge = healthBadges[elder.todayActivity.healthStatus];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border mb-3">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${statusColors[elder.status]}`} />
          <span className="font-bold text-lg">{elder.name}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${badge.className}`}>{badge.text}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center text-sm mb-3">
        <div>
          <div className="text-2xl font-bold text-primary">{elder.todayActivity.voiceCount}</div>
          <div className="text-gray-500">语音交互</div>
        </div>
        <div>
          <div className={`text-2xl font-bold ${elder.todayActivity.medicationTaken ? 'text-green-500' : 'text-red-500'}`}>
            {elder.todayActivity.medicationTaken ? '✓' : '✗'}
          </div>
          <div className="text-gray-500">服药</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">
            {elder.lastActive.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-gray-500">最后活跃</div>
        </div>
      </div>

      <button
        onClick={() => onRemoteControl(elder.id)}
        className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition"
      >
        远程帮操作
      </button>
    </div>
  );
}
