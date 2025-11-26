export function dualTestId(cockpitId?: string, workshopId?: string) {
  const attrs: { [k: string]: string } = {};
  if (cockpitId) {
    attrs["data-testid"] = cockpitId;
  }
  if (workshopId) {
    attrs["data-workshop-testid"] = workshopId;
  }
  return attrs;
}

export default dualTestId;
