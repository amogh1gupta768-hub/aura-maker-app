import React, { useState, useEffect } from 'react';
import {
  WorkoutActivity,
  MealItem,
  HydrationLog,
  FitnessGoal,
  WearableDevice,
  CommunityChallenge,
  LeaderboardEntry,
  AccessibilitySettings,
  PrivacySettings,
  SkillLevel,
} from './types';
import {
  INITIAL_USER,
  INITIAL_WORKOUTS,
  INITIAL_MEALS,
  INITIAL_HYDRATION,
  INITIAL_GOALS,
  INITIAL_WEARABLES,
  INITIAL_CHALLENGES,
  INITIAL_LEADERBOARD,
  DEFAULT_ACCESSIBILITY,
  DEFAULT_PRIVACY,
} from './data/mockData';
import { AccessibilityBar } from './components/AccessibilityBar';
import { Navbar, TabType, DeviceFrameType } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ProgressCharts } from './components/ProgressCharts';
import { NutritionHydration } from './components/NutritionHydration';
import { AICoachSection } from './components/AICoachSection';
import { SocialCompete } from './components/SocialCompete';
import { WearablesSync } from './components/WearablesSync';
import { CloudBackupModal } from './components/CloudBackupModal';
import { AdminAuditLogs } from './components/AdminAuditLogs';
import { LogWorkoutModal } from './components/LogWorkoutModal';

