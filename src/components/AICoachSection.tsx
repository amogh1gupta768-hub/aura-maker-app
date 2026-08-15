import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Flame,
  Shield,
  Dumbbell,
  Clock,
  Heart,
  ChevronRight,
  Zap,
  Info,
  Volume2,
  Sliders,
  Layers,
  MessageSquare,
} from 'lucide-react';
import {
  SkillLevel,
  SportType,
  WorkoutActivity,
  AICoachPlan,
} from '../types';
import { MuscleMachineAnalyzer } from './MuscleMachineAnalyzer';
import confetti from 'canvas-confetti';

interface AICoachSectionProps {
  recentWorkouts: WorkoutActivity[];
  userSkillLevel: SkillLevel;
  onSkillLevelChange: (lvl: SkillLevel) => void;
  onLogCompletedWorkout: (workout: Partial<WorkoutActivity>) => void;
  audioFeedback: boolean;
}

export const AICoachSection: React.FC<AICoachSectionProps> = ({
  recentWorkouts,
  userSkillLevel,
  onSkillLevelChange,
  onLogCompletedWorkout,
  audioFeedback,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'muscle_machine' | 'daily_prescriptions' | 'live_consultant'>('muscle_machine');
  const [selectedFocus, setSelectedFocus] = useState<'recovery' | 'tempo_run' | 'hypertrophy' | 'vo2max_intervals' | 'climb_endurance'>('tempo_run');
  const [isLoading, setIsLoading] = useState(false);
  const [coachPlan, setCoachPlan] = useState<AICoachPlan | null>({
    coachSummary:
      'Based on your Boulder Foothills tempo run and 45% Zone 2 aerobic base, your cardiovascular system is primed for progressive threshold surges with muscular stability maintenance.',
    dailyRecommendation: {
      workoutTitle: 'Adaptive Threshold Tempo & Core Stability',
      durationMinutes: 45,
      estimatedCalories: 480,
      intensity: 'Moderate-High (RPE 7.5)',
      warmup: [
        '5 min Dynamic Mobility (High Knees, Butt Kicks, Leg Swings)',
        '1 km Easy Aerobic Jog in Zone 1 (<120 BPM)',
        '3x 100m Accelerations with Walkback Recovery',
      ],
      mainSets: [
        {
          exercise: 'Threshold Tempo Block 1',
          sets: '1 set',
          repsOrDuration: '10 mins @ 5:15 /km pace',
          rpe: 'RPE 7.5',
        },
        {
          exercise: 'Active Jog Recovery',
          sets: '1 set',
          repsOrDuration: '3 mins easy jog',
          rpe: 'RPE 4.0',
        },
        {
          exercise: 'Threshold Tempo Block 2',
          sets: '1 set',
          repsOrDuration: '10 mins @ 5:05 /km pace',
          rpe: 'RPE 8.0',
        },
        {
          exercise: 'Core Circuit: Planks & Deadbugs',
          sets: '3 sets',
          repsOrDuration: '45 sec hold / 12 reps per side',
          rpe: 'RPE 7.0',
        },
      ],
      cooldown: [
        '5 min Easy Cool Down Walk',
        'Hamstring & Hip Flexor Static Stretch (30s each)',
        'Diaphragmatic Box Breathing (4-4-4-4)',
      ],
    },
    nutritionInsights: [
      'Consume 30-40g fast-acting carbohydrates 30 mins prior to the tempo block.',
      'Rehydrate with 500ml water containing 350mg sodium post-session to optimize cardiac output.',
    ],
    smartRecoveryTips: [
      'Maintain 8+ hours sleep tonight; muscle glycogen synthesis peaks during deep REM cycles.',
      'Gentle foam rolling on calves and IT band post-cooldown to alleviate tendon tension.',
    ],
  });

  // Live Workout Execution State
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);
  const [completedSets, setCompletedSets] = useState<Record<number, boolean>>({});

  // Interactive Quick Chat State
  const [chatQuestion, setChatQuestion] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: 'coach' | 'user'; text: string; time: string }[]
  >([
    {
      role: 'coach',
      text: 'Hello! I am your AI Biomechanics & Training Coach. Ask me how to isolate any muscle, which gym machine provides the best stimulus, or what home/dumbbell substitutes to use if you don’t have access to the machine.',
      time: 'Just now',
    },
  ]);

  const handleSendChat = async () => {
    if (!chatQuestion.trim()) return;
    const userMsg = chatQuestion;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg, time: now }]);
    setChatQuestion('');
    setIsChatting(true);

    try {
      const res = await fetch('/api/ai-bodypart-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bodyPart: 'general_strength',
          equipmentSetup: 'no_machines_home',
          userGoal: 'hypertrophy',
          experienceLevel: userSkillLevel,
          userNotes: userMsg,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText =
          data.coachInsight ||
          `For optimal isolation: focus on a 3-second eccentric tempo and 1-second peak squeeze. If you lack the machine, substitute with dumbbells or deficit pushups/elevated split squats to maintain identical fiber tension.`;
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'coach',
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'coach',
          text: `Focus on controlled tempo and mechanical stretch. For any machine, match its line of pull with free weights or resistance bands.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleGenerateCoachWorkout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai-workout-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillLevel: userSkillLevel,
          focusGoal: selectedFocus,
          recentActivities: recentWorkouts.slice(0, 3).map((w) => ({
            title: w.title,
            sport: w.sport,
            distanceKm: w.distanceKm,
            avgPace: w.avgPace,
            calories: w.caloriesBurned,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCoachPlan(data);
      } else {
        console.warn('API returned error, keeping adaptive plan');
      }
    } catch (err) {
      console.error('Error fetching AI coach workout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLiveWorkout = () => {
    if (!isLiveActive) {
      setIsLiveActive(true);
      const interval = setInterval(() => {
        setLiveSeconds((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else {
      clearInterval(timerInterval);
      setIsLiveActive(false);
    }
  };

  const handleFinishLiveWorkout = () => {
    if (timerInterval) clearInterval(timerInterval);
    setIsLiveActive(false);

    if (coachPlan) {
      onLogCompletedWorkout({
        title: `AI Guided: ${coachPlan.dailyRecommendation.workoutTitle}`,
        sport: 'run',
        durationMinutes: Math.max(1, Math.round(liveSeconds / 60)),
        distanceKm: 5.4,
        caloriesBurned: coachPlan.dailyRecommendation.estimatedCalories,
        avgPace: '5:18 /km',
        avgHeartRate: 156,
        maxHeartRate: 174,
        elevationGainM: 65,
        splits: [
          { splitNumber: 1, paceMinutes: '5:30', elevationM: 12, hr: 145 },
          { splitNumber: 2, paceMinutes: '5:15', elevationM: 24, hr: 158 },
          { splitNumber: 3, paceMinutes: '5:08', elevationM: 29, hr: 166 },
        ],
        notes: `AI Coach suggestion completed on ${userSkillLevel} tier.`,
      });
    }

    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    setLiveSeconds(0);
    setCompletedSets({});
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-16" id="ai-coach-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            AI Strength & Biomechanics Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
            Aura AI Training Coach
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Target specific muscle groups, find the best machines, discover home & dumbbell substitutes, and optimize your sets.
          </p>
        </div>

        {/* Navigation Subtabs */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-1 text-xs">
          <button
            id="tab-muscle-machine"
            onClick={() => setActiveSubTab('muscle_machine')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubTab === 'muscle_machine'
                ? 'bg-orange-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Muscle & Machine Analyzer</span>
          </button>

          <button
            id="tab-daily-prescriptions"
            onClick={() => setActiveSubTab('daily_prescriptions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubTab === 'daily_prescriptions'
                ? 'bg-orange-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Full Daily Session</span>
          </button>

          <button
            id="tab-live-consultant"
            onClick={() => setActiveSubTab('live_consultant')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeSubTab === 'live_consultant'
                ? 'bg-orange-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI Coach Chat</span>
          </button>
        </div>
      </div>

      {/* 1. SUBTAB: MUSCLE & MACHINE CONCENTRATION + SUBSTITUTES (PRIMARY FEATURE) */}
      {activeSubTab === 'muscle_machine' && (
        <MuscleMachineAnalyzer
          userSkillLevel={userSkillLevel}
          onSkillLevelChange={onSkillLevelChange}
          onLogCompletedWorkout={onLogCompletedWorkout}
          audioFeedback={audioFeedback}
        />
      )}

      {/* 2. SUBTAB: DAILY ADAPTIVE SESSIONS */}
      {activeSubTab === 'daily_prescriptions' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Focus Goal Buttons & AI Generate Bar */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Select Workout Objective:
              </span>
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
                <span className="px-2 text-zinc-400 font-semibold uppercase text-[10px]">Tier:</span>
                {(['Beginner', 'Intermediate', 'Advanced', 'Elite'] as SkillLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => onSkillLevelChange(lvl)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      userSkillLevel === lvl ? 'bg-orange-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'tempo_run', label: 'Threshold Tempo Run', desc: 'Pace Sustenance' },
                { id: 'vo2max_intervals', label: 'VO2 Max Intervals', desc: 'Speed & Aerobic Peak' },
                { id: 'climb_endurance', label: 'Hill Climb Ascent', desc: 'Leg Power & Vert' },
                { id: 'hypertrophy', label: 'Functional Strength', desc: 'Stability & Armor' },
                { id: 'recovery', label: 'Active Flush Recovery', desc: 'Mobility & Low Strain' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedFocus(item.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedFocus === item.id
                      ? 'bg-orange-950/40 border-orange-500/60 shadow-md text-white'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xs font-bold block text-white">{item.label}</span>
                  <span className="text-[10px] text-zinc-500 block">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-orange-400" />
                <span>
                  Analyzing {recentWorkouts.length} logged sessions • Current Tier:{' '}
                  <strong className="text-white">{userSkillLevel}</strong>
                </span>
              </div>

              <button
                id="btn-generate-ai-workout"
                onClick={handleGenerateCoachWorkout}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Generating Custom Plan...' : 'Prescribe Personalized Workout'}</span>
              </button>
            </div>
          </div>

          {/* Generated Workout Prescription Details */}
          {coachPlan && (
            <div className="space-y-6">
              {/* Coach Analysis Card */}
              <div className="bg-gradient-to-r from-orange-950/30 via-zinc-900 to-zinc-950 border border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Prescribed Session
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-1">
                      {coachPlan.dailyRecommendation.workoutTitle}
                    </h2>
                  </div>

                  {/* Metrics Badge Strip */}
                  <div className="flex items-center gap-2 font-mono-num text-xs">
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-300">
                      ⏱️ {coachPlan.dailyRecommendation.durationMinutes} mins
                    </span>
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-xl text-orange-300">
                      🔥 ~{coachPlan.dailyRecommendation.estimatedCalories} kcal
                    </span>
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-xl text-red-300">
                      ⚡ {coachPlan.dailyRecommendation.intensity}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80 mb-6">
                  "{coachPlan.coachSummary}"
                </p>

                {/* LIVE WORKOUT EXECUTION CONTROL */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-bold text-zinc-400 block">
                        Interactive Live Timer
                      </span>
                      <span className="text-2xl font-mono-num font-black text-white">
                        {formatTimer(liveSeconds)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-toggle-live-workout"
                      onClick={toggleLiveWorkout}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isLiveActive
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isLiveActive ? 'Pause Session' : 'Start Live Guided Mode'}</span>
                    </button>

                    {liveSeconds > 0 && (
                      <button
                        onClick={handleFinishLiveWorkout}
                        className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                      >
                        Finish & Log
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Structured 3-Stage Workout Blocks (Warmup, Main Sets, Cooldown) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Warmup */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                    <RotateCcw className="w-4 h-4" />
                    Phase 1: Dynamic Warm-Up
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {coachPlan.dailyRecommendation.warmup.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60">
                        <span className="text-orange-400 font-bold font-mono">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Main Sets with Checkboxes */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
                    <Flame className="w-4 h-4" />
                    Phase 2: Main Sets & Reps
                  </div>
                  <div className="space-y-2.5">
                    {coachPlan.dailyRecommendation.mainSets.map((set, idx) => {
                      const isChecked = !!completedSets[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() =>
                            setCompletedSets((prev) => ({ ...prev, [idx]: !prev[idx] }))
                          }
                          className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-zinc-300'
                              : 'bg-zinc-900/80 border-zinc-800 text-white hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold ${isChecked ? 'line-through text-zinc-400' : 'text-white'}`}>
                              {set.exercise}
                            </span>
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                isChecked ? 'text-emerald-400 fill-emerald-500/20' : 'text-zinc-600'
                              }`}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                            <span>{set.repsOrDuration}</span>
                            <span className="text-orange-400 font-bold">{set.rpe}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Cooldown & Recovery */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    <Shield className="w-4 h-4" />
                    Phase 3: Cool Down & Recovery
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {coachPlan.dailyRecommendation.cooldown.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60">
                        <span className="text-emerald-400 font-bold font-mono">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Nutrition Timing & Smart Recovery Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                    Target Fueling & Electrolyte Protocol:
                  </span>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {coachPlan.nutritionInsights.map((n, i) => (
                      <li key={i} className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
                    Injury Prevention & Cellular Repair:
                  </span>
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {coachPlan.smartRecoveryTips.map((r, i) => (
                      <li key={i} className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. SUBTAB: LIVE AI COACH CHAT & CONSULTATION */}
      {activeSubTab === 'live_consultant' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold uppercase text-white">
                Live AI Strength & Form Consultant
              </h3>
              <p className="text-xs text-zinc-400">
                Ask about machine adjustments, exercise replacements, biomechanical form cues, or set optimization.
              </p>
            </div>
          </div>

          {/* Chat Transcript */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 text-xs leading-relaxed ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'coach' && (
                  <div className="w-7 h-7 rounded-xl bg-orange-600/30 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl max-w-xl ${
                    msg.role === 'user'
                      ? 'bg-orange-600 text-white rounded-br-none'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-60 block mt-1 text-right">{msg.time}</span>
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex items-center gap-2 text-xs text-zinc-400 italic bg-zinc-900/60 p-3 rounded-2xl w-fit">
                <Sparkles className="w-4 h-4 animate-spin text-orange-400" />
                Coach is analyzing muscle mechanics...
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder="e.g. 'I don't have a hack squat machine, what's the best quad teardrop alternative at home?'"
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isChatting || !chatQuestion.trim()}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Ask Coach
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

