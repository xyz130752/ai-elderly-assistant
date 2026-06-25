'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
}

interface MedRecord {
  id: string;
  medicationId: string;
  scheduledTime: string;
  status: string;
  date: string;
}

interface RecordData {
  date: string;
  logs: MedRecord[];
  statusMap: Record<string, Record<string, boolean>>;
  medications: { id: string; name: string; dosage: string; times: string[]; notes?: string }[];
}

const USER_ID = 'elder-001';

export default function ParentMedicationPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [recordData, setRecordData] = useState<RecordData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 表单状态
  const [formName, setFormName] = useState('');
  const [formDosage, setFormDosage] = useState('');
  const [formTimes, setFormTimes] = useState(['08:00']);
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  const fetchMedications = useCallback(async () => {
    try {
      const res = await fetch(`/api/medication?userId=${USER_ID}`);
      const data = await res.json();
      if (data.success) setMedications(data.medications);
    } catch (e) {
      console.error('获取用药列表失败:', e);
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch(`/api/medication/record?userId=${USER_ID}&date=${selectedDate}`);
      const data = await res.json();
      if (data.success) setRecordData(data);
    } catch (e) {
      console.error('获取服药记录失败:', e);
    }
  }, [selectedDate]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMedications(), fetchRecords()]).finally(() => setLoading(false));
  }, [fetchMedications, fetchRecords]);

  const resetForm = () => {
    setFormName('');
    setFormDosage('');
    setFormTimes(['08:00']);
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate('');
    setFormNotes('');
    setFormError('');
    setEditingId(null);
  };

  const handleAddTime = () => {
    setFormTimes([...formTimes, '12:00']);
  };

  const handleRemoveTime = (idx: number) => {
    if (formTimes.length <= 1) return;
    setFormTimes(formTimes.filter((_, i) => i !== idx));
  };

  const handleTimeChange = (idx: number, value: string) => {
    const updated = [...formTimes];
    updated[idx] = value;
    setFormTimes(updated);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) { setFormError('请输入药品名称'); return; }
    if (!formDosage.trim()) { setFormError('请输入剂量'); return; }
    if (formTimes.length === 0) { setFormError('请至少设置一个服药时间'); return; }
    setFormError('');

    try {
      const url = '/api/medication';
      const method = editingId ? 'PUT' : 'POST';
      const body: any = {
        userId: USER_ID,
        name: formName.trim(),
        dosage: formDosage.trim(),
        times: formTimes.sort(),
        startDate: formStartDate,
        notes: formNotes.trim() || undefined,
      };
      if (editingId) body.id = editingId;
      if (formEndDate) body.endDate = formEndDate;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddForm(false);
        resetForm();
        fetchMedications();
        fetchRecords();
      } else {
        setFormError(data.error || '操作失败');
      }
    } catch (e) {
      setFormError('网络错误，请重试');
    }
  };

  const handleEdit = (med: Medication) => {
    setEditingId(med.id);
    setFormName(med.name);
    setFormDosage(med.dosage);
    setFormTimes(med.times);
    setFormStartDate(med.startDate.split('T')[0]);
    setFormEndDate(med.endDate ? med.endDate.split('T')[0] : '');
    setFormNotes(med.notes || '');
    setFormError('');
    setShowAddForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除「${name}」吗？`)) return;
    try {
      const res = await fetch(`/api/medication?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchMedications();
        fetchRecords();
      }
    } catch (e) {
      alert('删除失败，请重试');
    }
  };

  const handleToggleActive = async (med: Medication) => {
    try {
      await fetch('/api/medication', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: med.id, isActive: !med.isActive }),
      });
      fetchMedications();
    } catch (e) {
      alert('操作失败');
    }
  };

  const getTimeStatus = (medId: string, time: string) => {
    if (!recordData?.statusMap?.[medId]) return 'pending';
    return recordData.statusMap[medId][time] ? 'taken' : 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', icon: '✅' };
      case 'pending': return { bg: '#FFF7ED', border: '#FDBA74', text: '#9A3412', icon: '⏳' };
      default: return { bg: '#F3F4F6', border: '#D1D5DB', text: '#374151', icon: '❓' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div style={{ fontSize: '48px', animation: 'pulse 1.5s infinite' }}>💊</div>
          <p className="text-gray-500 mt-2 text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header style={{ backgroundColor: '#FF6B35', color: 'white', padding: '16px' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/parent" style={{ color: 'white', textDecoration: 'none', fontSize: '24px' }}>←</Link>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>💊 用药管理</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowAddForm(true); }}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',
              border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer',
              fontSize: '16px', fontWeight: '500',
            }}
          >
            ＋ 添加药品
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        {/* 添加/编辑表单 */}
        {showAddForm && (
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '2px solid #FF6B35',
          }}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                {editingId ? '✏️ 编辑药品' : '➕ 添加新药品'}
              </h2>
              <button
                onClick={() => { setShowAddForm(false); resetForm(); }}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}
              >✕</button>
            </div>

            <div className="space-y-4">
              {/* 药品名称 */}
              <div>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  💊 药品名称 <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="例如：降压药（氨氯地平）"
                  style={{
                    width: '100%', padding: '12px 16px', fontSize: '16px',
                    borderRadius: '12px', border: '2px solid #E5E7EB', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 剂量 */}
              <div>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  📏 剂量 <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formDosage}
                  onChange={(e) => setFormDosage(e.target.value)}
                  placeholder="例如：1片（5mg）"
                  style={{
                    width: '100%', padding: '12px 16px', fontSize: '16px',
                    borderRadius: '12px', border: '2px solid #E5E7EB', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 服药时间 */}
              <div>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  ⏰ 服药时间 <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div className="space-y-2">
                  {formTimes.map((time, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(idx, e.target.value)}
                        style={{
                          padding: '10px 14px', fontSize: '16px',
                          borderRadius: '10px', border: '2px solid #E5E7EB', outline: 'none',
                        }}
                      />
                      {formTimes.length > 1 && (
                        <button
                          onClick={() => handleRemoveTime(idx)}
                          style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            backgroundColor: '#FEE2E2', color: '#EF4444',
                            border: 'none', cursor: 'pointer', fontSize: '18px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >✕</button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleAddTime}
                    style={{
                      padding: '8px 16px', borderRadius: '8px',
                      backgroundColor: '#EFF6FF', color: '#3B82F6',
                      border: '1px solid #BFDBFE', cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    ＋ 添加时间
                  </button>
                </div>
              </div>

              {/* 开始/结束日期 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: '16px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    📅 开始日期
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: '15px',
                      borderRadius: '10px', border: '2px solid #E5E7EB', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '16px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    📅 结束日期（可选）
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', fontSize: '15px',
                      borderRadius: '10px', border: '2px solid #E5E7EB', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* 备注 */}
              <div>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  📝 备注（可选）
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="例如：饭后服用、不要忘记"
                  rows={2}
                  style={{
                    width: '100%', padding: '12px 16px', fontSize: '16px',
                    borderRadius: '12px', border: '2px solid #E5E7EB', outline: 'none',
                    resize: 'vertical', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* 错误提示 */}
              {formError && (
                <div style={{ color: '#EF4444', fontSize: '14px', padding: '8px 12px', backgroundColor: '#FEF2F2', borderRadius: '8px' }}>
                  ⚠️ {formError}
                </div>
              )}

              {/* 提交按钮 */}
              <button
                onClick={handleSubmit}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  backgroundColor: '#FF6B35', color: 'white',
                  border: 'none', cursor: 'pointer',
                  fontSize: '18px', fontWeight: 'bold',
                }}
              >
                {editingId ? '✅ 保存修改' : '➕ 添加药品'}
              </button>
            </div>
          </div>
        )}

        {/* 用药列表 */}
        <section>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
            📋 用药清单 ({medications.length}种药)
          </h2>
          {medications.length === 0 ? (
            <div style={{
              backgroundColor: 'white', borderRadius: '16px', padding: '40px',
              textAlign: 'center', color: '#9CA3AF',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💊</div>
              <p style={{ fontSize: '18px' }}>还没有添加任何药品</p>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>点击上方"添加药品"开始管理用药</p>
            </div>
          ) : (
            <div className="space-y-3">
              {medications.map((med) => (
                <div
                  key={med.id}
                  style={{
                    backgroundColor: 'white', borderRadius: '16px', padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB',
                    opacity: med.isActive ? 1 : 0.5,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '24px' }}>💊</span>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1F2937' }}>
                          {med.name}
                        </h3>
                        {!med.isActive && (
                          <span style={{
                            fontSize: '12px', padding: '2px 8px', borderRadius: '4px',
                            backgroundColor: '#FEE2E2', color: '#EF4444',
                          }}>已停用</span>
                        )}
                      </div>
                      <div style={{ marginTop: '8px', color: '#6B7280', fontSize: '15px' }}>
                        <div>📏 剂量：{med.dosage}</div>
                        <div>⏰ 时间：{med.times.join('、')}</div>
                        {med.notes && <div>📝 备注：{med.notes}</div>}
                        <div>📅 开始：{med.startDate.split('T')[0]}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-3">
                      <button
                        onClick={() => handleToggleActive(med)}
                        style={{
                          padding: '6px 12px', borderRadius: '8px', fontSize: '13px',
                          backgroundColor: med.isActive ? '#FEF3C7' : '#ECFDF5',
                          color: med.isActive ? '#92400E' : '#065F46',
                          border: '1px solid', borderColor: med.isActive ? '#FDE68A' : '#6EE7B7',
                          cursor: 'pointer',
                        }}
                      >
                        {med.isActive ? '⏸ 暂停' : '▶ 启用'}
                      </button>
                      <button
                        onClick={() => handleEdit(med)}
                        style={{
                          padding: '6px 12px', borderRadius: '8px', fontSize: '13px',
                          backgroundColor: '#EFF6FF', color: '#3B82F6',
                          border: '1px solid #BFDBFE', cursor: 'pointer',
                        }}
                      >✏️ 编辑</button>
                      <button
                        onClick={() => handleDelete(med.id, med.name)}
                        style={{
                          padding: '6px 12px', borderRadius: '8px', fontSize: '13px',
                          backgroundColor: '#FEE2E2', color: '#EF4444',
                          border: '1px solid #FECACA', cursor: 'pointer',
                        }}
                      >🗑 删除</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 服药记录 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
              📊 服药记录
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px 12px', fontSize: '14px',
                borderRadius: '8px', border: '2px solid #E5E7EB', outline: 'none',
              }}
            />
          </div>

          {recordData && recordData.medications.length > 0 ? (
            <div style={{
              backgroundColor: 'white', borderRadius: '16px', padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB',
            }}>
              <div className="space-y-4">
                {recordData.medications.map((med) => (
                  <div key={med.id} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      💊 {med.name} <span style={{ fontWeight: 'normal', color: '#9CA3AF', fontSize: '14px' }}>{med.dosage}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {med.times.map((time) => {
                        const status = getTimeStatus(med.id, time);
                        const colors = getStatusColor(status);
                        return (
                          <div
                            key={time}
                            style={{
                              padding: '8px 14px', borderRadius: '10px',
                              backgroundColor: colors.bg, border: `1px solid ${colors.border}`,
                              color: colors.text, fontSize: '15px', fontWeight: '500',
                            }}
                          >
                            {colors.icon} {time}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* 统计 */}
              <div style={{
                marginTop: '16px', padding: '12px', backgroundColor: '#F9FAFB',
                borderRadius: '12px', textAlign: 'center',
              }}>
                {(() => {
                  let total = 0, taken = 0;
                  recordData.medications.forEach((med) => {
                    med.times.forEach((time) => {
                      total++;
                      if (getTimeStatus(med.id, time) === 'taken') taken++;
                    });
                  });
                  const pct = total > 0 ? Math.round((taken / total) * 100) : 0;
                  return (
                    <span style={{ fontSize: '16px', color: '#374151' }}>
                      📈 今日服药率：<strong style={{ color: pct === 100 ? '#059669' : '#F59E0B', fontSize: '20px' }}>{pct}%</strong>
                      {' '}（{taken}/{total}次）
                    </span>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white', borderRadius: '16px', padding: '30px',
              textAlign: 'center', color: '#9CA3AF',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>📊</div>
              <p>暂无{selectedDate}的服药记录</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
