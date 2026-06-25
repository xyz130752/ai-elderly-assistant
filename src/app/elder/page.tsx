'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { VoiceButton } from '@/components/elder/VoiceButton';
import { ResponseBubble } from '@/components/elder/ResponseBubble';
import { QuickActions } from '@/components/elder/QuickActions';
import type { ChatMessage } from '@/types';

const TAXI_STEPS = [
  { icon: '🔍', text: '正在搜索附近车辆...', delay: 1500 },
  { icon: '🚗', text: '正在呼叫司机...', delay: 2000 },
  { icon: '✅', text: '司机已接单！王师傅，车牌 粤B·12345', delay: 2500 },
  { icon: '📍', text: '司机正在赶来，预计3分钟到达上车点', delay: 3000 },
  { icon: '📱', text: '司机即将到达，请到路边等候', delay: 0 },
];

export default function ElderPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [taxiStep, setTaxiStep] = useState(-1);
  const [taxiActive, setTaxiActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const taxiCardRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 叫车进度自动推进
  useEffect(() => {
    if (!taxiActive || taxiStep < 0 || taxiStep >= TAXI_STEPS.length) return;
    const step = TAXI_STEPS[taxiStep];
    setTimeout(() => {
      taxiCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    if (step.delay === 0) return;
    const timer = setTimeout(() => setTaxiStep(taxiStep + 1), step.delay);
    return () => clearTimeout(timer);
  }, [taxiStep, taxiActive]);

  const startTaxiProgress = useCallback(() => {
    setTaxiActive(true);
    setTaxiStep(0);
  }, []);

  const stopTaxiProgress = useCallback(() => {
    setTaxiActive(false);
    setTaxiStep(-1);
  }, []);

  // 发送消息给AI
  const sendToAI = useCallback(async (userMsg: ChatMessage) => {
    setIsProcessing(true);
    try {
      const chatRes = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const chatData = await chatRes.json();

      const assistantReply = chatData.response as string;
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantReply }]);
      setTimeout(scrollToBottom, 100);

      // 只有AI确认已叫车时才启动进度
      if (!taxiActive && (
        assistantReply.includes('已接单') ||
        assistantReply.includes('车牌') ||
        assistantReply.includes('叫好啦') ||
        assistantReply.includes('叫了车') ||
        assistantReply.includes('请注意手机') ||
        assistantReply.includes('上车前')
      )) {
        setTimeout(() => startTaxiProgress(), 800);
      }

      if (chatData.audioUrl) {
        setIsSpeaking(true);
        audioRef.current = new Audio(chatData.audioUrl);
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.play();
      }
    } catch (error) {
      console.error('AI对话失败:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: '出了点问题，稍后再试试' }]);
    } finally {
      setIsProcessing(false);
    }
  }, [messages, taxiActive, startTaxiProgress]);

  // 文字发送
  const handleTextSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || isProcessing) return;
    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setTimeout(scrollToBottom, 100);
    sendToAI(userMessage);
  }, [inputText, isProcessing, sendToAI]);

  // 语音输入
  const handleVoiceInput = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      const voiceRes = await fetch('/api/voice/recognize', { method: 'POST', body: formData });
      const voiceData = await voiceRes.json();

      if (!voiceData.text) {
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: '(未能识别语音)' },
          { role: 'assistant', content: '没听清，您能再说一遍吗？' },
        ]);
        setIsProcessing(false);
        return;
      }

      const userMessage: ChatMessage = { role: 'user', content: voiceData.text };
      setMessages((prev) => [...prev, userMessage]);
      setTimeout(scrollToBottom, 100);
      await sendToAI(userMessage);
    } catch (error) {
      console.error('语音处理失败:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: '出了点问题，稍后再试试' }]);
      setIsProcessing(false);
    }
  }, [sendToAI]);

  // 快捷操作 — 叫车不启动进度，等AI确认后再启动
  const handleQuickAction = useCallback(async (action: string) => {
    const userMessage: ChatMessage = { role: 'user', content: action };
    setMessages((prev) => [...prev, userMessage]);
    setTimeout(scrollToBottom, 100);
    sendToAI(userMessage);
  }, [sendToAI]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col elder-ui">
      {/* Header */}
      <header style={{ backgroundColor: '#FF6B35', color: 'white', padding: '16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>🧡 小棉袄</h1>
        <p style={{ fontSize: '14px', opacity: 0.8, margin: '4px 0 0' }}>有什么需要帮忙的？</p>
      </header>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.length === 0 && !taxiActive && (
          <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '80px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎤</div>
            <p style={{ fontSize: '20px' }}>按住按钮说话，或者打字告诉我</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>试试说"今天天气怎么样"</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, i) => (
            <ResponseBubble key={i} message={msg} />
          ))}
        </div>

        {/* 叫车进度卡片 */}
        {taxiActive && taxiStep >= 0 && taxiStep < TAXI_STEPS.length && (
          <div
            ref={taxiCardRef}
            style={{
              marginTop: '16px',
              background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)',
              borderRadius: '16px',
              padding: '20px',
              border: '3px solid #FF6B35',
              boxShadow: '0 4px 20px rgba(255,107,53,0.2)',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FF6B35', marginBottom: '12px' }}>
              🚕 叫车服务
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', animation: 'bounce 1s infinite' }}>
                {TAXI_STEPS[taxiStep].icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', lineHeight: 1.4 }}>
                  {TAXI_STEPS[taxiStep].text}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              {TAXI_STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '8px',
                    flex: 1,
                    borderRadius: '4px',
                    backgroundColor: i <= taxiStep ? '#FF6B35' : '#E5E7EB',
                    transition: 'all 0.5s ease',
                  }}
                />
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF' }}>
              {taxiStep + 1} / {TAXI_STEPS.length}
            </div>
            {taxiStep === TAXI_STEPS.length - 1 && (
              <button
                onClick={stopTaxiProgress}
                style={{
                  marginTop: '16px',
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#FF6B35',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                ✅ 已上车，关闭提示
              </button>
            )}
          </div>
        )}

        {isProcessing && (
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <div style={{ display: 'inline-block', background: '#F3F4F6', borderRadius: '16px', padding: '12px 24px', color: '#6B7280' }}>
              <span style={{ animation: 'pulse 1.5s infinite' }}>正在思考...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <QuickActions onSelect={handleQuickAction} disabled={isProcessing} />

      {/* 底部输入区 */}
      <div style={{
        position: 'sticky', bottom: 0, background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)', padding: '16px', borderTop: '1px solid #E5E7EB',
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSend()}
            placeholder="打字告诉我..."
            disabled={isProcessing}
            style={{
              flex: 1, padding: '12px 16px', fontSize: '18px',
              borderRadius: '24px', border: '2px solid #E5E7EB', outline: 'none',
            }}
          />
          <button
            onClick={handleTextSend}
            disabled={!inputText.trim() || isProcessing}
            style={{
              width: '52px', height: '52px', borderRadius: '50%',
              backgroundColor: inputText.trim() ? '#FF6B35' : '#D1D5DB',
              color: 'white', fontSize: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}
          >
            ➤
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <VoiceButton
            onRecordingStart={() => {}}
            onRecordingStop={handleVoiceInput}
            disabled={isProcessing || isSpeaking}
          />
        </div>
      </div>
    </div>
  );
}
