import React, { useRef } from "react";
import useProgressVar from "@hooks/useProgressVar";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "../ContentCard";
// FIX: Changed imports for types from constants.js to types.ts
import { ALL_ACHIEVEMENTS, ADULT_REWARD_TIERS } from "../../constants";

// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface AchievementCardProps {
  achievement: {
    id: string;
    emoji: string;
    label: string;
    description: string;
  };
  collected: { unlockedAt: string } | null;
}
const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  collected,
}) => {
  const isUnlocked = !!collected;
  return (
    <div
      className={`p-3 rounded-lg border transition-all duration-300 ${isUnlocked ? "bg-accent-green/10 border-accent-green/30" : "bg-gray-800 border-gray-700 opacity-60"}`}
    >
      <div className="flex items-center space-x-3">
        <div className={`text-4xl ${!isUnlocked ? "filter grayscale" : ""}`}>
          {achievement.emoji}
        </div>
        <div>
          <h4
            className={`text-md font-bold ${isUnlocked ? "text-accent-green" : "text-gray-300"}`}
          >
            {achievement.label}
          </h4>
          <p
            className={`text-xs mt-1 ${isUnlocked ? "text-green-400" : "text-gray-300"}`}
          >
            {achievement.description}
          </p>
          {isUnlocked && (
            <p className="text-xs text-gray-500 mt-1">
              Unlocked: {new Date(collected.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface RewardTierCardProps {
  tier: { threshold: number; emoji: string; title: string };
  isUnlocked: boolean;
}
const RewardTierCard: React.FC<RewardTierCardProps> = ({
  tier,
  isUnlocked,
}) => {
  const unlockedClasses =
    "border-accent-green shadow-lg shadow-accent-green/10";
  const lockedClasses = "border-gray-700 filter grayscale opacity-80";

  return (
    <div
      className={`bg-gray-800 rounded-lg p-3 border transition-all duration-300 ${isUnlocked ? unlockedClasses : lockedClasses}`}
    >
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{tier.emoji}</div>
        <div>
          <h4
            className={`text-md font-bold ${isUnlocked ? "text-accent-green" : "text-text-light"}`}
          >
            {tier.title}
          </h4>
          <p
            className={`text-xs mt-1 ${isUnlocked ? "text-accent-green" : "text-gray-300"}`}
          >
            {isUnlocked
              ? "UNLOCKED!"
              : `Requires ${tier.threshold} Achievements`}
          </p>
        </div>
      </div>
    </div>
  );
};

const AchievementTrackerModule = () => {
  const { appState } = useAppState();
  const collectedCount = Object.keys(appState.collectedAchievements).length;
  const totalCount = ALL_ACHIEVEMENTS.length;

  const nextTier = ADULT_REWARD_TIERS.find(
    (tier) => collectedCount < tier.threshold,
  );
  const achievementsForNextTier = nextTier
    ? nextTier.threshold - collectedCount
    : 0;
  const progressPercentage = nextTier
    ? (collectedCount / nextTier.threshold) * 100
    : 100;
  const progressRef = useRef<HTMLDivElement | null>(null);
  useProgressVar(progressRef, progressPercentage);

  return (
    <ContentCard title="🏆 Achievements">
      <div className="flex flex-col h-full">
        <div className="grow overflow-y-auto pr-2 max-h-96" tabIndex={0}>
          <div className="mb-4">
            {nextTier ? (
              <>
                <h3 className="text-md font-semibold text-accent-blue text-center mb-2">
                  Collect {achievementsForNextTier} more to unlock:{" "}
                  <span className="font-bold">{nextTier.title}</span>
                </h3>
                <div
                  className="w-full bg-gray-700 rounded-full h-3"
                  role="progressbar"
                  aria-label={`Achievement progress: ${Math.round(progressPercentage)}%`}
                >
                  <div
                    ref={progressRef}
                    className="bg-linear-to-r from-accent-blue to-accent-green h-3 rounded-full transition-all duration-500 progress-fill"
                  />
                  <span className="sr-only">
                    Progress: {Math.round(progressPercentage)}%
                  </span>
                </div>
              </>
            ) : (
              <h3 className="text-md font-bold text-accent-green text-center">
                🎉 All Tiers Unlocked! System operating at peak efficiency. 🎉
              </h3>
            )}
          </div>

          <div className="space-y-2 mb-4">
            {ADULT_REWARD_TIERS.map((tier) => (
              <RewardTierCard
                key={tier.threshold}
                tier={tier}
                isUnlocked={collectedCount >= tier.threshold}
              />
            ))}
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h4 className="text-center text-accent-teal font-semibold mb-3">
              Achievement Roadmap ({collectedCount}/{totalCount})
            </h4>
            <div className="space-y-2">
              {ALL_ACHIEVEMENTS.map((ach) => (
                <AchievementCard
                  key={ach.id}
                  achievement={ach}
                  collected={appState.collectedAchievements[ach.id]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ContentCard>
  );
};

export default AchievementTrackerModule;
