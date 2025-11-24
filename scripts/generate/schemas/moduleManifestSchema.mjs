import { z } from "zod";

// Basic runtime manifest schema for module manifests. Keep this conservative
// to validate author-provided data but not gate execution of complex
// runtime fields like reducer functions or imported components.

export const ModuleManifestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  route: z.string().optional(),
  isEnabledByDefault: z.boolean().optional(),
  dependencies: z.array(z.string()).optional(),
  version: z.string().optional(),
  // defaultState is a nested object, we accept a generic record shape
  defaultState: z.record(z.any()).optional(),
  // service map / any additional metadata allowed
  services: z.record(z.any()).optional(),
});

export const ModuleManifestSchemaWithIdUnique = ModuleManifestSchema;

export default ModuleManifestSchema;
