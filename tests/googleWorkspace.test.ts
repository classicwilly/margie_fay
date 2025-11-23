import { addTaskToGoogle } from '../src/integrations/googleWorkspace';

describe('googleWorkspace integration', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ id: '1' }) })) as any;
  });

  it('sanitizes prompt before calling server proxy', async () => {
    await addTaskToGoogle('Call me at +1 555 555 5555 or bob@example.com');
    expect((global.fetch as any).mock.calls.length).toBe(1);
    const body = JSON.parse((global.fetch as any).mock.calls[0][1].body);
    expect(body.title).not.toContain('+1');
    expect(body.title).not.toContain('bob@example.com');
  });
});
