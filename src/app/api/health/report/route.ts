import { NextResponse } from 'next/server';
import { analyzeHealthReport } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const reportFile = formData.get('report') as File | null;
    const reportText = formData.get('text') as string | null;

    let reportData = '';

    if (reportFile) {
      // 读取文件内容（简化版，实际应使用PDF解析库）
      reportData = await reportFile.text();
    } else if (reportText) {
      reportData = reportText;
    } else {
      return NextResponse.json({ error: '请上传体检报告或输入报告内容' }, { status: 400 });
    }

    const analysis = await analyzeHealthReport(reportData);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('体检报告解读失败:', error);
    return NextResponse.json(
      { error: '解读失败，请重试' },
      { status: 500 }
    );
  }
}
