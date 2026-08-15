import React, { useState, useEffect } from 'react';
import {
  Watch,
  Heart,
  Compass,
  Flame,
  Activity,
  BatteryCharging,
  RefreshCw,
  CheckCircle,
  Bluetooth,
  Smartphone,
  Sparkles,
  Zap,
  Sliders,
  ShieldCheck,
} from 'lucide-react';
import { WearableDevice } from '../types';
import confetti from 'canvas-confetti';

interface WearablesSyncProps {
  wearables: WearableDevice[];
  onSyncAll: () => void;
  onToggleDeviceConnection: (deviceId: string) => void;
}

export const WearablesSync: React.FC<WearablesSyncProps> = ({
  wearables,
  onSyncAll,
  onToggleDeviceConnection,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<WearableDevice>(wearables[0]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [watchFaceView, setWatchFaceView] = useState<'telemetry' | 'splits' | 'routine'>('telemetry');
  
  // Realtime simulated heart rate oscillation
  const [simulatedHr, setSimulatedHr] = useState(68);

  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedHr((prev) => Math.min(180, Math.max(55, prev + Math.floor(Math.random() * 5) - 2)));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onSyncAll();
      confetti({ particleCount: 40, spread: 50 });
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16" id="wearables-sync-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
            <Watch className="w-4 h-4" />
            Connected Wearable Ecosystem
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
            Smartwatch & Apple Watch Live Sync
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Stream biometrics, broadcast workout routines, and track pace metrics in real-time with Apple Watch Ultra and WearOS.
          </p>
        </div>

        <button
          id="btn-sync-wearables-now"
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Telemetry...' : 'Sync All Watches'}</span>
        </button>
      </div>

      {/* Hero "Leave Phone in Locker Room" Feature Banner (From Reference Screenshot) */}
      <section className="bg-black border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-600/20 via-red-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Watch Routine Broadcast Mode
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              LEAVE YOUR PHONE IN THE <span className="text-orange-500">LOCKER ROOM</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Seamlessly push your training routines and custom split pacing directly to Apple Watch Ultra or WearOS.
              Follow interval cues, haptic vibration alerts, and log weight sets straight from your wrist without distraction.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                <CheckCircle className="w-4 h-4" />
                <span>Zero Latency Bluetooth 5.3</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>HealthKit & Health Connect Verified</span>
              </div>
            </div>
          </div>

          {/* Interactive Smartwatch Face Preview Simulator (Apple Watch Ultra / WearOS) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {/* Watch Chassis */}
            <div className="w-64 bg-zinc-900 border-4 border-zinc-700 rounded-[44px] p-3 shadow-2xl relative">
              {/* Crown knob */}
              <div className="absolute -right-3 top-16 w-2.5 h-10 bg-orange-600 rounded-r-md border border-zinc-700 shadow" />
              {/* Action button */}
              <div className="absolute -left-3 top-20 w-2.5 h-8 bg-zinc-700 rounded-l-md border border-zinc-600 shadow" />

              {/* Watch AMOLED Display Screen */}
              <div className="bg-black rounded-[34px] p-4 text-white font-mono-num h-80 flex flex-col justify-between border border-zinc-900 overflow-hidden relative">
                {/* Watch Status Bar */}
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span className="text-orange-400 font-bold">AURA PRO</span>
                  <div className="flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3 text-emerald-400" />
                    <span>{selectedDevice.batteryLevel}%</span>
                  </div>
                </div>

                {/* Main Telemetry Screen */}
                <div className="space-y-3 my-auto text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                      HEART RATE
                    </span>
                    <div className="flex items-center justify-center gap-1.5">
                      <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                      <span className="text-3xl font-display font-black text-white">
                        {simulatedHr}
                      </span>
                      <span className="text-xs text-zinc-400 font-bold">BPM</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-zinc-900/90 p-2.5 rounded-2xl border border-zinc-800 text-left">
                    <div>
                      <span className="text-[9px] uppercase text-zinc-400 block font-bold">PACE</span>
                      <span className="text-sm font-bold text-orange-400">
                        {selectedDevice.liveStats.paceMinKm}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-zinc-400 block font-bold">CADENCE</span>
                      <span className="text-sm font-bold text-white">
                        {selectedDevice.liveStats.cadenceSpm} <span className="text-[9px]">spm</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1">
                    <span>Active: {selectedDevice.liveStats.activeCalories} kcal</span>
                    <span>SpO2: {selectedDevice.liveStats.bloodOxygenSpO2}%</span>
                  </div>
                </div>

                {/* Bottom Watch Mode switcher */}
                <div className="flex items-center justify-around text-[10px] border-t border-zinc-900 pt-2 text-zinc-400 font-semibold">
                  <button
                    onClick={() => setWatchFaceView('telemetry')}
                    className={watchFaceView === 'telemetry' ? 'text-orange-400 font-bold' : ''}
                  >
                    Telemetry
                  </button>
                  <button
                    onClick={() => setWatchFaceView('splits')}
                    className={watchFaceView === 'splits' ? 'text-orange-400 font-bold' : ''}
                  >
                    Splits
                  </button>
                  <button
                    onClick={() => setWatchFaceView('routine')}
                    className={watchFaceView === 'routine' ? 'text-orange-400 font-bold' : ''}
                  >
                    Sets
                  </button>
                </div>
              </div>
            </div>

            <span className="text-xs text-zinc-400 mt-3 font-mono">
              Live wrist telemetry simulation
            </span>
          </div>
        </div>
      </section>

      {/* Paired Wearables Management Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-display font-bold uppercase text-white tracking-wide">
          Paired Wearable Hardware
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wearables.map((device) => (
            <div
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                selectedDevice.id === device.id
                  ? 'bg-zinc-900 border-orange-500/60 shadow-xl'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Watch className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{device.name}</h4>
                    <span className="text-xs text-zinc-400 font-mono">
                      {device.firmwareVersion} • Last sync: {device.lastSyncTime}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDeviceConnection(device.id);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                    device.isConnected
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  {device.isConnected ? 'Connected' : 'Disconnected'}
                </button>
              </div>

              {/* Live Biometric Readout */}
              <div className="grid grid-cols-4 gap-2 bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80 text-center font-mono-num">
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block">HR</span>
                  <span className="text-sm font-bold text-red-400">
                    {device.liveStats.heartRateBpm} bpm
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block">HRV</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {device.liveStats.hrvMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block">Skin Temp</span>
                  <span className="text-sm font-bold text-yellow-400">
                    {device.liveStats.wristTempC}°C
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block">Steps</span>
                  <span className="text-sm font-bold text-white">
                    {device.liveStats.stepsToday.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
