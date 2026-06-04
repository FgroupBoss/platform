import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSpeechOptions {
  rate?: number;
  onEnd?: () => void;
}

export function useSpeech() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [supported]);

  const speak = useCallback((text: string, options?: UseSpeechOptions) => {
    if (!supported || !text.trim()) return;
    cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = options?.rate ?? 0.85;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      options?.onEnd?.();
    };
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [supported, cancel]);

  const speakLines = useCallback((lines: string[], options?: UseSpeechOptions) => {
    if (!lines.length) return;
    let index = 0;
    const next = () => {
      if (index >= lines.length) {
        options?.onEnd?.();
        return;
      }
      speak(lines[index], {
        rate: options?.rate,
        onEnd: () => {
          index += 1;
          next();
        },
      });
    };
    next();
  }, [speak]);

  useEffect(() => () => cancel(), [cancel]);

  return { speak, speakLines, cancel, isSpeaking, supported };
}
