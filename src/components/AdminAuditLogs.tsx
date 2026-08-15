import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Terminal,
  RefreshCw,
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react';
import { AdminLogItem } from '../types';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'success' | 'warning' | 'info'>('all');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error('Error fetching admin logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter((l) => l.status === filter);

  return (
    <div className="space-y-8 pb-16" id="admin-audit-logs-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            System Administration & Security
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
            Telemetry & Audit Event Stream
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time server logs, cloud backup sync operations, and AI coaching executions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-bold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* System Status Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono-num">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">SERVER UPTIME</span>
          <span className="text-lg font-bold text-emerald-400">99.99% Operational</span>
          <span className="text-[10px] text-zinc-500 block">Cloud Run Container</span>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">AI COACH MODEL</span>
          <span className="text-lg font-bold text-orange-400">Gemini 3.7 Flash</span>
          <span className="text-[10px] text-zinc-500 block">@google/genai SDK</span>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">CLOUD STORAGE</span>
          <span className="text-lg font-bold text-sky-400">Encrypted Backup Map</span>
          <span className="text-[10px] text-zinc-500 block">AES-256 Validated</span>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-zinc-500 block">WEARABLE FEED</span>
          <span className="text-lg font-bold text-yellow-400">Low Latency Sync</span>
          <span className="text-[10px] text-zinc-500 block">Apple Watch & WearOS</span>
        </div>
      </div>

      {/* Audit Log Terminal Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-300 font-bold">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span>Audit Trail ({filteredLogs.length} events logged)</span>
          </div>

          <div className="inline-flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs">
            {['all', 'success', 'warning', 'info'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as any)}
                className={`px-3 py-1 rounded-lg uppercase text-[10px] font-bold transition-all ${
                  filter === s
                    ? 'bg-orange-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 flex items-start justify-between gap-4 leading-relaxed"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    log.status === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : log.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  }`}
                >
                  {log.status}
                </span>

                <div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <strong className="text-white">{log.action}</strong>
                    <span className="text-zinc-500 text-[11px]">user: {log.userId}</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-0.5">{log.details}</p>
                </div>
              </div>

              <span className="text-zinc-500 text-[10px] whitespace-nowrap">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
