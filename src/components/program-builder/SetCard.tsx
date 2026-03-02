import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExerciseSlotRow } from "./ExerciseSlotRow";
import type { SetState } from "@/pages/coach/ProgramBuilderPage";

interface SetCardProps {
  set: SetState;
  onAddSlot: () => void;
  onRemoveSlot: (slotId: string) => void;
  onAddScale: (slotId: string) => void;
  onRemoveScale: (slotId: string, scaleId: string) => void;
  onUpdateScale: (
    slotId: string,
    scaleId: string,
    field: string,
    value: string,
  ) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function SetCard({
  set,
  onAddSlot,
  onRemoveSlot,
  onAddScale,
  onRemoveScale,
  onUpdateScale,
  onRemove,
  canRemove,
}: SetCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-heading text-lg uppercase">
          Set {set.order}
        </CardTitle>
        <div className="flex gap-1">
          {set.slots.length < 3 && (
            <Button variant="outline" size="sm" onClick={onAddSlot}>
              + Slot
            </Button>
          )}
          {canRemove && (
            <Button variant="ghost" size="sm" onClick={onRemove}>
              ✕
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {set.slots.map((slot) => (
          <ExerciseSlotRow
            key={slot.id}
            slot={slot}
            onAddScale={() => onAddScale(slot.id)}
            onRemoveScale={(scaleId) => onRemoveScale(slot.id, scaleId)}
            onUpdateScale={(scaleId, field, value) =>
              onUpdateScale(slot.id, scaleId, field, value)
            }
            onRemove={() => onRemoveSlot(slot.id)}
            canRemove={set.slots.length > 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}
