import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExerciseSelect } from "./ExerciseSelect";
import type { ScaleState } from "@/pages/coach/ProgramBuilderPage";

interface ScaleLevelRowProps {
  scale: ScaleState;
  onUpdate: (field: string, value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function ScaleLevelRow({
  scale,
  onUpdate,
  onRemove,
  canRemove,
}: ScaleLevelRowProps) {
  return (
    <div className="flex items-center gap-2 pl-8">
      <Badge variant="outline" className="shrink-0">
        Lvl {scale.level}
      </Badge>
      <ExerciseSelect
        value={scale.exerciseName}
        onValueChange={(v) => onUpdate("exerciseName", v)}
      />
      <Select
        value={scale.type}
        onValueChange={(v) => onUpdate("type", v)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="reps">Reps</SelectItem>
          <SelectItem value="time">Time</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder={scale.type === "time" ? "e.g. 10-30s" : "e.g. 6-8"}
        value={scale.targetValue}
        onChange={(e) => onUpdate("targetValue", e.target.value)}
        className="w-[140px]"
      />
      {canRemove && (
        <Button variant="ghost" size="sm" onClick={onRemove}>
          ✕
        </Button>
      )}
    </div>
  );
}
