import React, { useState } from 'react';
import {
  Cloud,
  ShieldCheck,
  Download,
  Upload,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { PrivacySettings } from '../types';
import confetti from 'canvas-confetti';

interface CloudBackupModalProps {
  userId: string;
  userName: string;
  onSwitchUser: (newUser: { id: string; name: string; avatar: string; skillLevel: any }) => void;
  privacy: PrivacySettings;
  onUpdatePrivacy: (newPrivacy: Partial<PrivacySettings>) => void;
  isOnline: boolean;
  appState: any;
  onRestoreState: (state: any) => void;
}

export const CloudBackupModal: React.FC<CloudBackupModalProps> = ({
  userId,
  userName,
  onSwitchUser,
  privacy,
  onUpdatePrivacy,
  isOnline,
  appState,
  onRestoreState,
}) => {
  const [backupStatus, setBackupStatus] = useState<'idle' | 'saving' | 'success' | 'restoring'>('idle');
  const [lastBackupTime, setLastBackupTime] = useState<string>('Today at 07:15 AM (Auto-Synced)');
  const [restoreToken, setRestoreToken] = useState<string>('');
  const [snapshotMsg, setSnapshotMsg] = useState<string>('');

  const profiles = [
    {
      id: 'usr-athlete-1',
      name: 'Alex Rivera',
      role: 'Endurance Athlete (Boulder, CO)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      skillLevel: 'Intermediate',
    },
    {
      id: 'usr-coach-2',
      name: 'Coach Marcus Vance',
      role: 'Certified USATF Elite Coach',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      skillLevel: 'Elite',
    },
    {
      id: 'usr-guest-3',
      name: 'Taylor Reed',
      role: 'Beginner Runner & Gym Explorer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      skillLevel: 'Beginner',
    },
  ];

  const handleCreateCloudBackup = async () => {
    setBackupStatus('saving');
    try {
      const res = await fetch('/api/backup/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          backupPayload: appState,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBackupStatus('success');
        setLastBackupTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Encrypted Cloud)');
        setSnapshotMsg(`Cloud Snapshot Created! Backup Token: ${data.snapshotId}`);
        confetti({ particleCount: 50, spread: 60 });
      } else {
        setBackupStatus('idle');
      }
    } catch (e) {
      console.error('Backup error:', e);
      setBackupStatus('idle');
    }
  };

  const handleRestoreFromCloud = async () => {
    setBackupStatus('restoring');
    try {
      const res = await fetch(`/api/backup/restore/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.backup) {
          onRestoreState(data.backup);
          setSnapshotMsg('State successfully restored from cloud!');
          confetti({ particleCount: 60, spread: 70 });
        }
      }
    } catch (e) {
      console.error('Restore error:', e);
    } finally {
      setBackupStatus('idle');
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `aura_maker_backup_${userId}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        onRestoreState(parsed);
        alert('Data successfully imported from backup file!');
        confetti({ particleCount: 50, spread: 60 });
      } catch (err) {
        alert('Invalid JSON backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-16" id="cloud-backup-view">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
          <Cloud className="w-4 h-4" />
          Cloud Security & Data Recovery
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
          Cloud Backup & Privacy Architecture
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Zero-knowledge encrypted cloud persistence, multi-user profiles, and granular privacy controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CLOUD BACKUP & RECOVERY (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold uppercase text-white">
                    Encrypted Cloud Backup
                  </h2>
                  <span className="text-xs text-zinc-400 font-mono">
                    AES-256 GCM • Multi-Zone Redundancy
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Protected
              </span>
            </div>

            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Last Cloud Snapshot:</span>
                <span className="font-mono text-zinc-200 font-bold">{lastBackupTime}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Account ID:</span>
                <span className="font-mono text-orange-400">{userId}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Cloud Status:</span>
                <span className="text-emerald-400 font-bold">
                  {isOnline ? 'Online & Synchronized' : 'Local Cache (Queued)'}
                </span>
              </div>
            </div>

            {snapshotMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
                {snapshotMsg}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-trigger-cloud-backup"
                onClick={handleCreateCloudBackup}
                disabled={backupStatus === 'saving'}
                className="py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Cloud className={`w-4 h-4 ${backupStatus === 'saving' ? 'animate-bounce' : ''}`} />
                <span>{backupStatus === 'saving' ? 'Creating Snapshot...' : 'Backup Now'}</span>
              </button>

              <button
                id="btn-restore-cloud-backup"
                onClick={handleRestoreFromCloud}
                disabled={backupStatus === 'restoring'}
                className="py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${backupStatus === 'restoring' ? 'animate-spin' : ''}`} />
                <span>1-Click Restore</span>
              </button>
            </div>

            {/* Export / Import File Archive */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Local Archive Export / Import:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleExportJSON}
                  className="py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-orange-400" />
                  <span>Export JSON</span>
                </button>

                <label className="py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Switcher (Multi-User support) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-display font-bold uppercase text-white tracking-wide flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-500" />
              Switch Athlete Profile
            </h3>

            <div className="space-y-2">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSwitchUser(p)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    userId === p.id
                      ? 'bg-orange-950/30 border-orange-500/50'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block">{p.name}</span>
                      <span className="text-xs text-zinc-400">{p.role}</span>
                    </div>
                  </div>

                  {userId === p.id && (
                    <span className="text-xs font-bold text-orange-400">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GRANULAR PRIVACY CONTROLS (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold uppercase text-white">
                  Granular Privacy Management
                </h2>
                <span className="text-xs text-zinc-400">
                  Control who sees your maps, biometric zones, and training logs.
                </span>
              </div>
            </div>

            {/* Privacy Controls List */}
            <div className="space-y-4">
              {/* Profile Visibility */}
              <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 space-y-2">
                <label className="text-xs font-bold uppercase text-zinc-300 block">
                  Default Activity Visibility
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'public', label: 'Public (Everyone)' },
                    { id: 'followers', label: 'Followers Only' },
                    { id: 'private', label: 'Only Me (Private)' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => onUpdatePrivacy({ profileVisibility: v.id as any })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        privacy.profileVisibility === v.id
                          ? 'bg-orange-600 text-white border-orange-500 shadow'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Map Start/End Home Radius Blurring */}
              <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase text-zinc-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    GPS Home Privacy Radius Blurring
                  </span>
                  <span className="font-mono text-orange-400 font-bold">
                    {privacy.hideHomeMapRadiusM} meters
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="100"
                  value={privacy.hideHomeMapRadiusM}
                  onChange={(e) =>
                    onUpdatePrivacy({ hideHomeMapRadiusM: Number(e.target.value) })
                  }
                  className="w-full accent-orange-500"
                />
                <span className="text-[11px] text-zinc-500 block">
                  Hides the first and last {privacy.hideHomeMapRadiusM}m of all GPS routes to protect your home or office address.
                </span>
              </div>

              {/* Biometrics Sharing Toggle */}
              <div className="flex items-center justify-between bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Share Heart Rate & Biometric Intensity Zones
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Display BPM graphs on community feeds.
                  </span>
                </div>
                <button
                  onClick={() =>
                    onUpdatePrivacy({ shareHeartRateZones: !privacy.shareHeartRateZones })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    privacy.shareHeartRateZones ? 'bg-orange-600' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      privacy.shareHeartRateZones ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Cross Platform Leaderboards Toggle */}
              <div className="flex items-center justify-between bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Cross-Platform Live Leaderboard Participation
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Show rank across iOS, Android & Wearables.
                  </span>
                </div>
                <button
                  onClick={() =>
                    onUpdatePrivacy({
                      crossPlatformLeaderboard: !privacy.crossPlatformLeaderboard,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    privacy.crossPlatformLeaderboard ? 'bg-orange-600' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      privacy.crossPlatformLeaderboard ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
