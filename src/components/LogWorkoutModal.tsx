import React, { useState } from 'react';
import {
  X,
  Footprints,
  Activity,
  Flame,
  TrendingUp,
  MapPin,
  Heart,
  Plus,
  Sparkles,
} from 'lucide-react';
import { WorkoutActivity, SportType } from '../types';
import confetti from 'canvas-confetti';

interface LogWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWorkout: (workout: Omit<WorkoutActivity, 'id' | 'likes' | 'commentsCount' | 'user'>) => void;
  userName: string;
}

export const LogWorkoutModal: React.FC<LogWorkoutModalProps> = ({
  isOpen,
  onClose,
  onSaveWorkout,
  userName,
}) => {
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<SportType>('run');
  const [distanceKm, setDistanceKm] = useState<number>(5.0);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(350);
  const [elevationGainM, setElevationGainM] = useState<number>(85);
  const [avgHeartRate, setAvgHeartRate] = useState<number>(148);
  const [maxHeartRate, setMaxHeartRate] = useState<number>(172);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Calculate pace
    let avgPace = '5:30 /km';
    if (distanceKm > 0 && durationMinutes > 0) {
      const paceDecimal = durationMinutes / distanceKm;
      const paceMins = Math.floor(paceDecimal);
      const paceSecs = Math.round((paceDecimal - paceMins) * 60);
      avgPace = `${paceMins}:${paceSecs.toString().padStart(2, '0')} /km`;
    } else {
      avgPace = `${durationMinutes} mins active`;
    }

    // Generate realistic splits
    const splitCount = Math.max(1, Math.floor(distanceKm || 3));
    const splits = Array.from({ length: splitCount }, (_, i) => ({
      splitNumber: i + 1,
      paceMinutes: avgPace.replace(' /km', ''),
      elevationM: Math.round(elevationGainM / splitCount) + (i % 2 === 0 ? 5 : -3),
      hr: avgHeartRate + (i * 2 - 2),
    }));

    onSaveWorkout({
      title,
      sport,
      date: 'Just now',
      durationMinutes: Number(durationMinutes),
      distanceKm: Number(distanceKm),
      caloriesBurned: Number(caloriesBurned),
      avgPace,
      avgHeartRate: Number(avgHeartRate),
      maxHeartRate: Number(maxHeartRate),
      elevationGainM: Number(elevationGainM),
      splits,
      notes,
    });

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl font-display font-bold uppercase text-white tracking-wide">
              Log Athletic Session
            </h2>
            <p className="text-xs text-zinc-400">
              Record distances, elevation gain, split paces and biometric telemetry.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Workout Title */}
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
              Workout Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunset Tempo Surge & Hill Climbs"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          {/* Sport Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
              Sport Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'run', label: 'Run' },
                { id: 'cycle', label: 'Ride' },
                { id: 'strength', label: 'Gym' },
                { id: 'swim', label: 'Swim' },
                { id: 'walk', label: 'Walk' },
                { id: 'hike', label: 'Hike' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSport(s.id as SportType)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                    sport === s.id
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Numbers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-num">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.01"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Duration (min)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Elevation (m)
              </label>
              <input
                type="number"
                value={elevationGainM}
                onChange={(e) => setElevationGainM(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Heart Rates */}
          <div className="grid grid-cols-2 gap-3 font-mono-num">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Avg Heart Rate (BPM)
              </label>
              <input
                type="number"
                value={avgHeartRate}
                onChange={(e) => setAvgHeartRate(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                Max Heart Rate (BPM)
              </label>
              <input
                type="number"
                value={maxHeartRate}
                onChange={(e) => setMaxHeartRate(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
              Athlete Notes & Conditions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you feel? Weather, footwear, nutrition or route conditions..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30"
            >
              Save Activity & Broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
