import { exportSops, importSops } from '../src/utils/importExport';
import type { Sop } from '../src/types';

describe('importExport utilities', () => {
  it('exports and imports sop JSON correctly', () => {
    const sample: Sop[] = [{ id: 'a', category: 'k', subCategory: 'kids', title: 'A SOP', description: 'desc', steps: ['one'] } as Sop];
    const out = exportSops(sample);
    expect(typeof out).toBe('string');

    const parsed = importSops(out);
    expect(parsed.sops.length).toBe(1);
    expect(parsed.sops[0].title).toBe('A SOP');
  });

  it('throws for invalid payloads', () => {
    expect(() => importSops('not json')).toThrow();
    expect(() => importSops(JSON.stringify({ wrong: true }))).toThrow();
  });
});