export default function App() {
  // Navigation & Frame State
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrameType>('responsive');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // User Profile
  const [user, setUser] = useState(INITIAL_USER);

  // App Data
  const [workouts, setWorkouts] = useState<WorkoutActivity[]>(INITIAL_WORKOUTS);
  const [goals, setGoals] = useState<FitnessGoal[]>(INITIAL_GOALS);
  const [meals, setMeals] = useState<MealItem[]>(INITIAL_MEALS);
  const [hydrations, setHydrations] = useState<HydrationLog[]>(INITIAL_HYDRATION);
  const [wearables, setWearables] = useState<WearableDevice[]>(INITIAL_WEARABLES);
  const [challenges, setChallenges] = useState<CommunityChallenge[]>(INITIAL_CHALLENGES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  // Configuration & A11y
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);
  const [privacy, setPrivacy] = useState<PrivacySettings>(DEFAULT_PRIVACY);

  // Modals & Active Selections
  const [isLogWorkoutOpen, setIsLogWorkoutOpen] = useState(false);
  const [selectedActivityForSplits, setSelectedActivityForSplits] = useState<WorkoutActivity | undefined>(
    workouts[0]
  );

  // Load from local storage or cloud on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aura_maker_local_state_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.workouts) setWorkouts(parsed.workouts);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.meals) setMeals(parsed.meals);
        if (parsed.hydrations) setHydrations(parsed.hydrations);
        if (parsed.accessibility) setAccessibility(parsed.accessibility);
        if (parsed.privacy) setPrivacy(parsed.privacy);
      }
    } catch (e) {
      console.warn('Local state read error:', e);
    }
  }, []);

  // Save changes locally
  useEffect(() => {
    try {
      const stateToSave = {
        workouts,
        goals,
        meals,
        hydrations,
        accessibility,
        privacy,
      };
      localStorage.setItem('aura_maker_local_state_v1', JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Local state write error:', e);
    }
  }, [workouts, goals, meals, hydrations, accessibility, privacy]);

  // Audio chimes helper
  const playSoundChime = () => {
    if (!accessibility.audioFeedback) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  // Handlers
  const handleSaveWorkout = (
    newWorkoutData: Omit<WorkoutActivity, 'id' | 'likes' | 'commentsCount' | 'user'>
  ) => {
    playSoundChime();
    const newWorkout: WorkoutActivity = {
      ...newWorkoutData,
      id: `act-${Date.now()}`,
      likes: 1,
      commentsCount: 0,
      user: {
        name: user.name,
        avatar: user.avatar,
        location: user.location,
        isLocalLegend: true,
      },
    };

    setWorkouts([newWorkout, ...workouts]);
    setUser((prev) => ({
      ...prev,
      auraPoints: prev.auraPoints + Math.round(newWorkout.caloriesBurned / 2),
      streakDays: prev.streakDays + 1,
    }));

    // Update goal progress if sport matches
    setGoals((prev) =>
      prev.map((g) => {
        if (g.sport === newWorkout.sport && !g.isCompleted) {
          const updatedVal =
            g.category === 'weekly_mileage'
              ? g.currentValue + newWorkout.distanceKm
              : g.category === 'monthly_hours'
              ? g.currentValue + newWorkout.elevationGainM
              : g.currentValue;
          return {
            ...g,
            currentValue: Number(updatedVal.toFixed(1)),
            isCompleted: updatedVal >= g.targetValue,
          };
        }
        return g;
      })
    );
  };

  const handleToggleGoal = (goalId: string) => {
    playSoundChime();
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const isDone = !g.isCompleted;
          return {
            ...g,
            isCompleted: isDone,
            currentValue: isDone ? g.targetValue : Math.max(0, g.currentValue - 5),
          };
        }
        return g;
      })
    );
  };

  const handleAddGoal = (goalData: Partial<FitnessGoal>) => {
    playSoundChime();
    const newGoal: FitnessGoal = {
      id: `goal-${Date.now()}`,
      title: goalData.title || 'Personal Goal',
      sport: goalData.sport || 'run',
      category: goalData.category || 'weekly_mileage',
      targetValue: goalData.targetValue || 40,
      currentValue: 0,
      unit: goalData.unit || 'km',
      deadline: goalData.deadline || 'This Month',
      isCompleted: false,
    };
    setGoals([...goals, newGoal]);
  };

  const handleLikeActivity = (activityId: string) => {
    playSoundChime();
    setWorkouts((prev) =>
      prev.map((w) => {
        if (w.id === activityId) {
          const liked = !w.likedByMe;
          return {
            ...w,
            likedByMe: liked,
            likes: liked ? w.likes + 1 : w.likes - 1,
          };
        }
        return w;
      })
    );
  };

  const handleAddMeal = (mealData: Omit<MealItem, 'id'>) => {
    playSoundChime();
    const newMeal: MealItem = {
      ...mealData,
      id: `meal-${Date.now()}`,
    };
    setMeals([newMeal, ...meals]);
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals(meals.filter((m) => m.id !== mealId));
  };

  const handleAddHydration = (amountMl: number) => {
    playSoundChime();
    const newHyd: HydrationLog = {
      id: `hyd-${Date.now()}`,
      amountMl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setHydrations([newHyd, ...hydrations]);
  };

  const handleResetHydration = () => {
    setHydrations([]);
  };

  const handleJoinChallenge = (challengeId: string) => {
    playSoundChime();
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId ? { ...c, isJoined: true, userProgressPct: 15 } : c
      )
    );
  };

  const handleSyncAllWearables = () => {
    playSoundChime();
    setWearables((prev) =>
      prev.map((w) => ({
        ...w,
        lastSyncTime: 'Just now',
        liveStats: {
          ...w.liveStats,
          stepsToday: w.liveStats.stepsToday + 340,
          activeCalories: w.liveStats.activeCalories + 25,
        },
      }))
    );
  };

  const handleToggleWearable = (deviceId: string) => {
    setWearables((prev) =>
      prev.map((w) => (w.id === deviceId ? { ...w, isConnected: !w.isConnected } : w))
    );
  };

  const handleSwitchUserProfile = (profile: {
    id: string;
    name: string;
    avatar: string;
    skillLevel: SkillLevel;
  }) => {
    playSoundChime();
    setUser((prev) => ({
      ...prev,
      id: profile.id,
      name: profile.name,
      avatar: profile.avatar,
      skillLevel: profile.skillLevel,
    }));
  };

  const handleRestoreFullState = (restored: any) => {
    if (restored.workouts) setWorkouts(restored.workouts);
    if (restored.goals) setGoals(restored.goals);
    if (restored.meals) setMeals(restored.meals);
    if (restored.hydrations) setHydrations(restored.hydrations);
    if (restored.privacy) setPrivacy(restored.privacy);
  };

  // Accessibility class strings
  const textScaleClass =
    accessibility.textScale === 'xlarge'
      ? 'text-scale-xlarge'
      : accessibility.textScale === 'large'
      ? 'text-scale-large'
      : 'text-scale-normal';

  const themeClass =
    accessibility.theme === 'eye-friendly'
      ? 'theme-eye-friendly'
      : accessibility.theme === 'light'
      ? 'bg-zinc-100 text-zinc-900'
      : 'bg-zinc-950 text-zinc-100';

  const highContrastClass = accessibility.highContrast ? 'high-contrast' : '';

  return (
    <div
      id="aura-maker-app-root"
      className={`min-h-screen transition-all ${themeClass} ${textScaleClass} ${highContrastClass} antialiased`}
    >
      {/* 1. Accessibility Control Ribbon */}
      <AccessibilityBar
        settings={accessibility}
        onUpdate={(newS) => setAccessibility((prev) => ({ ...prev, ...newS }))}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(t) => setCurrentTab(t)}
        onOpenLogWorkout={() => setIsLogWorkoutOpen(true)}
        streakDays={user.streakDays}
        auraPoints={user.auraPoints}
        deviceFrame={deviceFrame}
        onChangeDeviceFrame={(frame) => setDeviceFrame(frame)}
        userName={user.name}
        userAvatar={user.avatar}
      />

      {/* 3. Main Content Container (with Device Simulation Frame Wrapping) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div
          className={`${
            deviceFrame === 'iphone'
              ? 'max-w-[420px] mx-auto border-8 border-zinc-800 rounded-[50px] p-4 shadow-2xl bg-zinc-950 overflow-hidden'
              : deviceFrame === 'android'
              ? 'max-w-[440px] mx-auto border-8 border-zinc-800 rounded-[40px] p-4 shadow-2xl bg-zinc-950 overflow-hidden'
              : deviceFrame === 'watch'
              ? 'max-w-[400px] mx-auto'
              : 'w-full'
          } transition-all duration-300`}
        >
          {currentTab === 'dashboard' && (
            <Dashboard
              workouts={workouts}
              goals={goals}
              wearables={wearables}
              meals={meals}
              hydrations={hydrations}
              onOpenLogWorkout={() => setIsLogWorkoutOpen(true)}
              onSelectActivityForSplits={(act) => {
                setSelectedActivityForSplits(act);
                setCurrentTab('charts');
              }}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onToggleGoalComplete={handleToggleGoal}
              onAddGoal={handleAddGoal}
              onLikeActivity={handleLikeActivity}
              userName={user.name}
            />
          )}

          {currentTab === 'charts' && (
            <ProgressCharts
              workouts={workouts}
              selectedActivity={selectedActivityForSplits}
              onSelectActivity={(act) => setSelectedActivityForSplits(act)}
            />
          )}

          {currentTab === 'nutrition' && (
            <NutritionHydration
              meals={meals}
              hydrations={hydrations}
              onAddMeal={handleAddMeal}
              onDeleteMeal={handleDeleteMeal}
              onAddHydration={handleAddHydration}
              onResetHydration={handleResetHydration}
            />
          )}

          {currentTab === 'ai-coach' && (
            <AICoachSection
              recentWorkouts={workouts}
              userSkillLevel={user.skillLevel}
              onSkillLevelChange={(lvl) => setUser((u) => ({ ...u, skillLevel: lvl }))}
              onLogCompletedWorkout={(w) => handleSaveWorkout(w as any)}
              audioFeedback={accessibility.audioFeedback}
            />
          )}

          {currentTab === 'compete' && (
            <SocialCompete
              challenges={challenges}
              leaderboard={leaderboard}
              workouts={workouts}
              onJoinChallenge={handleJoinChallenge}
              onLikeActivity={handleLikeActivity}
              isOnline={isOnline}
              userName={user.name}
            />
          )}

          {currentTab === 'wearables' && (
            <WearablesSync
              wearables={wearables}
              onSyncAll={handleSyncAllWearables}
              onToggleDeviceConnection={handleToggleWearable}
            />
          )}

          {currentTab === 'backup' && (
            <CloudBackupModal
              userId={user.id}
              userName={user.name}
              onSwitchUser={handleSwitchUserProfile}
              privacy={privacy}
              onUpdatePrivacy={(newP) => setPrivacy((prev) => ({ ...prev, ...newP }))}
              isOnline={isOnline}
              appState={{ workouts, goals, meals, hydrations, privacy }}
              onRestoreState={handleRestoreFullState}
            />
          )}

          {currentTab === 'admin' && <AdminAuditLogs />}
        </div>
      </main>

      {/* 4. Log Activity Modal */}
      <LogWorkoutModal
        isOpen={isLogWorkoutOpen}
        onClose={() => setIsLogWorkoutOpen(false)}
        onSaveWorkout={handleSaveWorkout}
        userName={user.name}
      />
    </div>
  );
}
