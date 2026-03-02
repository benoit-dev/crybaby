import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EntryState {
  exerciseSlotId: Id<"exerciseSlots">;
  levelChosen: number;
  actualValue: string;
  notes: string;
}

export default function AthleteProgramPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const program = useQuery(
    api.programs.getWithDetails,
    id ? { programId: id as Id<"programs"> } : "skip",
  );
  const createSession = useMutation(api.sessions.create);

  const [logging, setLogging] = useState(searchParams.get("log") === "1");
  const [entries, setEntries] = useState<Map<string, EntryState>>(new Map());
  const [saving, setSaving] = useState(false);

  if (program === undefined) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (program === null) {
    return <p className="text-muted-foreground">Program not found.</p>;
  }

  const sortedSets = [...program.sets].sort((a, b) => a.order - b.order);

  const updateEntry = (
    slotId: string,
    field: keyof EntryState,
    value: string | number,
  ) => {
    setEntries((prev) => {
      const next = new Map(prev);
      const current = next.get(slotId) ?? {
        exerciseSlotId: slotId as Id<"exerciseSlots">,
        levelChosen: 1,
        actualValue: "",
        notes: "",
      };
      next.set(slotId, { ...current, [field]: value });
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const sessionEntries = Array.from(entries.values())
        .filter((e) => e.actualValue !== "")
        .map((e) => ({
          exerciseSlotId: e.exerciseSlotId,
          levelChosen: e.levelChosen,
          actualValue: parseFloat(e.actualValue) || 0,
          notes: e.notes || undefined,
        }));

      if (sessionEntries.length === 0) return;

      await createSession({
        programId: id as Id<"programs">,
        entries: sessionEntries,
      });

      navigate("/athlete/sessions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase">{program.name}</h1>
        {!logging ? (
          <Button onClick={() => setLogging(true)}>Start Session</Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setLogging(false);
                setEntries(new Map());
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Session"}
            </Button>
          </div>
        )}
      </div>

      {program.description && (
        <p className="text-muted-foreground">{program.description}</p>
      )}

      <p className="text-sm text-muted-foreground">
        {program.duration} {program.duration === 1 ? "week" : "weeks"}
      </p>

      {sortedSets.map((set) => (
        <Card key={set._id}>
          <CardHeader>
            <CardTitle className="font-heading text-lg uppercase">
              Set {set.order}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {set.slots.map((slot) => {
              const sortedScales = [...slot.scales].sort(
                (a, b) => a.level - b.level,
              );
              const entry = entries.get(slot._id);

              return (
                <div key={slot._id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{slot.position}</Badge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-1 pr-4 font-medium">Level</th>
                          <th className="pb-1 pr-4 font-medium">Exercise</th>
                          <th className="pb-1 pr-4 font-medium">Type</th>
                          <th className="pb-1 font-medium">Target</th>
                          {logging && (
                            <>
                              <th className="pb-1 pl-4 font-medium">Pick</th>
                              <th className="pb-1 pl-4 font-medium">Actual</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedScales.map((scale) => {
                          const isChosen =
                            logging &&
                            entry?.levelChosen === scale.level;

                          return (
                            <tr
                              key={scale._id}
                              className={
                                isChosen
                                  ? "bg-primary/10"
                                  : ""
                              }
                            >
                              <td className="py-1 pr-4">
                                <Badge variant="secondary" className="text-xs">
                                  Lvl {scale.level}
                                </Badge>
                              </td>
                              <td className="py-1 pr-4">
                                {scale.exerciseName}
                              </td>
                              <td className="py-1 pr-4 capitalize">
                                {scale.type}
                              </td>
                              <td className="py-1">{scale.targetValue}</td>
                              {logging && (
                                <>
                                  <td className="py-1 pl-4">
                                    <input
                                      type="radio"
                                      name={`level-${slot._id}`}
                                      checked={isChosen}
                                      onChange={() =>
                                        updateEntry(
                                          slot._id,
                                          "levelChosen",
                                          scale.level,
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="py-1 pl-4">
                                    {isChosen && (
                                      <Input
                                        type="number"
                                        className="h-7 w-20"
                                        placeholder={
                                          scale.type === "reps"
                                            ? "reps"
                                            : "secs"
                                        }
                                        value={entry?.actualValue ?? ""}
                                        onChange={(e) =>
                                          updateEntry(
                                            slot._id,
                                            "actualValue",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    )}
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {logging && entry && (
                    <Input
                      placeholder="Notes (optional)"
                      className="mt-1"
                      value={entry.notes}
                      onChange={(e) =>
                        updateEntry(slot._id, "notes", e.target.value)
                      }
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
