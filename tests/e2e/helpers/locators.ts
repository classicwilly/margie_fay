export const byWorkshopOrCockpitTestId = (id: string) => {
  // Prefer workshop test ids but fall back to legacy cockpit test ids
  return `[data-workshop-testid="${id}"], [data-testid="${id}"]`;
};

export default byWorkshopOrCockpitTestId;
