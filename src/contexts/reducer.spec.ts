import { userReducer } from './userReducer';
import { defaultUserState } from '../../defaultStates';
import type { AppState } from './types';

describe('AppState reducer - profile stacks', () => {
  test('ADD_PROFILE_STACK adds a stack', () => {
    const initial = defaultUserState as AppState;
    const action = { type: 'ADD_PROFILE_STACK', payload: { id: 's1', name: 's1', persona: 'william', audio: 'brown_noise', oral: 'chew', visual: 'sunglasses', notes: '', createdAt: new Date().toISOString() } } as any;
    const res = userReducer(initial, action);
    expect(res.profileStacks.some(s => s.id === 's1')).toBe(true);
  });

  test('APPLY_PROFILE_STACK sets activeProfileStackId', () => {
    const initial = { ...defaultUserState } as AppState;
    initial.profileStacks = [ { id: 's1', name: 's1', persona: 'william', audio: 'brown_noise', oral: 'chew', visual: 'sunglasses', notes: '', createdAt: new Date().toISOString() } ];
    const action = { type: 'APPLY_PROFILE_STACK', payload: 's1' } as any;
    const res = userReducer(initial, action);
    expect(res.activeProfileStackId).toBe('s1');
  });

  test('UPDATE_PROFILE_STACK updates a stack', () => {
    const initial = { ...defaultUserState } as AppState;
    initial.profileStacks = [ { id: 's1', name: 's1', persona: 'william', audio: 'brown_noise', oral: 'chew', visual: 'sunglasses', notes: '', createdAt: new Date().toISOString() } ];
    const action = { type: 'UPDATE_PROFILE_STACK', payload: { id: 's1', name: 'updated' } } as any;
    const res = userReducer(initial, action);
    expect(res.profileStacks.find(s => s.id === 's1')?.name).toBe('updated');
  });

  test('DELETE_PROFILE_STACK removes stack and clears active if necessary', () => {
    const initial = { ...defaultUserState } as AppState;
    initial.profileStacks = [ { id: 's1', name: 's1', persona: 'william', audio: 'brown_noise', oral: 'chew', visual: 'sunglasses', notes: '', createdAt: new Date().toISOString() } ];
    initial.activeProfileStackId = 's1';
    const action = { type: 'DELETE_PROFILE_STACK', payload: 's1' } as any;
    const res = userReducer(initial, action);
    expect(res.profileStacks.find(s => s.id === 's1')).toBeUndefined();
    expect(res.activeProfileStackId).toBeNull();
  });
});

describe('Context restore modal reducer actions', () => {
  test('CONFIRM_VIEW_CHANGE applies savedContext.view and clears modal and saved context', () => {
    const initial = { ...defaultUserState } as any;
    initial.savedContext = { view: 'cockpit', dashboardType: 'william' };
    initial.isContextRestoreModalOpen = true;
    const action = { type: 'CONFIRM_VIEW_CHANGE' } as any;
    const res = userReducer(initial, action);
    expect(res.view).toBe('cockpit');
    expect(res.isContextRestoreModalOpen).toBe(false);
    expect(res.savedContext).toBeNull();
  });
});
