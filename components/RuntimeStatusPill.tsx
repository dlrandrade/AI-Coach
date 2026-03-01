import React from 'react';

type Props = {
  online: boolean;
  loading?: boolean;
  modelUsed?: string;
  requestId?: string;
  genericScore?: number; // 0-100
  generationMode?: 'ai_strict' | 'ai_recovered' | 'fallback_emergency';
};

export const RuntimeStatusPill: React.FC<Props> = ({
  online,
  loading = false,
  modelUsed,
  requestId,
  genericScore,
  generationMode
}) => {
  const isFallback = generationMode === 'fallback_emergency';
  const dot = !online ? 'bg-red-500' : loading ? 'bg-amber-500' : isFallback ? 'bg-red-500' : 'bg-green-500';
  const label = !online ? 'offline' : loading ? 'processando' : 'ok';
  const gen = generationMode === 'ai_strict' ? 'IA' : generationMode === 'ai_recovered' ? 'recover' : generationMode === 'fallback_emergency' ? 'fallback' : 'n/d';

  return (
    <div className="fixed right-4 top-4 z-[120] bg-black/80 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-md font-mono tracking-wide max-w-[85vw]">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span>{label}</span>
        <span>• gen:{gen}</span>
        {typeof genericScore === 'number' && <span>• uniq:{genericScore}%</span>}
      </div>
      {(modelUsed || requestId) && (
        <div className="opacity-80 mt-0.5">
          {modelUsed ? modelUsed.replace('fallback/local-normalizer', 'fallback') : ''}
          {requestId ? ` • ${requestId.slice(-6)}` : ''}
        </div>
      )}
    </div>
  );
};
