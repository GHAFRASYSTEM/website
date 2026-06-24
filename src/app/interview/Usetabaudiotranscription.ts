'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MicVAD } from '@ricky0123/vad-web';

export interface TranscriptEntry {
  id: string;
  text: string;
  translation: string | null;
  translating?: boolean;
  timestamp: number;
  isQuestion: boolean;
  answer: string;
  /** English translation of the answer — populated same time as translation */
  answerTranslation: string | null;
}

interface UseTabAudioTranscriptionOptions {
  transcribeUrl: string;
  translateUrl: string;
  authToken: string;
  silenceMs?: number;
  minSpeechMs?: number;
  onTranscript?: (entry: TranscriptEntry) => void;
  onError?: (error: Error) => void;
}

const VAD_SAMPLE_RATE = 16000;

export function useTabAudioTranscription({
  transcribeUrl,
  translateUrl,
  authToken,
  silenceMs = 800,
  minSpeechMs = 300,
  onTranscript,
  onError,
}: UseTabAudioTranscriptionOptions) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const tabStreamRef = useRef<MediaStream | null>(null);
  const vadRef = useRef<MicVAD | null>(null);
  const authTokenRef = useRef(authToken);
  authTokenRef.current = authToken;

  const handleError = useCallback((err: unknown, context: string) => {
    const message = err instanceof Error ? err.message : String(err);
    const fullMsg = `${context}: ${message}`;
    console.error(`🚨 [Transcription] ${fullMsg}`, err);
    setError(fullMsg);
    onError?.(err instanceof Error ? err : new Error(message));
  }, [onError]);

  // ── Translation — single Groq call translates both question + answer ──────
  const fetchTranslation = useCallback(async (entryId: string, text: string, answer: string) => {
    if (!text.trim()) return;
    try {
      const res = await fetch(translateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokenRef.current}`,
        },
        // Send answer alongside so backend can translate both in one Groq call
        body: JSON.stringify({ text, answerText: answer || undefined }),
      });
      if (!res.ok) return;
      const json = await res.json();
      // Backend returns { data: { translation, answerTranslation? } }
      const translation: string = (json?.data?.translation ?? '').trim();
      const answerTranslation: string = (json?.data?.answerTranslation ?? '').trim();

      setTranscript((prev) =>
        prev.map((e) =>
          e.id === entryId
            ? {
                ...e,
                translation: translation || null,
                answerTranslation: answerTranslation || null,
                translating: false,
              }
            : e,
        ),
      );
    } catch {
      setTranscript((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, translating: false } : e)),
      );
    }
  }, [translateUrl]);

  // ── Core upload — one call per completed speech segment ──────────────────
  const uploadSegment = useCallback(async (audio: Float32Array) => {
    if (!authTokenRef.current) {
      handleError(new Error('Authentication required'), 'Auth');
      return;
    }
    const wavBlob = encodeWav(audio, VAD_SAMPLE_RATE);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', wavBlob, 'segment.wav');

      const res = await fetch(transcribeUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authTokenRef.current}` },
        body: formData,
      });

      if (res.status === 401) throw new Error('Unauthorized');
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const text: string = (data.text ?? '').trim();
      const isQuestion: boolean = Boolean(data.isQuestion);
      const answer: string = (data.answer ?? '').trim();

      if (text) {
        const entry: TranscriptEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          text,
          translation: null,
          answerTranslation: null,
          translating: true,
          timestamp: Date.now(),
          isQuestion,
          answer,
        };
        setTranscript((prev) => [...prev, entry]);
        onTranscript?.(entry);
        // Pass answer too — backend translates both in one shot
        void fetchTranslation(entry.id, text, answer);
      }
    } catch (err) {
      handleError(err, 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [transcribeUrl, onTranscript, handleError, fetchTranslation]);

  // ── Start ────────────────────────────────────────────────────────────────
  const start = useCallback(async () => {
    setError(null);
    if (!authTokenRef.current) {
      handleError(new Error('Authentication required'), 'Auth');
      return;
    }
    try {
      const tabStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const audioTracks = tabStream.getAudioTracks();
      if (audioTracks.length === 0) {
        tabStream.getTracks().forEach((t) => t.stop());
        handleError(
          new Error('No audio track. Make sure "Share tab audio" is enabled.'),
          'No audio',
        );
        return;
      }

      tabStreamRef.current = tabStream;
      tabStream.getVideoTracks().forEach((t) => t.stop());
      const audioOnlyStream = new MediaStream(audioTracks);

      const vad = await MicVAD.new({
        getStream: async () => audioOnlyStream,
        pauseStream: async () => {},
        resumeStream: async () => audioOnlyStream,
        baseAssetPath: '/vad/',
        onnxWASMBasePath: '/vad/',
        redemptionMs: silenceMs,
        minSpeechMs,
        model: 'v5',
        onSpeechStart: () => setIsSpeechActive(true),
        onVADMisfire: () => setIsSpeechActive(false),
        onSpeechEnd: (audio: Float32Array) => {
          setIsSpeechActive(false);
          void uploadSegment(audio);
        },
      });

      vadRef.current = vad;
      vad.start();
      setIsCapturing(true);
      audioTracks[0].addEventListener('ended', () => stop());
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') return;
      handleError(err, 'Failed to start tab capture');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [silenceMs, minSpeechMs, uploadSegment, handleError]);

  // ── Stop ─────────────────────────────────────────────────────────────────
const stop = useCallback(() => {
  if (vadRef.current) {
    try { vadRef.current.pause(); } catch { /* ignore */ }
    vadRef.current.destroy();
    vadRef.current = null;
  }
  tabStreamRef.current?.getTracks().forEach((t) => t.stop());
  tabStreamRef.current = null;
  setIsCapturing(false);
  setIsSpeechActive(false);

  // Clear server-side session memory for this user
  void fetch(`${transcribeUrl.replace('/transcribe', '/session')}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authTokenRef.current}` },
  }).catch(() => { /* non-blocking — if it fails, memory just persists until next start */ });
}, [transcribeUrl]);

  useEffect(() => {
    return () => {
      vadRef.current?.destroy();
      tabStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const clear = useCallback(() => {
    setTranscript([]);
    setError(null);
  }, []);

  const fullText = useMemo(() => transcript.map((t) => t.text).join(' '), [transcript]);

  return { isCapturing, isSpeechActive, isUploading, transcript, fullText, error, start, stop, clear };
}

// ── WAV encoder ───────────────────────────────────────────────────────────────
function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}