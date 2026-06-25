import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parse as parseYaml } from 'yaml';

const config = parseYaml(readFileSync(resolve(process.cwd(), 'config.yaml'), 'utf8'));
const MIMO_API_KEY = config.ai.apiKey;
const MIMO_BASE_URL = config.ai.baseUrl;
const MIMO_MODEL = config.ai.model;

export const ELDER_AI_SYSTEM = `你是小棉袄，一个专门服务老年人的AI助手。

你的能力：
1. 查天气：告诉老人天气情况和穿衣建议
2. 查路线：帮老人查从A到B怎么走
3. 找地点：帮老人找附近的医院、餐厅、药店等
4. 挂号：帮老人预约医院
5. 缴费：帮老人交水电煤话费
6. 叫车：帮老人叫出租车
7. 用药提醒
8. 防诈骗：识别可疑信息，保护老人

回复格式规则（非常重要）：
1. 不要使用Markdown表格语法（不要用|符号和:---）
2. 用药提醒用纯文本+emoji格式，例如：
   💊 今日用药提醒

   您今天有3种药要吃：

   1️⃣ 降压药
   ⏰ 早上8点
   ✅ 已吃

   2️⃣ 降糖药
   ⏰ 中午12点
   ⏳ 待吃

   3️⃣ 降脂药
   ⏰ 晚上8点
   ⏳ 待吃

   💡 温馨提示：中午12点的降糖药记得饭前半小时吃哦~
3. 每条信息用换行分隔，不要挤在一起
4. 用emoji让内容更生动，但不要过多
5. 用最简单的话，像家人聊天一样
6. 不要超过5句话`;

export const SCAM_CHECK_SYSTEM = `你是防诈骗专家。`;
export const HEALTH_REPORT_SYSTEM = `你是健康顾问，用大白话解读体检报告。`;

interface Message {
  role: string;
  content: string;
}

async function callMimo(messages: Message[], maxTokens = 512): Promise<string> {
  const response = await fetch(`${MIMO_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${MIMO_API_KEY}` },
    body: JSON.stringify({ model: MIMO_MODEL, messages, max_tokens: maxTokens, temperature: 0.7 }),
  });
  if (!response.ok) throw new Error("API error");
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function chatWithElder(messages: Message[], context?: string): Promise<string> {
  const sys = context ? `${ELDER_AI_SYSTEM}\n当前上下文: ${context}` : ELDER_AI_SYSTEM;
  return callMimo([{ role: "system", content: sys }, ...messages.map(m => ({ role: m.role, content: m.content }))], 512);
}

export async function chatWithElderWithContext(messages: Message[], mapData?: string): Promise<string> {
  let sys = ELDER_AI_SYSTEM;
  if (mapData) sys += `\n地图结果: ${mapData}`;
  return callMimo([{ role: "system", content: sys }, ...messages.map(m => ({ role: m.role, content: m.content }))], 800);
}

export async function checkScam(content: string): Promise<{ isScam: boolean; confidence: number; reason: string; suggestedAction: string }> {
  const r = await callMimo([{ role: "system", content: SCAM_CHECK_SYSTEM }, { role: "user", content }], 256);
  try { return JSON.parse(r); } catch { return { isScam: false, confidence: 0, reason: "解析失败", suggestedAction: "联系子女" }; }
}

export async function analyzeHealthReport(reportData: string): Promise<string> {
  return callMimo([{ role: "system", content: HEALTH_REPORT_SYSTEM }, { role: "user", content: reportData }], 1024);
}
