'use client'
import { useAuth } from '../../../context/AuthContext';
import { useTabAudioTranscription, type TranscriptEntry } from './Usetabaudiotranscription';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

type ViewMode = 'both' | 'fr' | 'en';

export default function InterviewPage() {
  const { user, accessToken, signOut, loading } = useAuth();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('both');

  const frScrollRef = useRef<HTMLDivElement>(null);
  const enScrollRef = useRef<HTMLDivElement>(null);
  const syncingRef = useRef(false);

  const syncScroll = (source: 'fr' | 'en') => (e: React.UIEvent<HTMLDivElement>) => {
    if (syncingRef.current || viewMode !== 'both') return;
    syncingRef.current = true;
    const target = source === 'fr' ? enScrollRef.current : frScrollRef.current;
    if (target) {
      const el = e.currentTarget;
      const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      target.scrollTop = ratio * (target.scrollHeight - target.clientHeight);
    }
    requestAnimationFrame(() => { syncingRef.current = false; });
  };

  const {
    isCapturing, isSpeechActive, isUploading,
    transcript, fullText, error, start, stop, clear,
  } = useTabAudioTranscription({
    transcribeUrl: `${API_URL}/interview/transcribe`,
    translateUrl:  `${API_URL}/interview/translate`,
    authToken: accessToken || '', 
    silenceMs: 800,
  });

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [loading, user, router]);


  const handleCopy = async () => {
    if (fullText) await navigator.clipboard.writeText(fullText);
  };

  const status = !isCapturing ? null
    : isUploading    ? { label: '⏳ Processing…',       dot: 'bg-cyan-400 animate-pulse' }
    : isSpeechActive ? { label: '🎧 Listening…',        dot: 'bg-emerald-400 animate-pulse' }
    :                  { label: '… Waiting for speech', dot: 'bg-gray-600' };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-gray-500 text-sm">Loading…</div>;
  }
  if (!user) return null;

  const reversed = [...transcript].reverse();
  const showFR = viewMode === 'both' || viewMode === 'fr';
  const showEN = viewMode === 'both' || viewMode === 'en';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase">Interview Assistant</span>
          {status && (
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <span className="text-xs text-gray-400">{status.label}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{user.email}</span>
          <button onClick={() => signOut()} className="text-xs text-gray-400 hover:text-gray-200 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-800 bg-gray-900/50 flex-wrap">
        {!isCapturing ? (
          <button onClick={start} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors">
            <span className="w-2 h-2 rounded-full bg-white/80" />
            Start Capture
          </button>
        ) : (
          <button onClick={stop} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Stop
          </button>
        )}
        <button onClick={clear} disabled={transcript.length === 0} className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 disabled:opacity-30 transition-colors">
          Clear
        </button>
        <button onClick={handleCopy} disabled={!fullText} className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 disabled:opacity-30 transition-colors">
          Copy FR
        </button>

        <div className="flex-1" />

        {/* View mode pill */}
        <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
          {(['fr', 'both', 'en'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === mode ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {mode === 'fr' ? '🇫🇷 FR' : mode === 'en' ? '🇬🇧 EN' : '🌐 Both'}
            </button>
          ))}
        </div>

        {isCapturing && (
          <span className="text-xs text-gray-500">
            {transcript.length} segment{transcript.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && (
        <div className="mx-6 mt-3 px-4 py-3 rounded-lg bg-red-950 border border-red-800 text-red-300 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ── Columns ─────────────────────────────────────────────────────── */}
      <div className={`flex flex-1 min-h-0 gap-0 px-6 pt-4 pb-6 ${viewMode !== 'both' ? 'justify-center' : ''}`}>

        {/* French column */}
        {showFR && (
          <div className={`flex flex-col min-w-0 ${viewMode === 'both' ? 'flex-1 pr-3' : 'w-full max-w-2xl'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Français</span>
              <span className="flex-1 h-px bg-gray-800" />
            </div>
            <div
              ref={frScrollRef}
              onScroll={syncScroll('fr')}
              className="flex-1 overflow-y-auto space-y-3 pr-1 scroll-smooth"
              style={{ maxHeight: 'calc(100vh - 210px)' }}
            >
              {transcript.length === 0
                ? <EmptyState lang="fr" isCapturing={isCapturing} />
                : reversed.map((entry) => <TranscriptCardFR key={entry.id} entry={entry} />)
              }
            </div>
          </div>
        )}

        {viewMode === 'both' && <div className="w-px bg-gray-800 self-stretch mx-1" />}

        {/* English column */}
        {showEN && (
          <div className={`flex flex-col min-w-0 ${viewMode === 'both' ? 'flex-1 pl-3' : 'w-full max-w-2xl'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">English</span>
              <span className="flex-1 h-px bg-gray-800" />
            </div>
            <div
              ref={enScrollRef}
              onScroll={syncScroll('en')}
              className="flex-1 overflow-y-auto space-y-3 pl-1 scroll-smooth"
              style={{ maxHeight: 'calc(100vh - 210px)' }}
            >
              {transcript.length === 0
                ? <EmptyState lang="en" isCapturing={isCapturing} />
                : reversed.map((entry) => <TranscriptCardEN key={entry.id} entry={entry} />)
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared spinner ────────────────────────────────────────────────────────────
function Spinner({ color = 'border-gray-600 border-t-gray-300' }: { color?: string }) {
  return <span className={`w-3 h-3 rounded-full border-2 ${color} animate-spin inline-block`} />;
}

// ── French card ───────────────────────────────────────────────────────────────
function TranscriptCardFR({ entry }: { entry: TranscriptEntry }) {
  const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (!entry.isQuestion) {
    return (
      <div className="rounded-lg px-4 py-3 bg-gray-900 border border-gray-800 opacity-50">
        <div className="text-[10px] text-gray-600 mb-1 font-mono">{time}</div>
        <p className="text-sm text-gray-400 leading-relaxed">{entry.text}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-indigo-900/60">
      {/* Question */}
      <div className="px-4 py-3 bg-indigo-950/60 border-b border-indigo-900/40">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[9px] font-mono tracking-widest text-indigo-400 uppercase">Question</span>
          <span className="text-[9px] text-gray-600 font-mono">{time}</span>
        </div>
        <p className="text-sm text-indigo-100 leading-relaxed">{entry.text}</p>
      </div>
      {/* Answer */}
      {entry.answer ? (
        <div className="px-4 py-3 bg-emerald-950/40">
          <div className="text-[9px] font-mono tracking-widest text-emerald-500 uppercase mb-1.5">Réponse suggérée</div>
          <p className="text-sm text-emerald-100 leading-relaxed">{entry.answer}</p>
        </div>
      ) : (
        <div className="px-4 py-3 bg-amber-950/30">
          <p className="text-xs text-amber-600">Aucune réponse générée.</p>
        </div>
      )}
    </div>
  );
}

// ── English card ──────────────────────────────────────────────────────────────
function TranscriptCardEN({ entry }: { entry: TranscriptEntry }) {
  const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (!entry.isQuestion) {
    return (
      <div className="rounded-lg px-4 py-3 bg-gray-900 border border-gray-800 opacity-50">
        <div className="text-[10px] text-gray-600 mb-1 font-mono">{time}</div>
        {entry.translating ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-xs text-gray-600">Translating…</span>
          </div>
        ) : (
          <p className="text-sm text-gray-400 leading-relaxed">
            {entry.translation ?? <span className="italic text-gray-600">[no translation]</span>}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-violet-900/60">
      {/* Question — translated */}
      <div className="px-4 py-3 bg-violet-950/60 border-b border-violet-900/40">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[9px] font-mono tracking-widest text-violet-400 uppercase">Question</span>
          <span className="text-[9px] text-gray-600 font-mono">{time}</span>
        </div>
        {entry.translating ? (
          <div className="flex items-center gap-2 py-1">
            <Spinner color="border-violet-700 border-t-violet-300" />
            <span className="text-xs text-violet-600">Translating…</span>
          </div>
        ) : (
          <p className="text-sm text-violet-100 leading-relaxed">
            {entry.translation ?? <span className="italic text-violet-700">[translation unavailable]</span>}
          </p>
        )}
      </div>

      {/* Answer — translated */}
      {entry.answer ? (
        <div className="px-4 py-3 bg-teal-950/40">
          <div className="text-[9px] font-mono tracking-widest text-teal-500 uppercase mb-1.5">Suggested answer</div>
          {entry.translating ? (
            <div className="flex items-center gap-2 py-1">
              <Spinner color="border-teal-700 border-t-teal-300" />
              <span className="text-xs text-teal-600">Translating…</span>
            </div>
          ) : (
            <p className="text-sm text-teal-100 leading-relaxed">
              {/* Use answerTranslation if available, fall back to original answer */}
              {entry.answerTranslation ?? entry.answer}
            </p>
          )}
        </div>
      ) : (
        <div className="px-4 py-3 bg-amber-950/30">
          <p className="text-xs text-amber-600">No answer generated.</p>
        </div>
      )}
    </div>
  );
}

function EmptyState({ lang, isCapturing }: { lang: 'fr' | 'en'; isCapturing: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center">
      <div className="text-2xl mb-2 opacity-30">{lang === 'fr' ? '🎧' : '🌐'}</div>
      <p className="text-xs text-gray-600">
        {isCapturing
          ? lang === 'fr' ? 'En attente de parole…' : 'Waiting for speech…'
          : lang === 'fr' ? 'Démarrez la capture pour voir la transcription' : 'Start capture to see the translation'}
      </p>
    </div>
  );
}