import VertexLayout from '@/app/components/VertexLayout';
import { VERTEX_CONFIGS } from '@/app/types/vertex';

export default function TechnicalVertexPage() {
  const config = VERTEX_CONFIGS.technical;

  return <VertexLayout config={config} />;
}
