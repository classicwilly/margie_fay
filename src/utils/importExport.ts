import { Sop } from '../types';

export function exportSops(sops: Sop[]) {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), sops }, null, 2);
}

export function importSops(payload: string): { sops: Sop[] } {
  try {
    const parsed = JSON.parse(payload) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid payload: sops array missing');
    }
    const parsedObj = parsed as Record<string, unknown>;
    if (!Array.isArray(parsedObj.sops)) {
      throw new Error('Invalid payload: sops array missing');
    }
    // Minimal validation
    const arr = parsedObj.sops as unknown[];
    const validated: Sop[] = arr
      .filter((s: unknown): s is Sop => {
        if (typeof s !== 'object' || s === null) return false;
        const obj = s as Record<string, unknown>;
        return typeof obj.title === 'string' && (Array.isArray(obj.steps) || typeof obj.description === 'string');
      })
      .map(s => s as Sop);
    return { sops: validated };
  } catch {
    throw new Error('Could not parse SOP export');
  }
}

export default { exportSops, importSops };

export function exportChecklists(checklists: Record<string, unknown>[]) {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), checklists }, null, 2);
}

export function importChecklists(payload: string): { checklists: Record<string, unknown>[] } {
  try {
    const parsed = JSON.parse(payload) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid payload: checklists array missing');
    }
    const parsedObj = parsed as Record<string, unknown>;
    if (!Array.isArray(parsedObj.checklists)) {
      throw new Error('Invalid payload: checklists array missing');
    }
    return { checklists: parsedObj.checklists as Record<string, unknown>[] };
  } catch {
    throw new Error('Could not parse checklist export');
  }
}