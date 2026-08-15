import React from 'react';
import { Sun, Moon, Eye, Contrast, Type, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { AccessibilitySettings } from '../types';

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  onUpdate: (newSettings: Partial<AccessibilitySettings>) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  settings,
  onUpdate,
  isOnline,
  onToggleOnline,
}) => {
  return (
    <div
      id="accessibility-control-bar"
      className="bg-zinc-900/90 border-b border-zinc-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 backdrop-blur-md sticky top-0 z-40"
      role="region"
      aria-label="Accessibility and system controls"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mr-2">
          <Eye className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
          A11y & Display:
        </span>

        {/* Theme modes: Dark, Eye-Friendly (Amber evening warm mode), Light */}
        <div className="inline-flex rounded-lg bg-zinc-950 p-0.5 border border-zinc-800">
          <button
            id="btn-theme-dark"
            onClick={() => onUpdate({ theme: 'dark' })}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              settings.theme === 'dark'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-pressed={settings.theme === 'dark'}
            title="Sleek Dark Mode for evening sessions"
          >
            <Moon className="w-3 h-3" />
            <span>Dark</span>
          </button>

          <button
            id="btn-theme-eye-friendly"
            onClick={() => onUpdate({ theme: 'eye-friendly' })}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              settings.theme === 'eye-friendly'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-pressed={settings.theme === 'eye-friendly'}
            title="Warm Eye-Friendly Filter with reduced blue-light"
          >
            <Eye className="w-3 h-3" />
            <span>Eye-Friendly</span>
          </button>

          <button
            id="btn-theme-light"
            onClick={() => onUpdate({ theme: 'light' })}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              settings.theme === 'light'
                ? 'bg-zinc-200 text-zinc-900 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            aria-pressed={settings.theme === 'light'}
            title="Clean High Clarity Light Theme"
          >
            <Sun className="w-3 h-3" />
            <span>Light</span>
          </button>
        </div>

        {/* High Contrast Toggle */}
        <button
          id="btn-toggle-high-contrast"
          onClick={() => onUpdate({ highContrast: !settings.highContrast })}
          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
            settings.highContrast
              ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
              : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
          }`}
          aria-pressed={settings.highContrast}
          title="High contrast outlines and crisp borders for visual impairment"
        >
          <Contrast className="w-3 h-3" />
          <span>High Contrast: {settings.highContrast ? 'ON' : 'OFF'}</span>
        </button>

        {/* Text Scaling (Normal, Large, Extra-Large) */}
        <div className="inline-flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
          <span className="px-2 text-zinc-400 flex items-center gap-1">
            <Type className="w-3 h-3" />
            <span>Text:</span>
          </span>
          {(['normal', 'large', 'xlarge'] as const).map((scale) => (
            <button
              key={scale}
              id={`btn-text-scale-${scale}`}
              onClick={() => onUpdate({ textScale: scale })}
              className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition-all ${
                settings.textScale === scale
                  ? 'bg-orange-500 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-pressed={settings.textScale === scale}
            >
              {scale === 'normal' ? '100%' : scale === 'large' ? '115%' : '125%'}
            </button>
          ))}
        </div>

        {/* Sound Feedback Chimes */}
        <button
          id="btn-toggle-audio"
          onClick={() => onUpdate({ audioFeedback: !settings.audioFeedback })}
          className={`p-1.5 rounded-lg border transition-all ${
            settings.audioFeedback
              ? 'bg-zinc-950 border-zinc-800 text-orange-400'
              : 'bg-zinc-950 border-zinc-800 text-zinc-500'
          }`}
          title={settings.audioFeedback ? 'Sound chimes enabled' : 'Muted'}
          aria-label={settings.audioFeedback ? 'Sound chimes enabled' : 'Muted'}
        >
          {settings.audioFeedback ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Online / Offline Connectivity & Cloud indicator */}
      <div className="flex items-center gap-2">
        <button
          id="btn-toggle-connection-status"
          onClick={onToggleOnline}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
            isOnline
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-400'
          }`}
          title={isOnline ? 'Online (Real-time sync enabled)' : 'Offline mode active'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span>{isOnline ? 'Internet Connected (Live Compete)' : 'Offline Cached'}</span>
        </button>

        <div className="hidden sm:flex items-center gap-1 text-zinc-400 text-[11px]">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>E2E 256-bit Sync</span>
        </div>
      </div>
    </div>
  );
};
