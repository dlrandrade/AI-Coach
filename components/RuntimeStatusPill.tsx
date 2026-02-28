import React from 'react';

type Props = {
  online: boolean;
  loading?: boolean;
  modelUsed?: string;
  requestId?: string;
  genericScore?: number; // 0-100
  isFallback?: boolean;
};

export const RuntimeStatusPill: React.FC<Props> = ({
  online,
  loading = false,
  modelUsed,
  requestId,
  genericScore,
  isFallback = false
}) => {
  const dot = !online ? 'bg-red-500' : loading ? 'bg-amber-500' : 'bg-green-500';
  const label = !online ? 'offline' : loading ? 'processando' : isFallback ? 'contingência' : 'ok';

  return (
    <div className="fixed right-3 top-3 z-[120] bg-black/85 text-white text-[10px] px-2 py-1 rounded-md font-mono tracking-wide">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span>{label}</span>
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
