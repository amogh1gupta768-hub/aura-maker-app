import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Award,
  Zap,
  Globe,
  Flame,
  CheckCircle2,
  Share2,
  ThumbsUp,
  MessageSquare,
  ArrowUpRight,
  ShieldAlert,
  Smartphone,
  Watch,
  Plus,
} from 'lucide-react';
import {
  CommunityChallenge,
  LeaderboardEntry,
  WorkoutActivity,
} from '../types';
import confetti from 'canvas-confetti';

interface SocialCompeteProps {
  challenges: CommunityChallenge[];
  leaderboard: LeaderboardEntry[];
  workouts: WorkoutActivity[];
  onJoinChallenge: (challengeId: string) => void;
  onLikeActivity: (activityId: string) => void;
  isOnline: boolean;
  userName: string;
}

export const SocialCompete: React.FC<SocialCompeteProps> = ({
  challenges,
  leaderboard,
  workouts,
  onJoinChallenge,
  onLikeActivity,
  isOnline,
  userName,
}) => {
  const [socialTab, setSocialTab] = useState<'challenges' | 'leaderboards' | 'community_feed' | 'live_segments'>('challenges');
  const [filterPlatform, setFilterPlatform] = useState<string>('All');
  const [simulatedOpponentPace, setSimulatedOpponentPace] = useState(false);

  const filteredLeaderboard = filterPlatform === 'All'
    ? leaderboard
    : leaderboard.filter((entry) => entry.platform === filterPlatform);

  return (
    <div className="space-y-8 pb-16" id="social-compete-view">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            Social Motivation & Global Arena
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase text-white tracking-tight">
            Train, Explore & Compete
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Compete across iOS, Android, Web & Wearables with live verified segments and seasonal challenges.
          </p>
        </div>

        {/* Live Race Simulation indicator */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-opponent-pace"
            onClick={() => setSimulatedOpponentPace(!simulatedOpponentPace)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              simulatedOpponentPace
                ? 'bg-red-950/60 border-red-500/50 text-red-300 shadow-md shadow-red-600/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                simulatedOpponentPace ? 'bg-red-500 animate-ping' : 'bg-zinc-500'
              }`}
            />
            <span>{simulatedOpponentPace ? 'Live Ghost Pacer Active' : 'Enable Ghost Opponent'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'challenges', label: 'Push Your Limits: Challenges' },
          { id: 'leaderboards', label: 'Global & Segment Leaderboards' },
          { id: 'live_segments', label: 'Segment Sprints & Local Legends' },
          { id: 'community_feed', label: 'Community Athlete Feed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSocialTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all border ${
              socialTab === tab.id
                ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. MONTHLY & SEASONAL CHALLENGES (Matches Strava screenshots: REI Trail Running, Dog Days, Marathon Prep) */}
      {socialTab === 'challenges' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-display font-bold uppercase text-white tracking-tight">
              Featured Challenges & Expeditions
            </h2>
            <span className="text-xs text-zinc-400 font-mono">3 Active Expeditions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                id={`challenge-card-${challenge.id}`}
                className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                {/* Banner Image */}
                <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={challenge.bannerImage}
                    alt={challenge.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                  {/* Sponsor badge */}
                  {challenge.sponsor && (
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                      {challenge.sponsor}
                    </div>
                  )}

                  {/* Days remaining badge */}
                  <div className="absolute top-3 right-3 bg-red-600/90 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow">
                    {challenge.daysRemaining} Days Left
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug drop-shadow">
                      {challenge.title}
                    </h3>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {challenge.targetDescription}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                      <Users className="w-3.5 h-3.5 text-orange-400" />
                      <span>{challenge.totalParticipants.toLocaleString()} Athletes joined</span>
                    </div>
                  </div>

                  {/* Progress or Join Button */}
                  <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                    {challenge.isJoined ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Joined & Tracking
                          </span>
                          <span className="font-mono text-white font-bold">
                            {challenge.userProgressPct}%
                          </span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
                          <div
                            className="bg-gradient-to-r from-orange-600 to-red-500 h-full rounded-full"
                            style={{ width: `${challenge.userProgressPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500 block">
                          Reward: {challenge.reward}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onJoinChallenge(challenge.id);
                          confetti({ particleCount: 50, spread: 60 });
                        }}
                        className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-orange-600/20"
                      >
                        Join Challenge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. LEADERBOARDS ACROSS PLATFORMS */}
      {socialTab === 'leaderboards' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold uppercase text-white tracking-tight">
                Cross-Platform Telemetry Leaderboard
              </h2>
              <p className="text-xs text-zinc-400">
                Weekly distance, vertical gain, and verified segment times across all devices.
              </p>
            </div>

            {/* Platform filter */}
            <div className="inline-flex rounded-xl bg-zinc-900 border border-zinc-800 p-1 text-xs">
              {['All', 'Apple Watch', 'WearOS', 'iOS', 'Android', 'Web'].map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPlatform(p)}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    filterPlatform === p
                      ? 'bg-orange-600 text-white font-bold shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-2">
            {filteredLeaderboard.map((athlete) => (
              <div
                key={athlete.athleteName}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                  athlete.isCurrentUser
                    ? 'bg-orange-950/30 border-orange-500/50 shadow-md'
                    : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <span
                    className={`w-7 text-center font-display font-black text-lg ${
                      athlete.rank === 1
                        ? 'text-yellow-400 text-xl'
                        : athlete.rank === 2
                        ? 'text-zinc-300'
                        : athlete.rank === 3
                        ? 'text-amber-600'
                        : 'text-zinc-500'
                    }`}
                  >
                    #{athlete.rank}
                  </span>

                  {/* Avatar */}
                  <img
                    src={athlete.avatar}
                    alt={athlete.athleteName}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                  />

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {athlete.athleteName}
                      </span>
                      {athlete.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          {athlete.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-0.5">
                      <span>{athlete.platform}</span>
                      <span>•</span>
                      <span className="text-zinc-300">{athlete.metricValue}</span>
                    </div>
                  </div>
                </div>

                {/* Score / XP */}
                <div className="text-right font-mono-num">
                  <div className="text-base sm:text-lg font-bold text-orange-400">
                    {athlete.pointsOrScore.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Aura XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SEGMENT SPRINTS & LOCAL LEGENDS */}
      {socialTab === 'live_segments' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold uppercase text-white">
                Live Segment Sprints & Local Legends
              </h2>
              <p className="text-xs text-zinc-400">
                Real-time competitive segments on your favorite roads and mountain trails.
              </p>
            </div>
            <Award className="w-6 h-6 text-yellow-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Boulder Canyon Switchback Sprint (1.4 km, +120m)',
                crHolder: 'Arby Chen (4:12 pace)',
                myBest: '4:28 pace (Rank #2)',
                legend: 'Alex Rivera (You - 24 efforts)',
                crown: '👑 Local Legend Crown is yours!',
              },
              {
                name: 'Sanitas Ridge Vertical Kilometre',
                crHolder: 'David Roche (14:32)',
                myBest: '16:45 (Rank #8)',
                legend: 'Sarah K. (18 efforts)',
                crown: '3 more efforts to claim Crown',
              },
            ].map((seg) => (
              <div key={seg.name} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white">{seg.name}</h3>
                <div className="space-y-1 text-xs font-mono text-zinc-300">
                  <div>🏆 Course Record: <strong className="text-yellow-400">{seg.crHolder}</strong></div>
                  <div>⚡ My PR: <strong className="text-orange-400">{seg.myBest}</strong></div>
                  <div>👑 Current Legend: <strong className="text-white">{seg.legend}</strong></div>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">{seg.crown}</span>
                  <button className="text-orange-400 hover:underline">View Map →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COMMUNITY ATHLETE FEED */}
      {socialTab === 'community_feed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold uppercase text-white">
              Athlete Activity Stream
            </h2>
            <span className="text-xs text-zinc-400">Live Global Sync</span>
          </div>

          <div className="space-y-4">
            {workouts.map((activity) => (
              <div
                key={activity.id}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {activity.user.name}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {activity.date} • {activity.user.location}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/40 border border-orange-500/30 px-2.5 py-1 rounded-lg">
                    {activity.sport.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{activity.title}</h4>
                  {activity.notes && <p className="text-xs text-zinc-300 mt-1">"{activity.notes}"</p>}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/80">
                  <span>{activity.distanceKm} km</span>
                  <span>{activity.durationMinutes} min</span>
                  <span>{activity.avgPace}</span>
                  <span>+{activity.elevationGainM}m vert</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
