import type { FC } from "react";
import ContentCard from "../ContentCard";

const EssentialsTrackerModule: FC = () => {
  return (
    <ContentCard title="🥗 Daily Essentials">
      <p className="text-text-light text-opacity-80 text-center p-4">
        This module has been deprecated. Its functionality is now integrated
        into the 'Daily Command Module' for a more unified daily workflow.
      </p>
    </ContentCard>
  );
};

export default EssentialsTrackerModule;
