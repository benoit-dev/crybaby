import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExerciseSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

function formatExerciseName(type: string, variation: string): string {
  if (!variation) return type;
  return `${type} — ${variation}`;
}

export function ExerciseSelect({ value, onValueChange }: ExerciseSelectProps) {
  const exercises = useQuery(api.exercises.list);
  const createExercise = useMutation(api.exercises.create);
  const [creating, setCreating] = useState(false);
  const [newType, setNewType] = useState("");
  const [newVariation, setNewVariation] = useState("");

  // Group exercises by type
  const grouped = new Map<string, { name: string; variation: string }[]>();
  for (const exercise of exercises ?? []) {
    const list = grouped.get(exercise.type) ?? [];
    list.push({ name: formatExerciseName(exercise.type, exercise.variation), variation: exercise.variation });
    grouped.set(exercise.type, list);
  }
  const sortedTypes = [...grouped.keys()].sort();

  const handleCreate = async () => {
    if (!newType.trim()) return;
    await createExercise({ type: newType.trim(), variation: newVariation.trim() });
    const name = formatExerciseName(newType.trim(), newVariation.trim());
    onValueChange(name);
    setCreating(false);
    setNewType("");
    setNewVariation("");
  };

  if (creating) {
    return (
      <div className="flex items-center gap-1">
        <Input
          placeholder="Type"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="w-[120px]"
          autoFocus
        />
        <Input
          placeholder="Variation"
          value={newVariation}
          onChange={(e) => setNewVariation(e.target.value)}
          className="w-[120px]"
        />
        <Button size="sm" onClick={handleCreate} disabled={!newType.trim()}>
          Add
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setCreating(false)}>
          ✕
        </Button>
      </div>
    );
  }

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        if (v === "__create_new__") {
          setCreating(true);
        } else {
          onValueChange(v);
        }
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Pick exercise" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__create_new__">+ New exercise</SelectItem>
        {sortedTypes.length > 0 && <SelectSeparator />}
        {sortedTypes.map((type) => (
          <SelectGroup key={type}>
            <SelectLabel>{type}</SelectLabel>
            {grouped.get(type)!.map((exercise) => (
              <SelectItem key={exercise.name} value={exercise.name}>
                {exercise.variation || "(default)"}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
