import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Mountain,
  Heart,
  Zap,
  BarChart3,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { WorkoutActivity } from '../types';

interface ProgressChartsProps {
  workouts: WorkoutActivity[];
  selectedActivity?: WorkoutActivity;
  onSelectActivity: (activity: WorkoutActivity) => void;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  workouts,
  selectedActivity,
  onSelectActivity,
}) => {
  const activeWorkout = selectedActivity || workouts[0] || null;
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '1y'>('30d');
  const [metricTab, setMetricTab] = useState<'splits' | 'elevation' | 'weekly' | 'predictions' | 'hr-zones'>('splits');

  // Interactive elevation points for active workout
  const elevationData = [
    { distance: '0.0 km', elev: 504.3, pace: '5:41' },
    { distance: '1.5 km', elev: 540.2, pace: '5:28' },
    { distance: '3.0 km', elev: 596.9, pace: '5:15' },
    { distance: '4.5 km', elev: 572.1, pace: '5:22' },
    { distance: '6.0 km', elev: 550.0, pace: '5:09' },
    { distance: '7.5 km', elev: 588.4, pace: '5:12' },
    { distance: '8.7 km', elev: 512.6, pace: '4:58' },
  ];

  // Weekly volume distribution
  const weeklyDays = [
    { day: 'Mon', miles: 6.2, calories: 420, sport: 'run' },
    { day: 'Tue', miles: 8.5, calories: 580, sport: 'run' },
    { day: 'Wed', miles: 0, calories: 390, sport: 'strength' },
    { day: 'Thu', miles: 14.2, calories: 680, sport: 'cycle' },
    { day: 'Fri', miles: 5.0, calories: 340, sport: 'run' },
    { day: 'Sat', miles: 12.8, calories: 890, sport: 'run' },
    { day: 'Sun', miles: 4.5, calories: 310, sport: 'walk' },
  ];

  // Race Performance Predictions (from Strava reference in user upload)
  const racePredictions = [
    { distance: '5K', time: '28:29', pace: '9:10 /mi', status: 'Optimal' },
    { distance: '10K', time: '59:27', pace: '9:35 /mi', status: 'Improving' },
    { distance: '13.1 MI (Half)', time: '2:12:08', pace: '10:05 /mi', status: 'PR Potential' },
    { distance: '26.2 MI (Full)', time: '4:33:05', pace: '10:25 /mi', status: 'Base Ready' },
  ];

  // Heart Rate Zone breakdown
  const hrZones = [
    { zone: 'Zone 1: Active Recovery (<118 BPM)', pct: 18, color: 'bg-blue-500' },
    { zone: 'Zone 2: Aerobic Base (118-142 BPM)', pct: 45, color: 'bg-emerald-500' },
    { zone: 'Zone 3: Tempo Steady (143-158 BPM)', pct: 22, color: 'bg-yellow-500' },
    { zone: 'Zone 4: Threshold Surge (159-172 BPM)', pct: 11, color: 'bg-orange-500' },
    { zone: 'Zone 5: VO2 Max Peak (>172 BPM)', pct: 4, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-8 pb-16" id="progress-charts-view">
      {/* Header & Metric Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            Performance & Telemetry Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
            Integrated Progress & Split Telemetry
          </h1>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs">
            {(['7d', '30d', '3m', '1y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeRange === r ? 'bg-orange-600 text-white shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '3m' ? '3 Months' : '1 Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub tabs for metric categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'splits', label: 'Splits & Elevation' },
          { id: 'weekly', label: 'Weekly Volume & Mileage' },
          { id: 'predictions', label: 'Race Predictor & Athlete Intel' },
          { id: 'hr-zones', label: 'Heart Rate Intensity Zones' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMetricTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all border ${
              metricTab === tab.id
                ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. SPLITS & ELEVATION BREAKDOWN (Exact match to MapMyFitness reference screenshot) */}
      {metricTab === 'splits' && activeWorkout && (
        <section className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400">
                Selected Session Analysis:
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">{activeWorkout.title}</h2>
              <span className="text-xs text-zinc-400">
                {activeWorkout.distanceKm} km • {activeWorkout.durationMinutes} min • Avg {activeWorkout.avgPace}
              </span>
            </div>

            {/* Quick workout selector dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Switch Session:</span>
              <select
                value={activeWorkout.id}
                onChange={(e) => {
                  const target = workouts.find((w) => w.id === e.target.value);
                  if (target) onSelectActivity(target);
                }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
              >
                {workouts.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.title} ({w.date})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SPLITS CARD (Red Bar Chart with pace timings matching reference) */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold uppercase text-white tracking-wide">
                Splits (1 km intervals)
              </h3>
              <span className="text-xs text-zinc-400 font-mono">10:36 avg pace target</span>
            </div>

            {/* Split Interval Header Times */}
            <div className="grid grid-cols-5 text-center text-xs font-mono font-bold text-zinc-400 border-b border-zinc-800 pb-2 mb-4">
              {activeWorkout.splits.map((s, idx) => {
                const cumulativeMins = ((idx + 1) * 10.68).toFixed(2).replace('.', ':');
                return (
                  <div key={s.splitNumber}>
                    <span className="text-zinc-500 text-[10px] block">Split {s.splitNumber}</span>
                    <span className="text-white">{cumulativeMins}</span>
                  </div>
                );
              })}
            </div>

            {/* Red Pace Bars (Visual Reference Styling) */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs uppercase font-extrabold tracking-wider text-zinc-400">
                <span>PACE (MIN/KM)</span>
                <span className="font-mono text-orange-400">9:51 FASTEST</span>
              </div>

              <div className="grid grid-cols-5 gap-2 items-end h-28 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                {activeWorkout.splits.map((split, i) => {
                  const barHeights = ['h-16', 'h-24', 'h-14', 'h-28', 'h-20'];
                  return (
                    <div key={split.splitNumber} className="flex flex-col items-center justify-end h-full group">
                      <span className="text-[10px] font-mono text-zinc-300 font-bold mb-1 opacity-80 group-hover:opacity-100">
                        {split.paceMinutes}
                      </span>
                      <div
                        className={`w-full ${barHeights[i % barHeights.length]} bg-red-600 group-hover:bg-red-500 transition-all rounded-t-sm shadow-md shadow-red-600/30 relative flex items-center justify-center`}
                      >
                        <span className="text-[9px] font-mono font-bold text-white opacity-90">
                          {split.paceMinutes}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Elevation Profile Curve (Red Line / Gradient Fill) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs uppercase font-extrabold tracking-wider text-zinc-400">
                <span>ELEVATION (FT / M)</span>
                <span className="font-mono text-zinc-300">596.9 Max Elevation</span>
              </div>

              {/* Dynamic SVG Elevation Graph */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 relative">
                <svg viewBox="0 0 500 120" className="w-full h-24 overflow-visible">
                  <defs>
                    <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  <path
                    d="M 0 100 Q 80 40, 160 80 T 320 20 T 450 70 T 500 90 L 500 120 L 0 120 Z"
                    fill="url(#elevationGrad)"
                  />

                  {/* Stroke curve */}
                  <path
                    d="M 0 100 Q 80 40, 160 80 T 320 20 T 450 70 T 500 90"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Elevation markers */}
                  <circle cx="320" cy="20" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="320" y="10" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                    596.9 ft Peak
                  </text>
                </svg>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mt-2">
                  <span>504.3 ft Start</span>
                  <span>Total Climb: +182m</span>
                  <span>512.6 ft Finish</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. WEEKLY MILEAGE & VOLUME LOAD */}
      {metricTab === 'weekly' && (
        <section className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold uppercase text-white">
                Weekly Training Volume & Calorie Expenditure
              </h2>
              <p className="text-xs text-zinc-400">Total Distance: 51.2 km • 3,610 Active Calories</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              +14% vs Last Week
            </span>
          </div>

          <div className="grid grid-cols-7 gap-3 items-end h-64 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 font-mono-num">
            {weeklyDays.map((day) => {
              const maxMiles = 15;
              const heightPct = Math.max(12, Math.round((day.miles / maxMiles) * 100));
              return (
                <div key={day.day} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {day.miles > 0 ? `${day.miles}k` : 'Gym'}
                  </span>
                  <div
                    className={`w-full max-w-[42px] rounded-t-xl transition-all ${
                      day.sport === 'run'
                        ? 'bg-gradient-to-t from-orange-600 to-red-500 group-hover:from-orange-500 group-hover:to-red-400'
                        : day.sport === 'cycle'
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-500'
                        : 'bg-gradient-to-t from-purple-600 to-indigo-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <div className="text-center mt-2">
                    <span className="text-xs font-bold text-zinc-300 block">{day.day}</span>
                    <span className="text-[10px] text-zinc-500 block">{day.calories} kcal</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. RACE PREDICTOR & ATHLETE INTELLIGENCE (Strava Reference) */}
      {metricTab === 'predictions' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Performance Predictions */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                <Award className="w-4 h-4" />
                Performance Predictions
              </div>
              <p className="text-xs text-zinc-400 mb-6">
                Personalized predictions for upcoming race distances based on VO2 Max and tempo pace.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {racePredictions.map((race) => (
                  <div
                    key={race.distance}
                    className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 text-center hover:border-orange-500/40 transition-all"
                  >
                    <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 block mb-1">
                      {race.distance}
                    </span>
                    <div className="text-2xl font-mono-num font-black text-white">{race.time}</div>
                    <span className="text-[11px] text-zinc-400 font-mono mt-0.5 block">
                      {race.pace}
                    </span>
                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30">
                      {race.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Progress Comparison */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                <TrendingUp className="w-4 h-4" />
                Progress Comparison
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Track how your overall aerobic output has shifted over past 30 days.
              </p>

              <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
                <svg viewBox="0 0 300 120" className="w-full h-28">
                  {/* Current month orange curve */}
                  <path
                    d="M 10 90 Q 70 30, 150 70 T 290 20"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="290" cy="20" r="5" fill="#f97316" />

                  {/* Previous month cyan curve */}
                  <path
                    d="M 10 100 Q 70 60, 150 85 T 290 55"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />
                  <circle cx="290" cy="55" r="4" fill="#06b6d4" />
                </svg>

                <div className="flex items-center justify-around pt-3 border-t border-zinc-800 text-xs font-mono font-bold">
                  <div className="flex items-center gap-2 text-orange-400">
                    <span className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>51.0 mi (Current)</span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <span className="w-3 h-3 rounded-full bg-cyan-500" />
                    <span>42.3 mi (Previous)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: AI-Powered Athlete Intelligence (From Strava Reference) */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  Athlete Intelligence
                </div>
                <div className="bg-gradient-to-br from-orange-950/30 to-red-950/20 border border-orange-500/30 rounded-2xl p-5 mt-2">
                  <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                    "Nice work on the Boulder Foothills route! Your threshold pace was{' '}
                    <span className="text-orange-400 font-bold">13 seconds faster</span> than your 30-day average,
                    with steady heart rate recovery."
                  </p>
                  <div className="mt-4 pt-3 border-t border-orange-500/20 flex items-center justify-between text-xs text-orange-300/80">
                    <span>Aura Coach AI Engine</span>
                    <span className="font-mono">Ready for 10K test</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-zinc-400">
                Wearable telemetry and recovery readiness score: <strong className="text-emerald-400">92 / 100 (Optimal)</strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. HEART RATE INTENSITY ZONES */}
      {metricTab === 'hr-zones' && (
        <section className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold uppercase text-white">
                Heart Rate Training Zones Distribution
              </h2>
              <p className="text-xs text-zinc-400">
                Resting Heart Rate: 52 BPM • Max Recorded: 178 BPM
              </p>
            </div>
            <Heart className="w-6 h-6 text-red-500 animate-pulse" />
          </div>

          <div className="space-y-4">
            {hrZones.map((zone) => (
              <div key={zone.zone} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-200">{zone.zone}</span>
                  <span className="text-orange-400 font-mono">{zone.pct}% of active time</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-3 overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full ${zone.color} transition-all duration-500`}
                    style={{ width: `${zone.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
            <strong className="text-white block mb-1">Zone 2 Aerobic Base Dominance:</strong>
            45% of your volume is in Zone 2, building mitochondrial density and lipid metabolism efficiency for endurance events.
          </div>
        </section>
      )}
    </div>
  );
};
