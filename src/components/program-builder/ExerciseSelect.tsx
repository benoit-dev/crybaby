import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  getExercisesByCategory,
} from "../../../convex/exercises";

interface ExerciseSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ExerciseSelect({ value, onValueChange }: ExerciseSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Pick exercise" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORIES.map((category) => (
          <SelectGroup key={category}>
            <SelectLabel>{category}</SelectLabel>
            {getExercisesByCategory(category).map((exercise) => (
              <SelectItem key={exercise.name} value={exercise.name}>
                {exercise.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
