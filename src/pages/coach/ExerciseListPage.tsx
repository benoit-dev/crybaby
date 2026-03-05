import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExerciseListPage() {
  const exercises = useQuery(api.exercises.list);
  const createExercise = useMutation(api.exercises.create);
  const updateExercise = useMutation(api.exercises.update);
  const removeExercise = useMutation(api.exercises.remove);

  const [newType, setNewType] = useState("");
  const [newVariation, setNewVariation] = useState("");
  const [editingId, setEditingId] = useState<Id<"exercises"> | null>(null);
  const [editType, setEditType] = useState("");
  const [editVariation, setEditVariation] = useState("");

  const handleCreate = async () => {
    if (!newType.trim()) return;
    await createExercise({ type: newType.trim(), variation: newVariation.trim() });
    setNewType("");
    setNewVariation("");
  };

  const startEdit = (exercise: { _id: Id<"exercises">; type: string; variation: string }) => {
    setEditingId(exercise._id);
    setEditType(exercise.type);
    setEditVariation(exercise.variation);
  };

  const handleUpdate = async () => {
    if (!editingId || !editType.trim()) return;
    await updateExercise({ id: editingId, type: editType.trim(), variation: editVariation.trim() });
    setEditingId(null);
  };

  // Group exercises by type
  const grouped = new Map<string, { _id: Id<"exercises">; type: string; variation: string }[]>();
  for (const exercise of exercises ?? []) {
    const list = grouped.get(exercise.type) ?? [];
    list.push(exercise);
    grouped.set(exercise.type, list);
  }
  const sortedTypes = [...grouped.keys()].sort();

  return (
    <div>
      <h1 className="font-heading mb-6 text-3xl uppercase">Exercises</h1>

      {/* Add new exercise */}
      <Card className="mb-6">
        <CardContent className="flex items-end gap-3 pt-6">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Type</label>
            <Input
              placeholder="e.g. Pull up"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Variation</label>
            <Input
              placeholder="e.g. hold, assisted"
              value={newVariation}
              onChange={(e) => setNewVariation(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} disabled={!newType.trim()}>
            Add
          </Button>
        </CardContent>
      </Card>

      {/* Exercise list */}
      {exercises === undefined ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : exercises.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No exercises yet. Add your first one above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedTypes.map((type) => (
            <Card key={type}>
              <CardHeader>
                <CardTitle className="font-heading text-xl uppercase">{type}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {grouped.get(type)!.map((exercise) => (
                  <div key={exercise._id} className="flex items-center gap-2">
                    {editingId === exercise._id ? (
                      <>
                        <Input
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          value={editVariation}
                          onChange={(e) => setEditVariation(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={handleUpdate}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm">
                          {exercise.variation || "(default)"}
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => startEdit(exercise)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeExercise({ id: exercise._id })}
                        >
                          ✕
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
