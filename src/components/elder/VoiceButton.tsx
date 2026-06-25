'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface VoiceButtonProps {
  onRecordingStart: () => void;
  onRecordingStop: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export function VoiceButton({ onRecordingStart, onRecordingStop, disabled }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    if (disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const updateLevel = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(average / 255);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      mediaRecorder.start();
      setIsRecording(true);
      onRecordingStart();
      updateLevel();
    } catch (error) {
      console.error('录音失败:', error);
      alert('请允许麦克风权限后重试');
    }
  }, [disabled, onRecordingStart]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
      cancelAnimationFrame(animFrameRef.current);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          onRecordingStop(e.data);
        }
      };

      // 停止所有音轨
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
  }, [isRecording, onRecordingStop]);

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        className={`w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold
          ${disabled ? 'bg-gray-300 cursor-not-allowed' : ''}
          ${isRecording ? 'bg-red-500 text-white' : 'bg-primary text-white hover:bg-primary-dark'}
          transition-colors shadow-lg`}
        whileTap={{ scale: 0.95 }}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording}
        disabled={disabled}
      >
        {isRecording ? (
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-1">🎙️</span>
            <span className="text-sm">松开结束</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-1">🎤</span>
            <span className="text-sm">按住说话</span>
          </div>
        )}
      </motion.button>

      {/* 音频波形 */}
      {isRecording && (
        <div className="flex gap-1 h-8 items-end">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-primary rounded-full voice-wave-bar"
              style={{
                height: `${8 + audioLevel * 24}px`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}

      {disabled && (
        <p className="text-sm text-gray-400">请稍候...</p>
      )}
    </div>
  );
}
