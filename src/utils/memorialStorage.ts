import { MemorialEntry } from "../data/memorials";

const STORAGE_KEY = "__WONKY_MEMORIALS__";

export function loadMemorials(): MemorialEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as MemorialEntry[];
  } catch (e) {
    console.warn("Failed to load memorials", e);
    return [];
  }
}

export function saveMemorials(items: MemorialEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Failed to save memorials", e);
  }
}

export function clearMemorials() {
  localStorage.removeItem(STORAGE_KEY);
}

export default { loadMemorials, saveMemorials, clearMemorials };
