import type { ModuleManifest } from "./types/module";
import { buildDependencyGraph, topologicalSort } from "./utils/module-utils";

type ManifestMap = Map<string, ModuleManifest>;

const manifests: ManifestMap = new Map();
const started: Set<string> = new Set();

export function registerModule(manifest: ModuleManifest) {
  if (!manifest || !manifest.id) {
    console.warn("Attempted to register an invalid module (missing id)");
    return;
  }
  if (manifests.has(manifest.id)) {
    console.warn("Duplicate module id registration attempted:", manifest.id);
    return;
  }
  manifests.set(manifest.id, manifest);
}

export function getAllModules(): ModuleManifest[] {
  return Array.from(manifests.values());
}

export function getEnabledModules(
  moduleStates?: Record<string, boolean>,
): ModuleManifest[] {
  return getAllModules().filter((m) => {
    const override = moduleStates?.[m.id];
    if (override !== undefined) {
      return !!override;
    }
    return !!m.isEnabledByDefault;
  });
}

export function getModuleRoutes(moduleStates?: Record<string, boolean>) {
  const routes: { path: string; component: any; id: string }[] = [];
  for (const m of getEnabledModules(moduleStates)) {
    if (m.route && m.component) {
      routes.push({ path: m.route, component: m.component, id: m.id });
    }
  }
  return routes;
}

export function getModuleReducers(moduleStates?: Record<string, boolean>) {
  const reducers: Record<string, any> = {};
  for (const m of getEnabledModules(moduleStates)) {
    if (m.reducer) {
      reducers[m.id] = m.reducer;
    }
  }
  return reducers;
}

export function getModuleDefaultStates(moduleStates?: Record<string, boolean>) {
  const states: Record<string, any> = {};
  for (const m of getEnabledModules(moduleStates)) {
    if (m.defaultState !== undefined) {
      states[m.id] = m.defaultState;
    }
  }
  return states;
}

export function getModuleServices(moduleStates?: Record<string, boolean>) {
  const services: Record<string, any> = {};
  for (const m of getEnabledModules(moduleStates)) {
    if (m.services) {
      Object.assign(services, m.services);
    }
  }
  return services;
}

export async function initModules() {
  const mods = getAllModules();
  const nodeIds = mods.map((m) => m.id);
  const depEdges: Record<string, string[] | undefined> = {};
  for (const m of mods) {
    depEdges[m.id] = m.dependencies || [];
  }
  const graph = buildDependencyGraph(nodeIds, depEdges);
  let order: string[];
  try {
    order = topologicalSort(graph);
  } catch (e) {
    console.error("Module init failed due to a cycle:", (e as Error).message);
    order = nodeIds;
  }
  for (const id of order) {
    const module = manifests.get(id);
    if (!module) {
      continue;
    }
    try {
      if (module.onLoad) {
        await module.onLoad();
      }
    } catch (e) {
      console.error(`module ${id} onLoad failed`, e);
    }
  }
}

export async function startModules(moduleStates?: Record<string, boolean>) {
  for (const m of getEnabledModules(moduleStates)) {
    try {
      if (m.onStart) {
        await m.onStart();
      }
      started.add(m.id);
    } catch (e) {
      console.error("module onStart failed for", m.id, e);
    }
  }
}

export async function stopModules() {
  for (const id of Array.from(started.values())) {
    const m = manifests.get(id);
    if (!m) {
      continue;
    }
    try {
      if (m.onStop) {
        await m.onStop();
      }
      started.delete(id);
    } catch (e) {
      console.error("module onStop failed for", m.id, e);
    }
  }
}

// Keep backward-compat wrapper at '/src/module_registry'
export default {
  registerModule,
  getAllModules,
  getEnabledModules,
  getModuleRoutes,
  getModuleReducers,
  getModuleDefaultStates,
  getModuleServices,
  initModules,
  startModules,
  stopModules,
};
