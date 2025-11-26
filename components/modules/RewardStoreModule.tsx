import type { FC } from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "../ContentCard.js";
import { Button } from "../Button";
import { REWARD_TIERS } from "../../constants.js";

const RewardStoreModule: FC = () => {
  const { appState, dispatch } = useAppState();
  const {
    dashboardType,
    collectedGems,
    redeemedRewards,
    acknowledgedRedemptions,
  } = appState;

  if (dashboardType !== "willow" && dashboardType !== "sebastian") {
    return null; // This module is only for kids' dashboards
  }

  const personaGems = collectedGems[dashboardType].length;
  const personaRedeemed = redeemedRewards[dashboardType] || [];
  const personaAcknowledged = acknowledgedRedemptions[dashboardType] || [];

  const handleRedeem = (threshold: number) => {
    dispatch({
      type: "REDEEM_REWARD",
      payload: { persona: dashboardType, threshold },
    });
  };

  return (
    <ContentCard title="🎁 Dopamine Mining">
      <p className="text-sm text-text-light text-opacity-80 mb-4">
        Use your dopamine tokens to redeem sensory rewards!
      </p>
      <div className="space-y-3">
        {REWARD_TIERS.map((tier) => {
          const isUnlocked = personaGems >= tier.threshold;
          const isRedeemed = personaRedeemed.includes(tier.threshold);
          const isAcknowledged = personaAcknowledged.includes(tier.threshold);

          let button;
          if (isAcknowledged) {
            button = (
              <Button disabled variant="primary" size="sm">
                ✓ Fulfilled!
              </Button>
            );
          } else if (isRedeemed) {
            button = (
              <Button disabled variant="secondary" size="sm">
                Pending...
              </Button>
            );
          } else if (isUnlocked) {
            button = (
              <Button
                data-testid={`redeem-reward-btn-${tier.threshold}`}
                onClick={() => handleRedeem(tier.threshold)}
                variant="primary"
                size="sm"
              >
                Redeem
              </Button>
            );
          } else {
            button = (
              <Button disabled variant="secondary" size="sm">
                Locked
              </Button>
            );
          }

          return (
            <div
              key={tier.threshold}
              data-testid={`reward-tier-${tier.threshold}`}
              className={`p-3 rounded-lg flex justify-between items-center transition-all duration-300 ${isAcknowledged ? "bg-accent-green/20 border border-accent-green/50" : !isUnlocked ? "opacity-50" : "bg-card-dark"}`}
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">{tier.emoji}</span>
                <div>
                  <h4 className="font-bold text-accent-teal">{tier.title}</h4>
                  <p className="text-xs text-gray-400">
                    Requires {tier.threshold} gems
                  </p>
                </div>
              </div>
              {button}
            </div>
          );
        })}
      </div>
    </ContentCard>
  );
};

export default RewardStoreModule;
