import React, { useState } from 'react';
import {
  Droplets,
  Utensils,
  Plus,
  Flame,
  PieChart,
  Trash2,
  Sparkles,
  Clock,
  CheckCircle,
  Apple,
  Coffee,
  RotateCcw,
} from 'lucide-react';
import { MealItem, HydrationLog } from '../types';
import confetti from 'canvas-confetti';

interface NutritionHydrationProps {
  meals: MealItem[];
  hydrations: HydrationLog[];
  onAddMeal: (meal: Omit<MealItem, 'id'>) => void;
  onDeleteMeal: (mealId: string) => void;
  onAddHydration: (amountMl: number) => void;
  onResetHydration: () => void;
  targetWaterMl?: number;
  targetCalories?: number;
}

export const NutritionHydration: React.FC<NutritionHydrationProps> = ({
  meals,
  hydrations,
  onAddMeal,
  onDeleteMeal,
  onAddHydration,
  onResetHydration,
  targetWaterMl = 3000,
  targetCalories = 2400,
}) => {
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<MealItem['mealType']>('breakfast');
  const [calories, setCalories] = useState<number>(450);
  const [proteinG, setProteinG] = useState<number>(30);
  const [carbsG, setCarbsG] = useState<number>(45);
  const [fatG, setFatG] = useState<number>(12);
  const [customWaterAmount, setCustomWaterAmount] = useState<number>(350);

  // Totals
  const totalWater = hydrations.reduce((acc, h) => acc + h.amountMl, 0);
  const waterPct = Math.min(100, Math.round((totalWater / targetWaterMl) * 100));

  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = meals.reduce((acc, m) => acc + m.proteinG, 0);
  const totalCarbs = meals.reduce((acc, m) => acc + m.carbsG, 0);
  const totalFat = meals.reduce((acc, m) => acc + m.fatG, 0);

  // Healthy Athlete Meal Quick Presets
  const mealPresets = [
    { name: 'Salmon Bowl & Wild Rice', type: 'dinner' as const, cal: 680, p: 48, c: 65, f: 18 },
    { name: 'Whey Protein Shake & Banana', type: 'snack' as const, cal: 280, p: 32, c: 34, f: 3 },
    { name: 'Eggs, Avocado Toast & Spinach', type: 'breakfast' as const, cal: 520, p: 26, c: 38, f: 24 },
    { name: 'Lean Turkey Wrap & Hummus', type: 'lunch' as const, cal: 480, p: 42, c: 45, f: 14 },
  ];

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    onAddMeal({
      name: mealName,
      mealType,
      calories: Number(calories),
      proteinG: Number(proteinG),
      carbsG: Number(carbsG),
      fatG: Number(fatG),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setMealName('');
    confetti({ particleCount: 35, spread: 50 });
  };

  const handlePresetSelect = (preset: typeof mealPresets[0]) => {
    onAddMeal({
      name: preset.name,
      mealType: preset.type,
      calories: preset.cal,
      proteinG: preset.p,
      carbsG: preset.c,
      fatG: preset.f,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    confetti({ particleCount: 30, spread: 45 });
  };

  const handleAddWaterQuick = (amount: number) => {
    onAddHydration(amount);
    if (totalWater + amount >= targetWaterMl && totalWater < targetWaterMl) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-8 pb-16" id="nutrition-hydration-view">
      {/* View Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
          <Utensils className="w-4 h-4" />
          Fuel & Hydration Architecture
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
          Daily Nutrition, Macros & Water Tracker
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Precision nutrient timing and cellular hydration logging for peak athletic recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: HYDRATION ENGINE (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold uppercase text-white">
                    Daily Water Intake
                  </h2>
                  <span className="text-xs text-zinc-400">Target: {targetWaterMl} ml</span>
                </div>
              </div>

              <button
                onClick={onResetHydration}
                className="text-zinc-500 hover:text-zinc-300 text-xs p-1"
                title="Reset today's hydration"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive Visual Water Cylinder / Level */}
            <div className="flex flex-col items-center py-4 bg-zinc-900/60 rounded-2xl border border-zinc-800">
              <div className="relative w-32 h-44 bg-zinc-950 rounded-3xl border-2 border-sky-500/40 p-2 overflow-hidden flex flex-col justify-end shadow-inner">
                {/* Ambient Wave Fill */}
                <div
                  className="w-full bg-gradient-to-t from-sky-600 via-sky-500 to-cyan-400 rounded-2xl transition-all duration-700 relative"
                  style={{ height: `${waterPct}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl" />
                </div>

                {/* Percentage readout in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-display font-black text-white drop-shadow">
                    {waterPct}%
                  </span>
                  <span className="text-[10px] font-bold text-sky-200 uppercase tracking-widest drop-shadow">
                    {totalWater} ml
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="text-lg font-mono-num font-bold text-white">
                  {totalWater} <span className="text-xs font-normal text-zinc-400">/ {targetWaterMl} ml</span>
                </div>
                <span className="text-xs text-zinc-400">
                  {waterPct >= 100
                    ? 'Target complete! Cellular electrolyte balance optimized.'
                    : `${targetWaterMl - totalWater} ml remaining today.`}
                </span>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Quick Fluid Add:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '+250 ml', amount: 250, desc: 'Small Glass' },
                  { label: '+500 ml', amount: 500, desc: 'Sport Bottle' },
                  { label: '+750 ml', amount: 750, desc: 'Hydration Flask' },
                ].map((item) => (
                  <button
                    key={item.amount}
                    id={`btn-add-water-${item.amount}`}
                    onClick={() => handleAddWaterQuick(item.amount)}
                    className="p-3 bg-zinc-900 border border-zinc-800 hover:border-sky-500/60 rounded-xl text-center transition-all group active:scale-95"
                  >
                    <span className="text-sm font-bold text-sky-400 block group-hover:text-sky-300">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom amount add */}
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
              <input
                type="number"
                value={customWaterAmount}
                onChange={(e) => setCustomWaterAmount(Number(e.target.value))}
                step="50"
                min="50"
                max="2000"
                className="w-28 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
              />
              <button
                onClick={() => handleAddWaterQuick(customWaterAmount)}
                className="flex-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add Custom ml
              </button>
            </div>

            {/* Today's Hydration Log Entries */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Today's Fluid Log ({hydrations.length} entries):
              </span>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {hydrations.length === 0 ? (
                  <div className="text-xs text-zinc-500 py-3 text-center">No water logged yet today.</div>
                ) : (
                  hydrations.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between bg-zinc-900/60 px-3 py-2 rounded-xl text-xs border border-zinc-800/60"
                    >
                      <span className="text-zinc-300 font-mono flex items-center gap-1.5">
                        <Droplets className="w-3 h-3 text-sky-400" />
                        +{log.amountMl} ml
                      </span>
                      <span className="text-zinc-500 text-[11px]">{log.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MEALS & MACROS TRACKER (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Daily Macros Overview Banner */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-display font-bold uppercase text-white">
                  Daily Caloric & Macronutrient Balance
                </h2>
                <span className="text-xs text-zinc-400">
                  Target: {targetCalories} kcal • High Protein Muscle Recovery
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono-num font-black text-white">
                  {totalCalories}{' '}
                  <span className="text-xs font-normal text-zinc-400">/ {targetCalories} kcal</span>
                </span>
              </div>
            </div>

            {/* Macro Breakdown Rings / Gauges */}
            <div className="grid grid-cols-3 gap-3 font-mono-num">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 text-center">
                <span className="text-xs uppercase font-extrabold text-orange-400 block">PROTEIN</span>
                <span className="text-xl font-bold text-white">{totalProtein}g</span>
                <span className="text-[10px] text-zinc-500 block">Target: 160g</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 text-center">
                <span className="text-xs uppercase font-extrabold text-emerald-400 block">CARBS</span>
                <span className="text-xl font-bold text-white">{totalCarbs}g</span>
                <span className="text-[10px] text-zinc-500 block">Target: 250g</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 text-center">
                <span className="text-xs uppercase font-extrabold text-yellow-400 block">FATS</span>
                <span className="text-xl font-bold text-white">{totalFat}g</span>
                <span className="text-[10px] text-zinc-500 block">Target: 65g</span>
              </div>
            </div>

            {/* Quick Athlete Food Presets */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Quick Athlete Meal Presets:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {mealPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset)}
                    className="p-2.5 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 rounded-xl text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-zinc-200 block line-clamp-1">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {preset.cal} kcal • P: {preset.p}g
                      </span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Log Custom Meal Form */}
            <form onSubmit={handleCreateMeal} className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block">
                Log Custom Meal / Post-Workout Fuel
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    placeholder="Meal description (e.g. Steak, Sweet Potato & Asparagus)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack / Post-Workout</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono-num">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Calories</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Protein (g)</label>
                  <input
                    type="number"
                    value={proteinG}
                    onChange={(e) => setProteinG(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbsG}
                    onChange={(e) => setCarbsG(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Fat (g)</label>
                  <input
                    type="number"
                    value={fatG}
                    onChange={(e) => setFatG(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-meal"
                className="w-full py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-600/20"
              >
                Save Meal Log
              </button>
            </form>

            {/* Logged Meals List */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Today's Logged Meals ({meals.length}):
              </span>

              <div className="space-y-2">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded-full bg-zinc-950 text-orange-400 border border-zinc-800">
                          {meal.mealType}
                        </span>
                        <span className="text-xs text-zinc-500">{meal.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{meal.name}</h4>
                      <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-1">
                        <span className="text-white font-bold">{meal.calories} kcal</span>
                        <span>P: {meal.proteinG}g</span>
                        <span>C: {meal.carbsG}g</span>
                        <span>F: {meal.fatG}g</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteMeal(meal.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 rounded-lg transition-colors"
                      title="Delete meal entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
