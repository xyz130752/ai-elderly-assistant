'use client';

import { useState } from 'react';

interface QuickActionsProps {
  onSelect: (action: string) => void;
  disabled?: boolean;
}

const ACTIONS = [
  { icon: '🌤️', label: '查天气', action: '今天天气怎么样' },
  { icon: '🏥', label: '挂号', action: '__REGISTER__' },
  { icon: '💰', label: '缴费', action: '__PAYER__' },
  { icon: '🚗', label: '叫车', action: '帮我叫个车' },
  { icon: '💊', label: '吃药', action: '__MEDICATION__' },
];

const PAYMENT_ITEMS = [
  { icon: '💡', label: '电费', desc: '交电费' },
  { icon: '💧', label: '水费', desc: '交水费' },
  { icon: '🔥', label: '燃气费', desc: '交燃气费' },
  { icon: '📱', label: '话费', desc: '充话费' },
  { icon: '📺', label: '有线电视', desc: '交有线电视费' },
  { icon: '🏠', label: '物业费', desc: '交物业费' },
];

const HOSPITALS = [
  { name: '龙华区人民医院', depts: ['内科', '外科', '骨科', '眼科'] },
  { name: '深圳市第二人民医院', depts: ['内科', '外科', '心内科', '神经科'] },
  { name: '北大深圳医院', depts: ['内科', '外科', '肿瘤科', '妇产科'] },
  { name: '香港大学深圳医院', depts: ['内科', '外科', '儿科', '皮肤科'] },
];

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  notes?: string;
}

