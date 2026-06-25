import { NextResponse } from 'next/server';
import {
  getAllMedications,
  getActiveMedications,
  createMedication,
  updateMedication,
  deleteMedication,
  getMedicationById,
} from '@/lib/medication-store';

// GET /api/medication?userId=elder-001&active=true
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'elder-001';
    const activeOnly = searchParams.get('active') === 'true';

    const meds = activeOnly
      ? getActiveMedications(userId)
      : getAllMedications(userId);

    return NextResponse.json({
      success: true,
      medications: meds,
      total: meds.length,
    });
  } catch (error) {
    console.error('获取用药列表失败:', error);
    return NextResponse.json(
      { error: '获取用药列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/medication - 添加新药
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 'elder-001', name, dosage, times, startDate, endDate, notes } = body;

    if (!name || !dosage || !times || !startDate) {
      return NextResponse.json(
        { error: '请填写完整的药品信息（名称、剂量、时间、开始日期）' },
        { status: 400 }
      );
    }

    const medication = createMedication({
      userId,
      name,
      dosage,
      times: Array.isArray(times) ? times : [times],
      startDate,
      endDate: endDate || undefined,
      isActive: true,
      notes: notes || undefined,
    });

    return NextResponse.json({
      success: true,
      message: `已添加用药提醒: ${name}`,
      medication,
    });
  } catch (error) {
    console.error('添加用药失败:', error);
    return NextResponse.json(
      { error: '添加用药失败，请重试' },
      { status: 500 }
    );
  }
}

// PUT /api/medication - 更新用药（通过 body.id 传入）
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: '缺少药品ID' },
        { status: 400 }
      );
    }

    // 确保 times 是数组
    if (updateData.times && !Array.isArray(updateData.times)) {
      updateData.times = [updateData.times];
    }

    const medication = updateMedication(id, updateData);
    if (!medication) {
      return NextResponse.json(
        { error: '未找到该药品' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `已更新用药信息: ${medication.name}`,
      medication,
    });
  } catch (error) {
    console.error('更新用药失败:', error);
    return NextResponse.json(
      { error: '更新用药失败，请重试' },
      { status: 500 }
    );
  }
}

// DELETE /api/medication?id=xxx
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '缺少药品ID' },
        { status: 400 }
      );
    }

    const med = getMedicationById(id);
    if (!med) {
      return NextResponse.json(
        { error: '未找到该药品' },
        { status: 404 }
      );
    }

    deleteMedication(id);

    return NextResponse.json({
      success: true,
      message: `已删除用药: ${med.name}`,
    });
  } catch (error) {
    console.error('删除用药失败:', error);
    return NextResponse.json(
      { error: '删除用药失败，请重试' },
      { status: 500 }
    );
  }
}
