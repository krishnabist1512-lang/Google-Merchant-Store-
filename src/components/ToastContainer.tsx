import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { subscribeToEvents, clearEventLogs, GA_MEASUREMENT_ID } from '../lib/analytics';
import { GAEventLog } from '../types';
import { Activity, X, Trash2, CheckCircle2, ShoppingBag, Eye, Search, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#1B1D21] text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between gap-3 text-sm border border-white/10 animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'cart' ? (
              <ShoppingBag className="w-4 h-4 text-[#2F6BFF] shrink-0" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#2DBE8C] shrink-0" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-[#2F6BFF] shrink-0" />
            )}
            <span className="font-medium text-white/95">{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const GA4Inspector: React.FC = () => {
  const { showGAInspector, setShowGAInspector } = useStore();
  const [logs, setLogs] = useState<GAEventLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<GAEventLog | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToEvents((newLogs) => {
      setLogs(newLogs);
    });
    return unsubscribe;
  }, []);

  if (!showGAInspector) {
    return (
      <button
        onClick={() => setShowGAInspector(true)}
        className="fixed bottom-20 md:bottom-6 right-4 z-40 bg-[#1B1D21] text-white hover:bg-black px-3 py-2 rounded-full shadow-lg border border-white/15 flex items-center gap-2 text-xs font-semibold tracking-wide transition-all transform hover:scale-105 active:scale-95"
        title="View live GA4 E-Commerce Event Stream (Viva Demo)"
        aria-label="Open GA4 Realtime Inspector"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DBE8C] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DBE8C]"></span>
        </span>
        <Activity className="w-3.5 h-3.5 text-[#2F6BFF]" />
        <span>GA4 Live Stream</span>
        <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px] tabular-nums font-mono">
          {logs.length}
        </span>
      </button>
    );
  }

  const getEventIcon = (name: string) => {
    if (name.includes('purchase')) return <CreditCard className="w-3.5 h-3.5 text-[#2DBE8C]" />;
    if (name.includes('cart')) return <ShoppingBag className="w-3.5 h-3.5 text-[#2F6BFF]" />;
    if (name.includes('item')) return <Eye className="w-3.5 h-3.5 text-[#FF6B4A]" />;
    if (name.includes('search')) return <Search className="w-3.5 h-3.5 text-[#FFC83D]" />;
    return <Activity className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 w-96 max-w-[calc(100vw-2rem)] bg-[#1B1D21] text-white rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden text-xs max-h-[500px]">
      {/* Header */}
      <div className="px-4 py-3 bg-[#111215] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2DBE8C] animate-pulse"></span>
          <span className="font-bold tracking-tight text-sm">GA4 Realtime Inspector</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => clearEventLogs()}
            className="p-1 hover:text-red-400 text-white/60 transition-colors"
            title="Clear event history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowGAInspector(false)}
            className="p-1 hover:text-white text-white/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-3 py-1.5 bg-white/5 border-b border-white/10 text-[11px] text-white/70 flex items-center justify-between font-mono">
        <span>ID: {GA_MEASUREMENT_ID}</span>
        <span className="text-[#2DBE8C]">Realtime Active</span>
      </div>

      {/* Log list */}
      <div className="overflow-y-auto flex-1 divide-y divide-white/5 p-2 space-y-1">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-white/50 text-xs">
            No events tracked yet. Interact with the store to stream events.
          </div>
        ) : (
          logs.map((log) => {
            const isSelected = selectedLog?.id === log.id;
            return (
              <div key={log.id} className="rounded-lg overflow-hidden bg-white/5">
                <button
                  onClick={() => setSelectedLog(isSelected ? null : log)}
                  className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-white/10 transition-colors gap-2"
                >
                  <div className="flex items-center gap-2 truncate">
                    {getEventIcon(log.eventName)}
                    <span className="font-mono font-semibold text-white/90 truncate">{log.eventName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-white/50 text-[10px] font-mono">
                    <span>{log.timestamp}</span>
                    {isSelected ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </div>
                </button>
                {isSelected && (
                  <div className="p-3 bg-black/60 border-t border-white/10 font-mono text-[10px] text-emerald-300 overflow-x-auto max-h-48">
                    <pre>{JSON.stringify(log.params, null, 2)}</pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-2.5 bg-[#111215] border-t border-white/10 text-[10px] text-white/50 text-center">
        Instrumentation ready for viva presentation & GA4 DebugView
      </div>
    </div>
  );
};
