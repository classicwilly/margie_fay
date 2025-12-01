import safeJsonParse from '@utils/safeJsonParse';

describe('safeJsonParse', () => {
  it('returns fallback when value is null or undefined', () => {
    expect(safeJsonParse(null, { foo: 'bar' })).toEqual({ foo: 'bar' });
    expect(safeJsonParse(undefined, { a: 1 })).toEqual({ a: 1 });
  });

  it('parses valid JSON', () => {
    expect(safeJsonParse('{"x":1}', {})).toEqual({ x: 1 });
  });

  it('returns fallback for invalid JSON ("undefined" string)', () => {
    expect(safeJsonParse('undefined', { ok: true })).toEqual({ ok: true });
    expect(safeJsonParse('foo bar', null)).toBeNull();
  });
});
