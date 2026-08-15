import React from 'react';
import {
  LayoutDashboard,
  LineChart,
  UtensilsCrossed,
  Sparkles,
  Trophy,
  Watch,
  Cloud,
  ShieldAlert,
  Plus,
  Smartphone,
  Flame,
  User,
  Zap,
} from 'lucide-react';
import { AuraLogo } from './AuraLogo';

export type TabType =
  | 'dashboard'
  | 'charts'
  | 'nutrition'
  | 'ai-coach'
  | 'compete'
  | 'wearables'
  | 'backup'
  | 'admin';

export type DeviceFrameType = 'responsive' | 'iphone' | 'android' | 'watch';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenLogWorkout: () => void;
  streakDays: number;
  auraPoints: number;
  deviceFrame: DeviceFrameType;
  onChangeDeviceFrame: (frame: DeviceFrameType) => void;
  userName: string;
  userAvatar: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenLogWorkout,
  streakDays,
  auraPoints,
  deviceFrame,
  onChangeDeviceFrame,
  userName,
  userAvatar,
}) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'charts' as TabType, label: 'Telemetry & Charts', icon: LineChart },
    { id: 'nutrition' as TabType, label: 'Meals & Water', icon: UtensilsCrossed },
    { id: 'ai-coach' as TabType, label: 'AI Coach', icon: Sparkles, badge: 'AI' },
    { id: 'compete' as TabType, label: 'Train & Compete', icon: Trophy, badge: 'LIVE' },
    { id: 'wearables' as TabType, label: 'Smartwatch', icon: Watch },
    { id: 'backup' as TabType, label: 'Cloud & Backup', icon: Cloud },
    { id: 'admin' as TabType, label: 'Admin Logs', icon: ShieldAlert },
  ];

  return (
    <header
      id="main-app-header"
      className="bg-zinc-950/95 border-b border-zinc-800 text-white backdrop-blur-md sticky top-[41px] z-30 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="text-left focus:outline-none"
              aria-label="Go to Aura Maker Home"
            >
              <AuraLogo size="md" />
            </button>

            {/* Platform Cross-Device Preview Switcher */}
            <div className="hidden lg:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs text-zinc-400">
              <span className="px-2 text-zinc-500 font-semibold uppercase text-[10px]">
                Platform Preview:
              </span>
              <button
                id="btn-frame-responsive"
                onClick={() => onChangeDeviceFrame('responsive')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  deviceFrame === 'responsive'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'hover:text-zinc-200'
                }`}
                title="Full Responsive Desktop / Tablet Mode"
              >
                Desktop
              </button>
              <button
                id="btn-frame-iphone"
                onClick={() => onChangeDeviceFrame('iphone')}
                className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-all ${
                  deviceFrame === 'iphone'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'hover:text-zinc-200'
                }`}
                title="iOS Cross-Platform Simulation"
              >
                <Smartphone className="w-3 h-3 text-orange-400" />
                <span>iOS</span>
              </button>
              <button
                id="btn-frame-android"
                onClick={() => onChangeDeviceFrame('android')}
                className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-all ${
                  deviceFrame === 'android'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'hover:text-zinc-200'
                }`}
                title="Android Cross-Platform Simulation"
              >
                <Smartphone className="w-3 h-3 text-emerald-400" />
                <span>Android</span>
              </button>
              <button
                id="btn-frame-watch"
                onClick={() => onChangeDeviceFrame('watch')}
                className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-all ${
                  deviceFrame === 'watch'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'hover:text-zinc-200'
                }`}
                title="Apple Watch & WearOS Wrist Mode"
              >
                <Watch className="w-3 h-3 text-red-400" />
                <span>Watch</span>
              </button>
            </div>
          </div>

          {/* User Quick Stats (Streak & Aura XP) */}
          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-orange-950/40 to-red-950/40 border border-orange-500/30 px-3 py-1.5 rounded-full"
              title="Daily Active Workout Streak"
            >
              <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
              <span className="text-xs font-bold text-orange-200">
                {streakDays} <span className="font-normal text-orange-300/80">Day Streak</span>
              </span>
            </div>

            <div
              className="hidden md:flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full"
              title="Total Aura Athletic XP"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-mono-num font-bold text-yellow-300">
                {auraPoints.toLocaleString()} <span className="text-[10px] text-zinc-400">XP</span>
              </span>
            </div>

            {/* Quick Log Workout Button */}
            <button
              id="btn-nav-log-workout"
              onClick={onOpenLogWorkout}
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg shadow-orange-600/25 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Log Workout</span>
              <span className="sm:hidden">Log</span>
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => onSelectTab('backup')}
              className="flex items-center gap-2 pl-2 border-l border-zinc-800 hover:opacity-80 transition-opacity"
              title="View Profile and Cloud Settings"
              aria-label="User Profile"
            >
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover border border-orange-500/50"
              />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu (Horizontal Scrollable) */}
        <nav
          className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar text-xs font-semibold scroll-smooth"
          aria-label="Main Application Navigation"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800 text-white font-bold shadow-sm border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-orange-500' : 'text-zinc-400'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      tab.badge === 'LIVE'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
