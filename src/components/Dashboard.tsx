import React, { useState } from 'react';
import {
  Activity,
  Flame,
  TrendingUp,
  MapPin,
  Footprints,
  Heart,
  Plus,
  CheckCircle2,
  Trophy,
  Droplets,
  Utensils,
  Watch,
  Sparkles,
  ArrowUpRight,
  Share2,
  MessageSquare,
  ThumbsUp,
  Timer,
  Compass,
} from 'lucide-react';
import {
  WorkoutActivity,
  FitnessGoal,
  WearableDevice,
  SportType,
  MealItem,
  HydrationLog,
} from '../types';
import confetti from 'canvas-confetti';

interface DashboardProps {
  workouts: WorkoutActivity[];
  goals: FitnessGoal[];
  wearables: WearableDevice[];
  meals: MealItem[];
  hydrations: HydrationLog[];
  onOpenLogWorkout: () => void;
  onSelectActivityForSplits: (activity: WorkoutActivity) => void;
  onNavigateTab: (tab: any) => void;
  onToggleGoalComplete: (goalId: string) => void;
  onAddGoal: (goal: Partial<FitnessGoal>) => void;
  onLikeActivity: (activityId: string) => void;
  userName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  workouts,
  goals,
  wearables,
  meals,
  hydrations,
  onOpenLogWorkout,
  onSelectActivityForSplits,
  onNavigateTab,
  onToggleGoalComplete,
  onAddGoal,
  onLikeActivity,
  userName,
}) => {
  const [statsViewMode, setStatsViewMode] = useState<'community' | 'personal'>('community');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<FitnessGoal['category']>('weekly_mileage');
  const [newGoalTarget, setNewGoalTarget] = useState(50);
  const [newGoalSport, setNewGoalSport] = useState<SportType>('run');

  // Calculate personal aggregates
  const totalPersonalMiles = workouts
    .reduce((acc, w) => acc + w.distanceKm * 0.621371, 0)
    .toFixed(1);
  const totalPersonalWorkouts = workouts.length;
  const totalPersonalRoutes = Math.max(12, workouts.filter((w) => w.distanceKm > 0).length * 2);

  // Community aggregate counters (matching the reference screenshot visual style)
  const communityStats = {
    miles: '9.42',
    routes: '1.85',
    workouts: '2.44',
  };

  // Active wearable device
  const primaryWearable = wearables[0] || null;

  // Today nutrition calculations
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalWater = hydrations.reduce((sum, h) => sum + h.amountMl, 0);
  const targetWater = 3000;
  const targetCalories = 2400;

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    let unit = 'km';
    if (newGoalCategory === 'water_daily') unit = 'ml';
    if (newGoalCategory === 'weight_lifted') unit = 'kg';
    if (newGoalCategory === 'monthly_hours') unit = 'm';

    onAddGoal({
      title: newGoalTitle,
      category: newGoalCategory,
      sport: newGoalSport,
      targetValue: Number(newGoalTarget),
      currentValue: 0,
      unit,
      deadline: 'This Month',
      isCompleted: false,
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setShowAddGoalModal(false);
    setNewGoalTitle('');
  };

  const getSportIcon = (sport: SportType) => {
    switch (sport) {
      case 'run':
        return <Footprints className="w-4 h-4 text-orange-400" />;
      case 'cycle':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'strength':
        return <Flame className="w-4 h-4 text-rose-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-16" id="aura-dashboard-view">
      {/* 1. TOP HERO AGGREGATE STATS (Inspired by the user's uploaded reference screenshot) */}
      <section
        id="hero-telemetry-banner"
        className="bg-black border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center"
      >
        {/* Ambient athletic glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-b from-orange-600/20 via-red-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-orange-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Global & Athlete Telemetry Sync
              </span>
              <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-white uppercase mt-1">
                BUILT TO MAKE YOU <span className="text-orange-500">BETTER</span>
              </h1>
            </div>

            {/* Toggle Community vs Personal Stats */}
            <div className="inline-flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs">
              <button
                id="btn-stats-community"
                onClick={() => setStatsViewMode('community')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  statsViewMode === 'community'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Aura Community
              </button>
              <button
                id="btn-stats-personal"
                onClick={() => setStatsViewMode('personal')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  statsViewMode === 'personal'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                My Stats ({userName})
              </button>
            </div>
          </div>

          {/* 3 High-Impact Stat Columns (Exact Reference Styling) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-800/80">
            {/* Miles Logged */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center mb-3 text-red-500">
                {/* Red Arch/Logo icon from reference */}
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L4 22h5l3-8 3 8h5L12 2z" />
                </svg>
              </div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">
                {statsViewMode === 'community' ? 'MILES LOGGED' : 'MY MILES LOGGED'}
              </span>
              <div className="text-4xl sm:text-6xl font-display font-black text-white mt-1 tracking-tight">
                {statsViewMode === 'community' ? communityStats.miles : totalPersonalMiles}
              </div>
              <span className="text-sm font-bold text-zinc-400">
                {statsViewMode === 'community' ? 'Billion' : 'Miles recorded'}
              </span>
            </div>

            {/* Routes Created */}
            <div className="flex flex-col items-center justify-center p-4 border-y md:border-y-0 md:border-x border-zinc-800/80">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center mb-3 text-red-500">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">
                ROUTES CREATED
              </span>
              <div className="text-4xl sm:text-6xl font-display font-black text-white mt-1 tracking-tight">
                {statsViewMode === 'community' ? communityStats.routes : totalPersonalRoutes}
              </div>
              <span className="text-sm font-bold text-zinc-400">
                {statsViewMode === 'community' ? 'Billion' : 'Custom GPS paths'}
              </span>
            </div>

            {/* Workouts Logged */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center mb-3 text-red-500">
                <Footprints className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">
                WORKOUTS LOGGED
              </span>
              <div className="text-4xl sm:text-6xl font-display font-black text-white mt-1 tracking-tight">
                {statsViewMode === 'community' ? communityStats.workouts : totalPersonalWorkouts}
              </div>
              <span className="text-sm font-bold text-zinc-400">
                {statsViewMode === 'community' ? 'Billion' : 'Sessions completed'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WEARABLE REAL-TIME TELEMETRY BAR */}
      {primaryWearable && (
        <section
          id="live-wearable-telemetry-strip"
          className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white uppercase">
                  {primaryWearable.name}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                Battery: {primaryWearable.batteryLevel}% • {primaryWearable.firmwareVersion}
              </span>
            </div>
          </div>

          {/* Real-time telemetry metrics */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap font-mono-num">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <div>
                <div className="text-xs text-zinc-400">Live HR</div>
                <div className="text-sm font-bold text-white">
                  {primaryWearable.liveStats.heartRateBpm}{' '}
                  <span className="text-[10px] text-zinc-400">BPM</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
              <Compass className="w-4 h-4 text-orange-400" />
              <div>
                <div className="text-xs text-zinc-400">Cadence</div>
                <div className="text-sm font-bold text-white">
                  {primaryWearable.liveStats.cadenceSpm}{' '}
                  <span className="text-[10px] text-zinc-400">SPM</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
              <Flame className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs text-zinc-400">Burned</div>
                <div className="text-sm font-bold text-white">
                  {primaryWearable.liveStats.activeCalories}{' '}
                  <span className="text-[10px] text-zinc-400">kcal</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('wearables')}
              className="ml-auto text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>Watch Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* 3. GOALS & PROGRESS SECTION */}
      <section id="fitness-goals-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold uppercase text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              Active Goals & Milestones
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Personal targets with progress tracking and automatic telemetry sync
            </p>
          </div>

          <button
            id="btn-add-new-goal"
            onClick={() => setShowAddGoalModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 text-zinc-200 text-xs font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span>Set New Goal</span>
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            return (
              <div
                key={goal.id}
                id={`goal-card-${goal.id}`}
                className={`p-4 rounded-2xl border transition-all ${
                  goal.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getSportIcon(goal.sport)}
                    <span className="text-xs font-bold text-zinc-300 line-clamp-1">
                      {goal.title}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onToggleGoalComplete(goal.id);
                      if (!goal.isCompleted) {
                        confetti({ particleCount: 40, spread: 50 });
                      }
                    }}
                    className={`p-1 rounded-lg transition-colors ${
                      goal.isCompleted
                        ? 'text-emerald-400 hover:text-emerald-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                    title={goal.isCompleted ? 'Completed' : 'Mark as completed'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar & Value */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-mono-num font-bold text-white text-base">
                      {goal.currentValue}{' '}
                      <span className="text-xs font-normal text-zinc-400">
                        / {goal.targetValue} {goal.unit}
                      </span>
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        pct >= 100 ? 'text-emerald-400' : 'text-orange-400'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 100
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-orange-600 to-red-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <span>Deadline: {goal.deadline}</span>
                    {pct >= 100 ? (
                      <span className="text-emerald-400 font-bold">Goal Hit!</span>
                    ) : (
                      <span>{(goal.targetValue - goal.currentValue).toFixed(1)} {goal.unit} left</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. DAILY HEALTH SNAPSHOT (Nutrition & Water summary card) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water Hydration Quick View */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-sky-400">
              <Droplets className="w-4 h-4" />
              Daily Water Hydration
            </div>
            <div className="text-2xl font-mono-num font-extrabold text-white">
              {totalWater}{' '}
              <span className="text-sm font-normal text-zinc-400">/ {targetWater} ml</span>
            </div>
            <p className="text-xs text-zinc-400">
              {totalWater >= targetWater
                ? 'Optimal hydration achieved for recovery!'
                : `${targetWater - totalWater}ml remaining to reach optimal athletic fluid target.`}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('nutrition')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-sky-600/20"
          >
            Log Water
          </button>
        </div>

        {/* Meal & Fueling Quick View */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase font-bold text-amber-400">
              <Utensils className="w-4 h-4" />
              Daily Nutrition & Macros
            </div>
            <div className="text-2xl font-mono-num font-extrabold text-white">
              {totalCalories}{' '}
              <span className="text-sm font-normal text-zinc-400">/ {targetCalories} kcal</span>
            </div>
            <p className="text-xs text-zinc-400">
              {meals.length} meals logged today. High protein balance maintained.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('nutrition')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-amber-600/20"
          >
            Log Meal
          </button>
        </div>
      </section>

      {/* 5. RECENT ACTIVITIES FEED WITH SPLITS & SOCIAL KUDOS */}
      <section id="recent-activities-feed" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold uppercase text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Recent Workout Feed
            </h2>
            <p className="text-xs text-zinc-400">
              Paces, elevation profiles, splits telemetry, and community cheers
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('charts')}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <span>View Full Telemetry</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {workouts.map((activity) => (
            <div
              key={activity.id}
              id={`activity-item-${activity.id}`}
              className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl p-5 transition-all shadow-md"
            >
              {/* Athlete header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {activity.user.name}
                      </span>
                      {activity.user.isLocalLegend && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                          👑 Local Legend
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400">
                      {activity.date} • {activity.user.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-zinc-950 border border-zinc-800 text-orange-400 flex items-center gap-1.5">
                    {getSportIcon(activity.sport)}
                    {activity.sport}
                  </span>
                </div>
              </div>

              {/* Title & Notes */}
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  {activity.title}
                </h3>
                {activity.notes && (
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60">
                    "{activity.notes}"
                  </p>
                )}
              </div>

              {/* Metric stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3.5 mb-4 font-mono-num">
                <div>
                  <span className="text-[11px] uppercase font-bold text-zinc-400">Distance</span>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {activity.distanceKm > 0 ? `${activity.distanceKm} km` : 'Gym Session'}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] uppercase font-bold text-zinc-400">Duration</span>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {activity.durationMinutes} min
                  </div>
                </div>

                <div>
                  <span className="text-[11px] uppercase font-bold text-zinc-400">Avg Pace / Speed</span>
                  <div className="text-base sm:text-lg font-bold text-orange-400">
                    {activity.avgPace}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] uppercase font-bold text-zinc-400">Calories</span>
                  <div className="text-base sm:text-lg font-bold text-white">
                    {activity.caloriesBurned} kcal
                  </div>
                </div>
              </div>

              {/* Splits Telemetry Preview trigger */}
              {activity.splits && activity.splits.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">
                      Split Breakdown ({activity.splits.length} intervals):
                    </span>
                    <button
                      onClick={() => onSelectActivityForSplits(activity)}
                      className="text-orange-400 hover:text-orange-300 font-bold underline"
                    >
                      Analyze Full Graph & Elevation →
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {activity.splits.map((split) => (
                      <div
                        key={split.splitNumber}
                        className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 text-center"
                      >
                        <span className="text-[10px] text-zinc-500 font-bold block">
                          Km {split.splitNumber}
                        </span>
                        <span className="text-xs font-mono font-bold text-white block">
                          {split.paceMinutes}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Interactions (Likes/Sparks, Comments, Share) */}
              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLikeActivity(activity.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                      activity.likedByMe
                        ? 'bg-orange-600/20 text-orange-400 font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${activity.likedByMe ? 'fill-current' : ''}`} />
                    <span>{activity.likes} Aura Sparks</span>
                  </button>

                  <button
                    onClick={() => onSelectActivityForSplits(activity)}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 px-2 py-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{activity.commentsCount} comments</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Activity share link copied to clipboard!');
                  }}
                  className="text-zinc-400 hover:text-zinc-200 p-1.5"
                  title="Share Activity"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SET NEW GOAL MODAL */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-display font-bold uppercase text-white mb-1">
              Create Athletic Goal
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Set milestones for weekly mileage, strength, or hydration.
            </p>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. 50km Monthly Trail Distance"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Sport
                  </label>
                  <select
                    value={newGoalSport}
                    onChange={(e) => setNewGoalSport(e.target.value as SportType)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="run">Running</option>
                    <option value="cycle">Cycling</option>
                    <option value="strength">Strength / Gym</option>
                    <option value="hike">Hiking</option>
                    <option value="swim">Swimming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={newGoalCategory}
                    onChange={(e) =>
                      setNewGoalCategory(e.target.value as FitnessGoal['category'])
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="weekly_mileage">Weekly Mileage (km)</option>
                    <option value="monthly_hours">Elevation / Ascent (m)</option>
                    <option value="weight_lifted">Weight Lifted (kg)</option>
                    <option value="water_daily">Daily Hydration (ml)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
                  Target Metric Value
                </label>
                <input
                  type="number"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/30"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
