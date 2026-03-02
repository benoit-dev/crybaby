import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScaleLevelRow } from "./ScaleLevelRow";
import type { SlotState } from "@/pages/coach/ProgramBuilderPage";

interface ExerciseSlotRowProps {
  slot: SlotState;
  onAddScale: () => void;
  onRemoveScale: (scaleId: string) => void;
  onUpdateScale: (scaleId: string, field: string, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function ExerciseSlotRow({
  slot,
  onAddScale,
  onRemoveScale,
  onUpdateScale,
  onRemove,
  canRemove,
}: ExerciseSlotRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge className="shrink-0">{slot.position}</Badge>
        <span className="text-sm text-muted-foreground">Exercise slot</span>
        <div className="ml-auto flex gap-1">
          {slot.scales.length < 3 && (
            <Button variant="outline" size="sm" onClick={onAddScale}>
              + Level
            </Button>
          )}
          {canRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ✕
            </Button>
          )}
        </div>
      </div>

      {slot.scales.map((scale) => (
        <ScaleLevelRow
          key={scale.id}
          scale={scale}
          onUpdate={(field, value) => onUpdateScale(scale.id, field, value)}
          onRemove={() => onRemoveScale(scale.id)}
          canRemove={slot.scales.length > 1}
        />
      ))}
    </div>
  );
}
