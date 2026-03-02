import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProgramFormProps {
  name: string;
  duration: number;
  description: string;
  password: string;
  onFieldChange: (field: string, value: string | number) => void;
}

export function ProgramForm({
  name,
  duration,
  description,
  password,
  onFieldChange,
}: ProgramFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">Program Name</Label>
        <Input
          id="name"
          placeholder="e.g. Beginner Pull"
          value={name}
          onChange={(e) => onFieldChange("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (weeks)</Label>
        <Input
          id="duration"
          type="number"
          min={1}
          value={duration}
          onChange={(e) => onFieldChange("duration", parseInt(e.target.value) || 1)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Join Password</Label>
        <Input
          id="password"
          placeholder="Athletes use this to join"
          value={password}
          onChange={(e) => onFieldChange("password", e.target.value)}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder="Brief description of the program..."
          value={description}
          onChange={(e) => onFieldChange("description", e.target.value)}
        />
      </div>
    </div>
  );
}
