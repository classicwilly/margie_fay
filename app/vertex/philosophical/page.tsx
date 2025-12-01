import VertexLayout from '@/app/components/VertexLayout';
import { VERTEX_CONFIGS } from '@/app/types/vertex';

export default function PhilosophicalVertexPage() {
  const config = VERTEX_CONFIGS.philosophical;

  return <VertexLayout config={config} />;
}
