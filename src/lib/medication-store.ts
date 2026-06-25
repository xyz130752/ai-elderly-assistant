// 内存模拟数据库 - 用药管理
// 后续可替换为 Prisma + PostgreSQL

export interface MedicationRecord {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  times: string[]; // ["08:00", "12:00", "20:00"]
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export interface MedicationLogRecord {
  id: string;
  medicationId: string;
  userId: string;
  scheduledTime: string; // "08:00"
  actualTime: string;    // ISO datetime
  status: 'TAKEN' | 'MISSED' | 'SKIPPED';
  date: string;          // "2024-01-15"
  createdAt: string;
}

// 内存存储
const medications: Map<string, MedicationRecord> = new Map();
const medicationLogs: Map<string, MedicationLogRecord> = new Map();

// 初始化种子数据
function seedData() {
  const userId = 'elder-001';

  const seedMeds: MedicationRecord[] = [
    {
      id: 'med-001',
      userId,
      name: '降压药（氨氯地平）',
      dosage: '1片（5mg）',
      times: ['08:00', '20:00'],
      startDate: '2024-01-01',
      isActive: true,
      notes: '饭后服用，不要忘记',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'med-002',
      userId,
      name: '降糖药（二甲双胍）',
      dosage: '1片（500mg）',
      times: ['07:30', '12:00', '18:00'],
      startDate: '2024-01-01',
      isActive: true,
      notes: '饭前半小时服用',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'med-003',
      userId,
      name: '降脂药（阿托伐他汀）',
      dosage: '1片（20mg）',
      times: ['21:00'],
      startDate: '2024-01-01',
      isActive: true,
      notes: '睡前服用',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'med-004',
      userId,
      name: '阿司匹林',
      dosage: '1片（100mg）',
      times: ['08:00'],
      startDate: '2024-01-01',
      isActive: true,
      notes: '饭后服用，预防血栓',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ];

  seedMeds.forEach((med) => medications.set(med.id, med));

  // 添加一些今天的服药记录（模拟早上已吃过的情况）
  const today = new Date().toISOString().split('T')[0];
  const seedLogs: MedicationLogRecord[] = [
    {
      id: 'log-001',
      medicationId: 'med-001',
      userId,
      scheduledTime: '08:00',
      actualTime: `${today}T08:05:00Z`,
      status: 'TAKEN',
      date: today,
      createdAt: `${today}T08:05:00Z`,
    },
    {
      id: 'log-002',
      medicationId: 'med-002',
      userId,
      scheduledTime: '07:30',
      actualTime: `${today}T07:35:00Z`,
      status: 'TAKEN',
      date: today,
      createdAt: `${today}T07:35:00Z`,
    },
    {
      id: 'log-003',
      medicationId: 'med-004',
      userId,
      scheduledTime: '08:00',
      actualTime: `${today}T08:10:00Z`,
      status: 'TAKEN',
      date: today,
      createdAt: `${today}T08:10:00Z`,
    },
  ];

  seedLogs.forEach((log) => medicationLogs.set(log.id, log));
}

// 初始化
seedData();

// ========= Medication CRUD =========

export function getAllMedications(userId: string): MedicationRecord[] {
  return Array.from(medications.values()).filter((m) => m.userId === userId);
}

export function getActiveMedications(userId: string): MedicationRecord[] {
  return Array.from(medications.values()).filter(
    (m) => m.userId === userId && m.isActive
  );
}

export function getMedicationById(id: string): MedicationRecord | undefined {
  return medications.get(id);
}

export function createMedication(data: Omit<MedicationRecord, 'id' | 'createdAt'>): MedicationRecord {
  const id = `med-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const record: MedicationRecord = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };
  medications.set(id, record);
  return record;
}

export function updateMedication(id: string, data: Partial<MedicationRecord>): MedicationRecord | undefined {
  const existing = medications.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...data, id }; // id 不可变
  medications.set(id, updated);
  return updated;
}

export function deleteMedication(id: string): boolean {
  return medications.delete(id);
}

// ========= Medication Log =========

export function getMedicationLogs(userId: string, date: string): MedicationLogRecord[] {
  return Array.from(medicationLogs.values()).filter(
    (l) => l.userId === userId && l.date === date
  );
}

export function recordMedicationTaken(
  medicationId: string,
  userId: string,
  scheduledTime: string
): MedicationLogRecord {
  const today = new Date().toISOString().split('T')[0];
  const id = `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const record: MedicationLogRecord = {
    id,
    medicationId,
    userId,
    scheduledTime,
    actualTime: new Date().toISOString(),
    status: 'TAKEN',
    date: today,
    createdAt: new Date().toISOString(),
  };
  medicationLogs.set(id, record);
  return record;
}

// 获取今日用药状态概览（供AI使用）
export function getMedicationSummary(userId: string): string {
  const today = new Date().toISOString().split('T')[0];
  const activeMeds = getActiveMedications(userId);
  const todayLogs = getMedicationLogs(userId, today);

  if (activeMeds.length === 0) {
    return '该用户目前没有需要服用的药物。';
  }

  let summary = `该用户今日用药清单（共${activeMeds.length}种药）：\n\n`;

  for (const med of activeMeds) {
    const times = med.times as string[];
    summary += `💊 ${med.name} - ${med.dosage}\n`;
    summary += `   服用时间: ${times.join('、')}\n`;
    if (med.notes) summary += `   备注: ${med.notes}\n`;

    // 检查每个时间点的服药状态
    for (const time of times) {
      const log = todayLogs.find(
        (l) => l.medicationId === med.id && l.scheduledTime === time
      );
      if (log) {
        summary += `   ⏰ ${time} → ✅ 已服药\n`;
      } else {
        // 判断是否已过时间
        const [h, m] = time.split(':').map(Number);
        const now = new Date();
        const scheduled = new Date();
        scheduled.setHours(h, m, 0, 0);
        if (now > scheduled) {
          summary += `   ⏰ ${time} → ❌ 已过时间，未服药\n`;
        } else {
          summary += `   ⏰ ${time} → ⏳ 待服药\n`;
        }
      }
    }
    summary += '\n';
  }

  return summary;
}
