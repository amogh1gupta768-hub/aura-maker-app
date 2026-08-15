export type SportType = 'run' | 'cycle' | 'strength' | 'swim' | 'walk' | 'hiit' | 'hike';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';

export interface WorkoutActivity {
  id: string;
  title: string;
  sport: SportType;
  date: string; // ISO or formatted
  durationMinutes: number;
  distanceKm: number;
  caloriesBurned: number;
  avgPace: string; // e.g. "5:12 /km" or "8:22 /mi"
  avgHeartRate: number; // BPM
  maxHeartRate: number;
  elevationGainM: number;
  splits: { splitNumber: number; paceMinutes: string; elevationM: number; hr: number }[];
  notes?: string;
  likes: number;
  likedByMe?: boolean;
  commentsCount: number;
  user: {
    name: string;
    avatar: string;
    location: string;
    isLocalLegend?: boolean;
  };
}

export interface MealItem {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  time: string;
}

export interface HydrationLog {
  id: string;
  amountMl: number;
  time: string;
}

export interface FitnessGoal {
  id: string;
  title: string;
  sport: SportType;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
  category: 'weekly_mileage' | 'monthly_hours' | 'weight_lifted' | 'pace_target' | 'water_daily';
}

export interface WearableDevice {
  id: string;
  name: string;
  type: 'apple_watch' | 'wear_os' | 'garmin' | 'whoop';
  batteryLevel: number;
  isConnected: boolean;
  lastSyncTime: string;
  firmwareVersion: string;
  liveStats: {
    heartRateBpm: number;
    cadenceSpm: number;
    paceMinKm: string;
    wristTempC: number;
    bloodOxygenSpO2: number;
    hrvMs: number;
    activeCalories: number;
    stepsToday: number;
  };
}

export interface CommunityChallenge {
  id: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  badgeName: string;
  sponsor?: string;
  targetDescription: string;
  totalParticipants: number;
  userProgressPct: number;
  daysRemaining: number;
  isJoined: boolean;
  reward: string;
}

export interface LeaderboardEntry {
  rank: number;
  athleteName: string;
  avatar: string;
  platform: 'iOS' | 'Android' | 'Web' | 'Apple Watch' | 'WearOS';
  metricValue: string;
  pointsOrScore: number;
  isCurrentUser?: boolean;
  isLocalLegend?: boolean;
  badge?: string;
}

export interface AICoachPlan {
  coachSummary: string;
  dailyRecommendation: {
    workoutTitle: string;
    durationMinutes: number;
    estimatedCalories: number;
    intensity: string;
    warmup: string[];
    mainSets: { exercise: string; sets: string; repsOrDuration: string; rpe: string }[];
    cooldown: string[];
  };
  nutritionInsights: string[];
  smartRecoveryTips: string[];
}

export type BodyPartId =
  | 'chest'
  | 'lats_back'
  | 'quads'
  | 'hamstrings_glutes'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'core_abs'
  | 'calves'
  | 'lower_back_traps';

export type EquipmentSetup = 'full_gym' | 'no_machines_home' | 'dumbbells_only' | 'bodyweight_only' | 'bands_only';

export interface MuscleExerciseGuide {
  id: string;
  name: string;
  type: 'machine' | 'dumbbell_barbell' | 'bodyweight_calisthenics' | 'resistance_band' | 'home_alternative';
  primaryTarget: string;
  secondaryMuscles: string[];
  equipmentNeeded: string;
  whyItIsBestForConcentration: string;
  optimalSetsAndReps: {
    hypertrophy: string;
    strength: string;
    endurance: string;
    tempo: string;
  };
  mindMuscleCues: string[];
  commonMistakes: string[];
  setupGuide: string;
}

export interface BodyPartProfile {
  id: BodyPartId;
  name: string;
  anatomicalRegion: string;
  iconTag: string;
  keyFunctions: string;
  bestMachines: MuscleExerciseGuide[];
  bestNoMachineAlternatives: MuscleExerciseGuide[];
  setAnalysisAdvice: {
    recommendedWeeklySets: string;
    optimalRestInterval: string;
    intensityTechnique: string;
    warmupProtocol: string;
  };
}

export interface AIBodyPartAnalysisResponse {
  bodyPart: string;
  equipmentAvailable: EquipmentSetup;
  targetGoal: string;
  coachInsight: string;
  bestMachines: MuscleExerciseGuide[];
  bestAlternatives: MuscleExerciseGuide[];
  prescribedWorkoutSession: {
    title: string;
    focus: string;
    sets: {
      exerciseName: string;
      category: string;
      recommendedSets: string;
      targetReps: string;
      rpeOrRir: string;
      restTimeSec: number;
      cue: string;
    }[];
  };
  progressiveOverloadTip: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private';
  hideHomeMapRadiusM: number;
  shareHeartRateZones: boolean;
  shareMealLogs: boolean;
  crossPlatformLeaderboard: boolean;
  allowAIAnalysis: boolean;
}

export interface AccessibilitySettings {
  theme: 'dark' | 'eye-friendly' | 'light';
  highContrast: boolean;
  textScale: 'normal' | 'large' | 'xlarge';
  audioFeedback: boolean;
  reduceMotion: boolean;
}

export interface AdminLogItem {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  details: string;
  status: 'success' | 'warning' | 'info';
}
