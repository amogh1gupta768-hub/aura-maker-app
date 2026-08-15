import React, { useState } from 'react';
import {
  Dumbbell,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Activity,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Sliders,
  Play,
  RotateCcw,
  Check,
  Plus,
  Flame,
  Info,
  Timer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  BodyPartId,
  BodyPartProfile,
  EquipmentSetup,
  SkillLevel,
  MuscleExerciseGuide,
  AIBodyPartAnalysisResponse,
} from '../types';
import { MUSCLE_PROFILES } from '../data/muscleData';
import confetti from 'canvas-confetti';

interface MuscleMachineAnalyzerProps {
  userSkillLevel: SkillLevel;
  onSkillLevelChange: (lvl: SkillLevel) => void;
  onLogCompletedWorkout?: (workoutData: any) => void;
  audioFeedback?: boolean;
}

export const MuscleMachineAnalyzer: React.FC<MuscleMachineAnalyzerProps> = ({
  userSkillLevel,
  onSkillLevelChange,
  onLogCompletedWorkout,
  audioFeedback,
}) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPartId>('chest');
  const [equipmentMode, setEquipmentMode] = useState<EquipmentSetup>('full_gym');
  const [trainingGoal, setTrainingGoal] = useState<'hypertrophy' | 'strength' | 'endurance'>('hypertrophy');
  const [viewMode, setViewMode] = useState<'both' | 'machines_only' | 'alternatives_only'>('both');
  
  // AI Dynamic Custom Analysis State
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [customUserNotes, setCustomUserNotes] = useState('');
  const [aiCustomResponse, setAiCustomResponse] = useState<AIBodyPartAnalysisResponse | null>(null);
  const [showAiCustomBox, setShowAiCustomBox] = useState(false);

  // Active Set Logger for the chosen muscle group
  const [loggedSets, setLoggedSets] = useState<
    { id: string; exerciseName: string; weightKg: number; reps: number; rpe: number; isDone: boolean }[]
  >([
    { id: 'set-1', exerciseName: 'Incline Chest Press Machine', weightKg: 60, reps: 10, rpe: 8, isDone: true },
    { id: 'set-2', exerciseName: 'Incline Chest Press Machine', weightKg: 65, reps: 9, rpe: 8.5, isDone: true },
    { id: 'set-3', exerciseName: 'Incline Chest Press Machine', weightKg: 65, reps: 8, rpe: 9.5, isDone: false },
  ]);

  const [newSetWeight, setNewSetWeight] = useState<number>(65);
  const [newSetReps, setNewSetReps] = useState<number>(10);
  const [newSetRpe, setNewSetRpe] = useState<number>(8.5);

  const currentProfile: BodyPartProfile = MUSCLE_PROFILES[selectedBodyPart];

  const handleFetchAiAnalysis = async () => {
    setIsAiAnalyzing(true);
    try {
      const res = await fetch('/api/ai-bodypart-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyPart: selectedBodyPart,
          equipmentSetup: equipmentMode,
          userGoal: trainingGoal,
          experienceLevel: userSkillLevel,
          userNotes: customUserNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiCustomResponse(data);
        setShowAiCustomBox(true);
        confetti({ particleCount: 50, spread: 60 });
      }
    } catch (e) {
      console.error('Error analyzing body part with AI:', e);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleAddLoggedSet = (exerciseName: string) => {
    const newSet = {
      id: `logged-set-${Date.now()}`,
      exerciseName,
      weightKg: Number(newSetWeight),
      reps: Number(newSetReps),
      rpe: Number(newSetRpe),
      isDone: true,
    };
    setLoggedSets([...loggedSets, newSet]);
    confetti({ particleCount: 25, spread: 45 });
  };

  const handleToggleSetDone = (id: string) => {
    setLoggedSets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isDone: !s.isDone } : s))
    );
  };

  const bodyPartTabs: { id: BodyPartId; label: string; icon: any }[] = [
    { id: 'chest', label: 'Chest / Pecs', icon: Shield },
    { id: 'lats_back', label: 'Lats & Back', icon: Layers },
    { id: 'quads', label: 'Quads', icon: Zap },
    { id: 'hamstrings_glutes', label: 'Hamstrings & Glutes', icon: Activity },
    { id: 'shoulders', label: 'Shoulders & Delts', icon: Compass },
    { id: 'biceps', label: 'Biceps', icon: Dumbbell },
    { id: 'triceps', label: 'Triceps', icon: Zap },
    { id: 'core_abs', label: 'Core & Abs', icon: Shield },
    { id: 'calves', label: 'Calves', icon: Activity },
    { id: 'lower_back_traps', label: 'Lower Back & Traps', icon: Layers },
  ];

  return (
    <div className="space-y-8" id="muscle-machine-analyzer-view">
      {/* 1. SECTION HEADER */}
      <div className="bg-gradient-to-r from-orange-950/40 via-zinc-900 to-zinc-950 border border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 flex items-center gap-1.5 bg-orange-950/60 border border-orange-500/30 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-4 h-4 text-orange-400" />
              AI Muscle Concentration & Equipment Substitution Engine
            </span>

            {/* Level Selector */}
            <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 text-xs">
              <span className="px-2 text-zinc-400 font-semibold uppercase text-[10px]">Level:</span>
              {(['Beginner', 'Intermediate', 'Advanced', 'Elite'] as SkillLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onSkillLevelChange(lvl)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    userSkillLevel === lvl
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl font-display font-black uppercase text-white tracking-tight">
            Target Muscle, Best Machine & <span className="text-orange-500">No-Machine Substitutes</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
            Select any body part to discover the <strong>optimal gym machine</strong> engineered for direct fiber recruitment and peak isolation. If you don't have access to that machine, get the <strong>scientifically validated home, dumbbell, resistance band, or bodyweight alternatives</strong> with matching resistance curves and set schemes.
          </p>
        </div>
      </div>

      {/* 2. BODY PART SELECTOR GRID */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-orange-400" />
            1. Select Body Part You Want To Concentrate On:
          </span>
          <span className="text-xs text-orange-400 font-mono font-bold">
            Active: {currentProfile.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {bodyPartTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = selectedBodyPart === tab.id;
            return (
              <button
                key={tab.id}
                id={`btn-select-muscle-${tab.id}`}
                onClick={() => {
                  setSelectedBodyPart(tab.id);
                  setAiCustomResponse(null);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-600 to-red-600 border-orange-400 text-white shadow-lg shadow-orange-600/30 scale-[1.02]'
                    : 'bg-zinc-900/70 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-orange-400'}`} />
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <span className="text-xs font-bold block leading-tight">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. EQUIPMENT AVAILABILITY & GOAL TOGGLES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Equipment Setup Status (7 cols) */}
        <div className="md:col-span-7 bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            2. Your Equipment Availability:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'full_gym', label: 'Full Gym (Machines Ready)', desc: 'Commercial equipment' },
              { id: 'no_machines_home', label: 'No Machines (Home Workout)', desc: 'Zero gym machines' },
              { id: 'dumbbells_only', label: 'Dumbbells / Free Weights', desc: 'Adjustable DBs' },
              { id: 'bodyweight_only', label: 'Bodyweight / Calisthenics', desc: 'Zero equipment' },
              { id: 'bands_only', label: 'Resistance Bands Only', desc: 'Loop & tube bands' },
            ].map((eq) => (
              <button
                key={eq.id}
                onClick={() => setEquipmentMode(eq.id as EquipmentSetup)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  equipmentMode === eq.id
                    ? 'bg-orange-950/40 border-orange-500 text-white shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="text-xs font-bold block text-white">{eq.label}</span>
                <span className="text-[10px] text-zinc-500 block">{eq.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Training Goal & View Filter (5 cols) */}
        <div className="md:col-span-5 bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            3. Training Target:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hypertrophy', label: 'Hypertrophy', sub: 'Muscle Size' },
              { id: 'strength', label: 'Strength', sub: 'Power / Load' },
              { id: 'endurance', label: 'Endurance', sub: 'Burn / Toning' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setTrainingGoal(g.id as any)}
                className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all text-center ${
                  trainingGoal === g.id
                    ? 'bg-orange-600 text-white border-orange-500 shadow'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                <span className="block">{g.label}</span>
                <span className="text-[9px] lowercase font-normal opacity-80">{g.sub}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Filter View:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setViewMode('both')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                  viewMode === 'both' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Compare Both
              </button>
              <button
                onClick={() => setViewMode('machines_only')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                  viewMode === 'machines_only' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Best Machines
              </button>
              <button
                onClick={() => setViewMode('alternatives_only')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                  viewMode === 'alternatives_only' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Best Alternatives
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ANATOMICAL OVERVIEW & SET ANALYSIS CARD */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400">
              Target Muscle Biomechanics
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase">
              {currentProfile.name}
            </h3>
            <span className="text-xs text-zinc-400 font-mono mt-0.5 block">
              {currentProfile.anatomicalRegion}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 px-3.5 py-2 rounded-2xl border border-zinc-800 text-xs">
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">Function</span>
              <span className="text-zinc-200">{currentProfile.keyFunctions}</span>
            </div>
          </div>
        </div>

        {/* Set & Rest Analysis Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono-num">
          <div className="bg-zinc-900/70 p-3.5 rounded-2xl border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Weekly Volume</span>
            <span className="text-sm font-bold text-white block mt-0.5">
              {currentProfile.setAnalysisAdvice.recommendedWeeklySets}
            </span>
          </div>

          <div className="bg-zinc-900/70 p-3.5 rounded-2xl border border-zinc-800">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Rest Between Sets</span>
            <span className="text-sm font-bold text-orange-400 block mt-0.5">
              {currentProfile.setAnalysisAdvice.optimalRestInterval}
            </span>
          </div>

          <div className="bg-zinc-900/70 p-3.5 rounded-2xl border border-zinc-800 sm:col-span-2">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Intensity Technique</span>
            <span className="text-xs font-semibold text-emerald-400 block mt-0.5">
              {currentProfile.setAnalysisAdvice.intensityTechnique}
            </span>
          </div>
        </div>
      </div>

      {/* 5. SIDE-BY-SIDE OR FOCUSED EXERCISE SHOWCASE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT / TOP: THE BEST GYM MACHINES FOR MAXIMUM CONCENTRATION */}
        {(viewMode === 'both' || viewMode === 'machines_only') && (
          <div className={`${viewMode === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold uppercase text-white">
                    The Best Gym Machines
                  </h3>
                  <span className="text-xs text-zinc-400">
                    Engineered for direct fiber isolation & zero stabilizer leak
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 bg-orange-950/60 text-orange-400 border border-orange-500/30 rounded-xl">
                Commercial Gold Standard
              </span>
            </div>

            <div className="space-y-4">
              {currentProfile.bestMachines.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-zinc-950 border border-orange-500/30 rounded-3xl p-6 shadow-xl space-y-4 hover:border-orange-500/60 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-orange-400 block">
                        Primary Isolation Machine
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                        {exercise.name}
                      </h4>
                      <span className="text-xs text-zinc-400">
                        Target: <strong className="text-white">{exercise.primaryTarget}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddLoggedSet(exercise.name)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-orange-500/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Set</span>
                    </button>
                  </div>

                  {/* Why it is best for concentration */}
                  <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                    <strong className="text-orange-400 block mb-1 uppercase text-[10px] tracking-wider">
                      Why It Concentrates Fibers Best:
                    </strong>
                    {exercise.whyItIsBestForConcentration}
                  </div>

                  {/* Optimal Sets, Reps & Tempo Matrix */}
                  <div className="grid grid-cols-2 gap-2 font-mono-num text-xs">
                    <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 block">
                        Hypertrophy Sets (Size)
                      </span>
                      <span className="text-xs font-bold text-white">
                        {exercise.optimalSetsAndReps.hypertrophy}
                      </span>
                    </div>

                    <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 block">
                        Strength Sets (Load)
                      </span>
                      <span className="text-xs font-bold text-orange-400">
                        {exercise.optimalSetsAndReps.strength}
                      </span>
                    </div>

                    <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80 col-span-2">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 block">
                        Optimal Tempo & Fiber Tension
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {exercise.optimalSetsAndReps.tempo}
                      </span>
                    </div>
                  </div>

                  {/* Mind-Muscle Cues */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Mind-Muscle Form Cues:
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-300">
                      {exercise.mindMuscleCues.map((cue, ci) => (
                        <li key={ci} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Machine Setup Guide */}
                  <div className="text-[11px] text-zinc-400 bg-zinc-900/40 px-3 py-2 rounded-xl border border-zinc-800/60">
                    <strong className="text-zinc-300">Setup Tip:</strong> {exercise.setupGuide}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RIGHT / BOTTOM: BEST NO-MACHINE / HOME / CALISTHENICS ALTERNATIVES */}
        {(viewMode === 'both' || viewMode === 'alternatives_only') && (
          <div className={`${viewMode === 'both' ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold uppercase text-white">
                    Best No-Machine Alternatives
                  </h3>
                  <span className="text-xs text-zinc-400">
                    Dumbbells, calisthenics, bands & home equipment substitutes
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-xl">
                No Machine Needed
              </span>
            </div>

            <div className="space-y-4">
              {currentProfile.bestNoMachineAlternatives.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-zinc-950 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4 hover:border-emerald-500/60 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                            exercise.type === 'bodyweight_calisthenics'
                              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                              : exercise.type === 'resistance_band'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : exercise.type === 'home_alternative'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {exercise.type.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                        {exercise.name}
                      </h4>
                      <span className="text-xs text-zinc-400">
                        Equipment: <strong className="text-zinc-200">{exercise.equipmentNeeded}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddLoggedSet(exercise.name)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-emerald-500/30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Set</span>
                    </button>
                  </div>

                  {/* Why it replicates machine concentration */}
                  <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                    <strong className="text-emerald-400 block mb-1 uppercase text-[10px] tracking-wider">
                      How It Replicates Machine Resistance:
                    </strong>
                    {exercise.whyItIsBestForConcentration}
                  </div>

                  {/* Optimal Sets, Reps & Tempo */}
                  <div className="grid grid-cols-2 gap-2 font-mono-num text-xs">
                    <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 block">
                        Hypertrophy Sets
                      </span>
                      <span className="text-xs font-bold text-white">
                        {exercise.optimalSetsAndReps.hypertrophy}
                      </span>
                    </div>

                    <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 block">
                        Strength Sets
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {exercise.optimalSetsAndReps.strength}
                      </span>
                    </div>

                    <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/80 col-span-2">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 block">
                        Alternative Tempo & Partials
                      </span>
                      <span className="text-xs font-bold text-yellow-400">
                        {exercise.optimalSetsAndReps.tempo}
                      </span>
                    </div>
                  </div>

                  {/* Mind-Muscle Cues */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                      Execution Cues for Maximum Isolation:
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-300">
                      {exercise.mindMuscleCues.map((cue, ci) => (
                        <li key={ci} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Setup Tip */}
                  <div className="text-[11px] text-zinc-400 bg-zinc-900/40 px-3 py-2 rounded-xl border border-zinc-800/60">
                    <strong className="text-zinc-300">Home Setup:</strong> {exercise.setupGuide}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. AI REAL-TIME COACH CONSULTATION & CUSTOM SUBSTITUTION BAR */}
      <div className="bg-zinc-950 border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-display font-black text-white uppercase">
                Ask AI Coach for Custom Machine & Set Analysis
              </h3>
              <p className="text-xs text-zinc-400">
                Have an injury, specific equipment limitation, or need a customized set breakdown?
              </p>
            </div>
          </div>

          <button
            id="btn-run-ai-bodypart-analysis"
            onClick={handleFetchAiAnalysis}
            disabled={isAiAnalyzing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 hover:from-orange-500 hover:to-red-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAiAnalyzing ? 'Analyzing Biomechanics...' : 'Run Gemini Set Analysis'}</span>
          </button>
        </div>

        <div>
          <input
            type="text"
            value={customUserNotes}
            onChange={(e) => setCustomUserNotes(e.target.value)}
            placeholder="e.g. 'I have a clicky shoulder on flat bench, give me the safest upper chest substitute with dumbbells and 4 sets'"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* AI Dynamic Response Card */}
        {aiCustomResponse && (
          <div className="bg-zinc-900/90 border border-orange-500/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold text-orange-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Gemini Coach Prescription for {aiCustomResponse.bodyPart.toUpperCase()}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Setup: {aiCustomResponse.equipmentAvailable.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
              "{aiCustomResponse.coachInsight}"
            </p>

            {/* Prescribed Sets Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                Prescribed Target Set Progression:
              </span>
              <div className="space-y-2">
                {aiCustomResponse.prescribedWorkoutSession.sets.map((set, si) => (
                  <div
                    key={si}
                    className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-start justify-between gap-4 font-mono-num text-xs"
                  >
                    <div>
                      <span className="text-[10px] text-orange-400 font-bold uppercase block">
                        {set.category}
                      </span>
                      <strong className="text-white text-xs block">{set.exerciseName}</strong>
                      <span className="text-zinc-400 text-[11px] mt-0.5 block">{set.cue}</span>
                    </div>

                    <div className="text-right whitespace-nowrap">
                      <span className="text-xs font-bold text-white block">{set.recommendedSets} x {set.targetReps}</span>
                      <span className="text-[11px] text-emerald-400 font-bold">{set.rpeOrRir}</span>
                      <span className="text-[10px] text-zinc-500 block">Rest: {set.restTimeSec}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-orange-950/30 border border-orange-500/30 rounded-xl text-xs text-orange-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span><strong>Progressive Overload Strategy:</strong> {aiCustomResponse.progressiveOverloadTip}</span>
            </div>
          </div>
        )}
      </div>

      {/* 7. INTERACTIVE SET LOGGER & PROGRESSIVE OVERLOAD TRACKER */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              Progressive Overload & Set Performance Tracker
            </span>
            <h3 className="text-lg sm:text-xl font-display font-bold uppercase text-white mt-0.5">
              Live Set Logger for {currentProfile.name}
            </h3>
          </div>

          <button
            onClick={() => {
              if (onLogCompletedWorkout) {
                onLogCompletedWorkout({
                  title: `Targeted ${currentProfile.name} Hypertrophy Protocol`,
                  sport: 'strength',
                  durationMinutes: 40,
                  caloriesBurned: 320,
                  notes: `Logged ${loggedSets.length} sets targeting ${currentProfile.name}.`,
                });
                confetti({ particleCount: 70, spread: 70 });
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-all"
          >
            Save & Broadcast Workout
          </button>
        </div>

        {/* Quick Add Set Form */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 font-mono-num">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
              Load / Weight (kg or lbs)
            </label>
            <input
              type="number"
              step="2.5"
              value={newSetWeight}
              onChange={(e) => setNewSetWeight(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
              Completed Reps
            </label>
            <input
              type="number"
              value={newSetReps}
              onChange={(e) => setNewSetReps(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
              RPE / Intensity (1-10)
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="10"
              value={newSetRpe}
              onChange={(e) => setNewSetRpe(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleAddLoggedSet(currentProfile.bestMachines[0].name)}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Record Set</span>
            </button>
          </div>
        </div>

        {/* Logged Sets List */}
        <div className="space-y-2">
          {loggedSets.map((s, index) => (
            <div
              key={s.id}
              onClick={() => handleToggleSetDone(s.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between font-mono-num ${
                s.isDone
                  ? 'bg-zinc-900/90 border-emerald-500/40 text-zinc-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    s.isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                  }`}
                >
                  #{index + 1}
                </div>
                <div>
                  <span className={`text-xs font-bold block ${s.isDone ? 'text-white' : 'text-zinc-500'}`}>
                    {s.exerciseName}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {s.weightKg} kg × {s.reps} reps
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-orange-400">RPE {s.rpe}</span>
                <CheckCircle2
                  className={`w-5 h-5 ${
                    s.isDone ? 'text-emerald-400 fill-emerald-500/20' : 'text-zinc-700'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
