import VertexLayout from '@/app/components/VertexLayout';
import { VERTEX_CONFIGS } from '@/app/types/vertex';

export default function EmotionalVertexPage() {
  const config = VERTEX_CONFIGS.emotional;

  return <VertexLayout config={config} />;
}
