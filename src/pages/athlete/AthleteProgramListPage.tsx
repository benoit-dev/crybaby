import { useState } from "react";
import { useQuery } from "convex/react";
import { Link } from "react-router";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JoinProgramDialog } from "@/components/JoinProgramDialog";

export default function AthleteProgramListPage() {
  const programs = useQuery(api.programs.listForAthlete);
  const [joinDialog, setJoinDialog] = useState<{
    id: Id<"programs">;
    name: string;
  } | null>(null);

  return (
    <div>
      <h1 className="mb-6 font-heading text-3xl uppercase">Programs</h1>

      {programs === undefined ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : programs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No programs available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card key={program._id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="font-heading text-xl uppercase">
                    {program.name}
                  </CardTitle>
                  {program.enrolled && (
                    <Badge variant="secondary">Enrolled</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {program.duration}{" "}
                  {program.duration === 1 ? "week" : "weeks"}
                </p>
                {program.description && (
                  <p className="mt-1 text-sm">{program.description}</p>
                )}
                <div className="mt-4">
                  {program.enrolled ? (
                    <Button asChild size="sm">
                      <Link to={`/athlete/programs/${program._id}`}>
                        View Program
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setJoinDialog({
                          id: program._id,
                          name: program.name,
                        })
                      }
                    >
                      Join
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <JoinProgramDialog
        programId={joinDialog?.id ?? null}
        programName={joinDialog?.name ?? ""}
        open={joinDialog !== null}
        onOpenChange={(open) => {
          if (!open) setJoinDialog(null);
        }}
      />
    </div>
  );
}
