import { NextResponse } from 'next/server';
import { getMedicationLogs, recordMedicationTaken, getActiveMedications } from '@/lib/medication-store';

// GET /api/medication/record?userId=elder-001&date=2024-01-15
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'elder-001';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const logs = getMedicationLogs(userId, date);
    const medications = getActiveMedications(userId);

    // 组装每个药品在当天各时间点的服药状态
    const statusMap: Record<string, Record<string, boolean>> = {};
    for (const med of medications) {
      statusMap[med.id] = {};
      const times = med.times as string[];
      for (const time of times) {
        const log = logs.find(
          (l) => l.medicationId === med.id && l.scheduledTime === time
        );
        statusMap[med.id][time] = !!log;
      }
    }

    return NextResponse.json({
      success: true,
      date,
      logs,
      statusMap,
      medications: medications.map((m) => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        times: m.times,
        notes: m.notes,
      })),
    });
  } catch (error) {
    console.error('获取服药记录失败:', error);
    return NextResponse.json(
      { error: '获取服药记录失败' },
      { status: 500 }
    );
  }
}

// POST /api/medication/record - 记录服药
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { medicationId, userId = 'elder-001', scheduledTime } = body;

    if (!medicationId || !scheduledTime) {
      return NextResponse.json(
        { error: '请提供药品ID和服药时间' },
        { status: 400 }
      );
    }

    // 检查是否已经记录过
    const today = new Date().toISOString().split('T')[0];
    const existingLogs = getMedicationLogs(userId, today);
    const alreadyTaken = existingLogs.find(
      (l) => l.medicationId === medicationId && l.scheduledTime === scheduledTime
    );

    if (alreadyTaken) {
      return NextResponse.json({
        success: true,
        message: '该药品在此时间点已经记录过服药了',
        log: alreadyTaken,
      });
    }

    const log = recordMedicationTaken(medicationId, userId, scheduledTime);

    return NextResponse.json({
      success: true,
      message: '✅ 已记录服药！',
      log,
    });
  } catch (error) {
    console.error('记录服药失败:', error);
    return NextResponse.json(
      { error: '记录服药失败，请重试' },
      { status: 500 }
    );
  }
}
