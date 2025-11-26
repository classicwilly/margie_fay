// Re-export root 'components/Workshop' so local 'src/components' imports work
// This maintains backward compat in the 'src' path that many files import.
export { default } from "../../components/Workshop";
export { default as Workshop } from "../../components/Workshop";

// NOTE: If you prefer a named export directly in the root Workshop file, you
// can instead align both re-exports to avoid the wrapper. This wrapper keeps
// the surface area small and avoids touching the canonical component.
