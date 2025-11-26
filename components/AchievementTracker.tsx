import { useRef } from "react";
import type { FC } from "react";
import useProgressVar from "../hooks/useProgressVar";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "./ContentCard";
import { ALL_ACHIEVEMENTS, ADULT_REWARD_TIERS, RewardTier } from "../constants";

const Achievement: FC<{
  emoji: string;
  label: string;
  collected: boolean;
}> = ({ emoji, label, collected }) => {
  return (
    <div
      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${collected ? "bg-accent-green bg-opacity-20" : "bg-gray-800"}`}
    >
      <div
        className={`text-4xl transition-all duration-500 ${collected ? "grayscale-0" : "grayscale"}`}
      >
        {emoji}
      </div>
      <div
        className={`text-xs text-center mt-1 ${collected ? "text-accent-green font-semibold" : "text-text-light text-opacity-70"}`}
      >
        {label}
      </div>
    </div>
  );
};

const RewardTierCard: React.FC<{ tier: RewardTier; isUnlocked: boolean }> = ({
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

const AchievementTracker: FC = () => {
  const { appState } = useAppState();
  // `collectedAchievements` is stored as a map { [id]: { unlockedAt: string } }
  // We derive the count and membership from the map for backward compatibility.
  const collectedIds =
    appState && appState.collectedAchievements
      ? Object.keys(appState.collectedAchievements)
      : [];
  const collectedCount = collectedIds.length;
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
    <ContentCard title="🏆 Achievement System">
      <div className="flex flex-col h-full">
        <div className="grow overflow-y-auto pr-2">
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
                  aria-label={`Achievement progress: ${Math.round(progressPercentage)} percent`}
                >
                  <span className="sr-only">
                    Progress: {Math.round(progressPercentage)}%
                  </span>
                  <div
                    ref={progressRef}
                    className="bg-linear-to-r from-accent-blue to-accent-green h-3 rounded-full transition-all duration-500 progress-fill"
                  />
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
              Collected ({collectedCount}/{totalCount})
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {ALL_ACHIEVEMENTS.map((ach) => (
                <Achievement
                  key={ach.id}
                  emoji={ach.emoji}
                  label={ach.label}
                  collected={Boolean(
                    appState.collectedAchievements &&
                      appState.collectedAchievements[ach.id],
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ContentCard>
  );
};

export { AchievementTracker };
export default AchievementTracker;
