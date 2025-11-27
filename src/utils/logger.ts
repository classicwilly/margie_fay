/* eslint-disable no-console */
// Centralized debug logger; keeps console usage in a single file and
// enables future toggles (local storage, environment variables, etc.)
import win from './win';

export const isDebugEnabled = () => {
  // Use typed window helper to avoid any casts and runtime exceptions
  return !!win?.__WONKY_DEBUG__;
};

export const logDebug = (...args: unknown[]) => {
  if (isDebugEnabled()) console.debug('[WONKY_DEBUG]', ...args);
};

export const logInfo = (...args: unknown[]) => {
  if (isDebugEnabled()) console.info('[WONKY_INFO]', ...args);
};

export const logWarn = (...args: unknown[]) => {
  if (isDebugEnabled()) console.warn('[WONKY_WARN]', ...args);
};

export const logError = (...args: unknown[]) => {
  // Errors are important enough to always display; don't gate them behind DEBUG
  console.error('[WONKY_ERROR]', ...args);
};

export default {
  isDebugEnabled,
  logDebug,
  logInfo,
  logWarn,
  logError,
};
