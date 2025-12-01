import VertexLayout from '@/app/components/VertexLayout';
import { VERTEX_CONFIGS } from '@/app/types/vertex';

export default function PracticalVertexPage() {
  const config = VERTEX_CONFIGS.practical;

  return <VertexLayout config={config} />;
}
