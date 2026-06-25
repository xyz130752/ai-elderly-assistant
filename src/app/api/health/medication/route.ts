import { NextResponse } from 'next/server';
import { getActiveMedications, createMedication, recordMedicationTaken, getMedicationLogs } from '@/lib/medication-store';

// 用药提醒 - 兼容旧接口，重定向到新逻辑
export async function POST(req: Request) {
  try {
    const { action, medication, userId = 'elder-001' } = await req.json();

    switch (action) {
      case 'add': {
        const med = createMedication({
          userId,
          name: medication.name,
          dosage: medication.dosage,
          times: Array.isArray(medication.times) ? medication.times : [medication.times],
          startDate: medication.startDate || new Date().toISOString().split('T')[0],
          isActive: true,
          notes: medication.notes,
        });
        return NextResponse.json({
          success: true,
          message: `已添加用药提醒: ${med.name} ${med.dosage}`,
          medication: med,
        });
      }

      case 'list': {
        const meds = getActiveMedications(userId);
        return NextResponse.json({
          success: true,
          medications: meds,
        });
      }

      case 'toggle': {
        const today = new Date().toISOString().split('T')[0];
        if (medication?.id && medication?.time) {
          const log = recordMedicationTaken(medication.id, userId, medication.time);
          return NextResponse.json({
            success: true,
            message: '✅ 已记录服药！',
            log,
          });
        }
        return NextResponse.json({ success: false, message: '参数不完整' }, { status: 400 });
      }

      default:
        return NextResponse.json({ error: '未知操作' }, { status: 400 });
    }
  } catch (error) {
    console.error('用药提醒操作失败:', error);
    return NextResponse.json(
      { error: '操作失败，请重试' },
      { status: 500 }
    );
  }
}