interface MedStatus {
  time: string;
  taken: boolean;
}

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMedication, setShowMedication] = useState(false);
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [medStatusMap, setMedStatusMap] = useState<Record<string, Record<string, boolean>>>({});
  const [medLoading, setMedLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  const handleAction = (action: string) => {
    if (action === '__PAYER__') {
      setShowPayment(true);
    } else if (action === '__REGISTER__') {
      setShowRegister(true);
    } else if (action === '__MEDICATION__') {
      fetchMedicationData();
    } else {
      onSelect(action);
    }
  };

  const fetchMedicationData = async () => {
    setMedLoading(true);
    setShowMedication(true);
    try {
      const userId = 'elder-001';
      const res = await fetch(`/api/medication/record?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setMedications(data.medications || []);
        setMedStatusMap(data.statusMap || {});
      }
    } catch (e) {
      console.error('获取用药数据失败:', e);
    } finally {
      setMedLoading(false);
    }
  };

  const handleMedicationChat = () => {
    setShowMedication(false);
    onSelect('我有哪些药要吃');
  };

  const handleRecordTaken = async (medicationId: string, time: string) => {
    try {
      const res = await fetch('/api/medication/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationId,
          userId: 'elder-001',
          scheduledTime: time,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // 更新本地状态
        setMedStatusMap(prev => ({
          ...prev,
          [medicationId]: {
            ...prev[medicationId],
            [time]: true,
          },
        }));
      }
    } catch (e) {
      console.error('记录服药失败:', e);
    }
  };

  const handlePaymentSelect = (desc: string) => {
    setShowPayment(false);
    onSelect('帮我' + desc);
  };

  const handleHospitalSelect = (hospital: string) => {
    setSelectedHospital(hospital);
  };

  const handleDeptSelect = (dept: string) => {
    setShowRegister(false);
    setSelectedHospital(null);
    onSelect('帮我预约' + selectedHospital + '的' + dept);
  };

  const closeAll = () => {
    setShowPayment(false);
    setShowRegister(false);
    setShowMedication(false);
    setSelectedHospital(null);
  };

  return (
    <div style={{ padding: '8px 16px', position: 'relative' }}>
      {/* 挂号选项弹窗 */}
      {showRegister && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '16px', right: '16px',
          marginBottom: '8px', background: 'white', borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB',
          padding: '16px', zIndex: 50, maxHeight: '400px', overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>
              {selectedHospital ? '选择科室' : '🏥 选择医院'}
            </h3>
            <button onClick={closeAll} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#999', cursor: 'pointer' }}>✕</button>
          </div>
          
          {!selectedHospital ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {HOSPITALS.map((h) => (
                <button
                  key={h.name}
                  onClick={() => handleHospitalSelect(h.name)}
                  style={{
                    padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB',
                    background: 'white', textAlign: 'left', cursor: 'pointer', fontSize: '16px',
                  }}
                >
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{h.name}</div>
                  <div style={{ fontSize: '13px', color: '#999', marginTop: '2px' }}>
                    可选科室：{h.depts.join('、')}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {HOSPITALS.find(h => h.name === selectedHospital)?.depts.map((dept) => (
                <button
                  key={dept}
                  onClick={() => handleDeptSelect(dept)}
                  style={{
                    padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB',
                    background: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: '500',
                  }}
                >
                  {dept}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 缴费选项弹窗 */}
      {showPayment && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '16px', right: '16px',
          marginBottom: '8px', background: 'white', borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #E5E7EB',
          padding: '16px', zIndex: 50,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>💰 选择缴费项目</h3>
            <button onClick={closeAll} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#999', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {PAYMENT_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handlePaymentSelect(item.desc)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '12px 8px', borderRadius: '12px', border: '1px solid #E5E7EB',
                  background: 'white', cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#555' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 用药提醒弹窗 */}
      {showMedication && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '16px', right: '16px',
          marginBottom: '8px', background: 'white', borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '2px solid #FF6B35',
          padding: '16px', zIndex: 50, maxHeight: '500px', overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>💊 今日用药</h3>
            <button onClick={closeAll} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#999', cursor: 'pointer' }}>✕</button>
          </div>

          {medLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '32px', animation: 'pulse 1.5s infinite' }}>💊</div>
              <p>加载中...</p>
            </div>
          ) : medications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '32px' }}>📋</div>
              <p>暂无用药记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.id} style={{
                  padding: '12px', borderRadius: '12px',
                  backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB',
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', marginBottom: '6px' }}>
                    💊 {med.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                    📏 {med.dosage} {med.notes ? `· ${med.notes}` : ''}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {med.times.map((time) => {
                      const taken = medStatusMap[med.id]?.[time] || false;
                      return (
                        <button
                          key={time}
                          onClick={() => !taken && handleRecordTaken(med.id, time)}
                          disabled={taken}
                          style={{
                            padding: '8px 14px', borderRadius: '10px', fontSize: '15px',
                            fontWeight: '600', cursor: taken ? 'default' : 'pointer',
                            backgroundColor: taken ? '#ECFDF5' : '#FFF7ED',
                            border: `2px solid ${taken ? '#6EE7B7' : '#FDBA74'}`,
                            color: taken ? '#065F46' : '#9A3412',
                            transition: 'all 0.2s',
                          }}
                        >
                          {taken ? '✅' : '⏰'} {time} {taken ? '已吃' : '点我吃药'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* 与AI对话按钮 */}
              <button
                onClick={handleMedicationChat}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px',
                  backgroundColor: '#FF6B35', color: 'white',
                  border: 'none', cursor: 'pointer',
                  fontSize: '16px', fontWeight: 'bold',
                  marginTop: '8px',
                }}
              >
                🗣️ 问问小棉袄用药建议
              </button>
            </div>
          )}
        </div>
      )}

      {/* 快捷操作按钮 */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', justifyContent: 'center' }}>
        {ACTIONS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleAction(item.action)}
            disabled={disabled}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              minWidth: '64px', background: 'white', borderRadius: '12px', padding: '12px 8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #E5E7EB',
              cursor: 'pointer', opacity: disabled ? 0.5 : 1,
            }}
          >
            <span style={{ fontSize: '24px' }}>{item.icon}</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#666' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
