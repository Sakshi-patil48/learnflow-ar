import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Play, Square, Sparkles } from 'lucide-react';

interface VoiceAssistantProps {
  textToSpeak?: string;
  onSpeechResult?: (transcript: string) => void;
  className?: string;
  autoPlay?: boolean;
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const speak = (text: string) => {
    if (!isSupported || !text) return;

    window.speechSynthesis.cancel(); // Stop active speech

    // Clean markdown formatting before speaking
    const cleanText = text
      .replace(/[*_#$`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\\/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { speak, stop, isSpeaking, isSupported };
}

export function useSpeechToText(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onstart = () => setIsListening(true);
        recog.onend = () => setIsListening(false);
        recog.onerror = () => setIsListening(false);

        recog.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (event.results[0].isFinal) {
            onResult(transcript);
          }
        };

        setRecognition(recog);
      }
    }
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (e) {
        console.error("Speech recognition start failed", e);
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      try {
        recognition.stop();
      } catch (e) {
        console.error("Speech recognition stop failed", e);
      }
    }
  };

  return { startListening, stopListening, isListening, isSupported };
}

export default function VoiceAssistant({
  textToSpeak,
  onSpeechResult,
  className = '',
  autoPlay = false
}: VoiceAssistantProps) {
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const { startListening, stopListening, isListening, isSupported: sttSupported } = useSpeechToText((transcript) => {
    if (onSpeechResult) onSpeechResult(transcript);
  });

  useEffect(() => {
    if (autoPlay && textToSpeak) {
      speak(textToSpeak);
    }
    return () => {
      stop();
    };
  }, [textToSpeak]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Text To Speech Trigger */}
      {textToSpeak && ttsSupported && (
        <button
          onClick={() => {
            if (isSpeaking) {
              stop();
            } else {
              speak(textToSpeak);
            }
          }}
          title={isSpeaking ? "Stop Voice Audio" : "Listen to Explanation"}
          className={`p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            isSpeaking
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
              : 'bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 border border-indigo-500/30'
          }`}
        >
          {isSpeaking ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Voice</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Read Aloud</span>
            </>
          )}
        </button>
      )}

      {/* Speech To Text Trigger */}
      {onSpeechResult && sttSupported && (
        <button
          onClick={() => {
            if (isListening) {
              stopListening();
            } else {
              startListening();
            }
          }}
          title={isListening ? "Listening... Click to stop" : "Speak to AI Tutor"}
          className={`p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white border border-rose-500 animate-ping'
              : 'bg-purple-600/10 text-purple-400 hover:bg-purple-600/20 border border-purple-500/30'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Listening...</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Dictation</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
