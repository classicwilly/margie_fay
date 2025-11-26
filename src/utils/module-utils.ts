// Utilities for modules: topological sort, cycle detection for dependency resolution
export type Graph<T> = Map<T, Set<T>>;

export function buildDependencyGraph<T extends string>(
  nodes: T[],
  edges: Record<T, T[] | undefined>,
): Graph<T> {
  const graph: Graph<T> = new Map();
  nodes.forEach((n) => graph.set(n, new Set()));
  for (const [from, toList] of Object.entries(edges) as [
    T,
    T[] | undefined,
  ][]) {
    if (!toList) {
      continue;
    }
    for (const to of toList) {
      if (!graph.has(from as T)) {
        graph.set(from as T, new Set());
      }
      graph.get(from as T)!.add(to as T);
    }
  }
  return graph;
}

export function topologicalSort<T extends string>(graph: Graph<T>): T[] {
  const inDegree = new Map<T, number>();
  graph.forEach((_, node) => inDegree.set(node, 0));
  graph.forEach((deps) => {
    deps.forEach((to) => inDegree.set(to, (inDegree.get(to) || 0) + 1));
  });
  const queue: T[] = [];
  inDegree.forEach((deg, node) => {
    if (deg === 0) {
      queue.push(node);
    }
  });
  const result: T[] = [];
  while (queue.length) {
    const n = queue.shift()!;
    result.push(n);
    graph.get(n)!.forEach((m) => {
      const newDeg = (inDegree.get(m) || 0) - 1;
      inDegree.set(m, newDeg);
      if (newDeg === 0) {
        queue.push(m);
      }
    });
  }
  if (result.length !== graph.size) {
    throw new Error("Cyclic dependency detected in modules");
  }
  return result;
}
