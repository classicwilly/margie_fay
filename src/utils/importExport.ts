import { Sop } from "../types";

export function exportSops(sops: Sop[]) {
  return JSON.stringify(
    { version: 1, exportedAt: new Date().toISOString(), sops },
    null,
    2,
  );
}

export function importSops(payload: string): { sops: Sop[] } {
  try {
    const parsed = JSON.parse(payload);
    if (!parsed || !Array.isArray(parsed.sops)) {
      throw new Error("Invalid payload: sops array missing");
    }
    // Minimal validation
    const validated = parsed.sops.filter(
      (s: any) => s.title && (s.steps || s.description),
    );
    return { sops: validated };
  } catch (err) {
    throw new Error("Could not parse SOP export");
  }
}

export default { exportSops, importSops };

export function exportChecklists(checklists: any[]) {
  return JSON.stringify(
    { version: 1, exportedAt: new Date().toISOString(), checklists },
    null,
    2,
  );
}

export function importChecklists(payload: string): { checklists: any[] } {
  try {
    const parsed = JSON.parse(payload);
    if (!parsed || !Array.isArray(parsed.checklists)) {
      throw new Error("Invalid payload: checklists array missing");
    }
    return { checklists: parsed.checklists };
  } catch (err) {
    throw new Error("Could not parse checklist export");
  }
}
