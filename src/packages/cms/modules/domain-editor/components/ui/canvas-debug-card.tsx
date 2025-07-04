import { ClientOnly } from "@/components/utils/client-only";
import { DebugCard } from "@shared-ui/components/ui/debug-json-card";
import { useCanvasStore } from "@cms/modules/domain-editor/stores/canvas-store/canvas.store.hooks";

export default function CanvasDebugCard() {
  const properties = useCanvasStore()((state) => state.properties);
  return (
    <ClientOnly>
      <DebugCard label="Property Form Store" json={properties} />
    </ClientOnly>
  );
}
