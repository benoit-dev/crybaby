import { useState } from "react";
import { useQuery } from "convex/react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function SessionDetail({ sessionId }: { sessionId: Id<"sessions"> }) {
  const session = useQuery(api.sessions.getWithEntries, { sessionId });

  if (session === undefined) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (session === null || session.entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No entries.</p>;
  }

  return (
    <div className="mt-3 space-y-2">
      {session.entries.map((entry) => (
        <div
          key={entry._id}
          className="flex flex-wrap items-center gap-2 text-sm"
        >
          <Badge variant="outline">{entry.position}</Badge>
          <span className="font-medium">{entry.exerciseName}</span>
          <Badge variant="secondary" className="text-xs">
            Lvl {entry.levelChosen}
          </Badge>
          <span>
            {entry.actualValue} {entry.type === "reps" ? "reps" : "s"}
          </span>
          {entry.notes && (
            <span className="text-muted-foreground">— {entry.notes}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SessionHistoryPage() {
  const sessions = useQuery(api.sessions.listByUser);
  const programs = useQuery(api.programs.listForAthlete);
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<Id<"sessions"> | null>(null);
  const [pickingProgram, setPickingProgram] = useState(false);

  const enrolledPrograms = programs?.filter((p) => p.enrolled) ?? [];

  const handleNewSession = () => {
    if (enrolledPrograms.length === 1) {
      navigate(`/athlete/programs/${enrolledPrograms[0]._id}?log=1`);
    } else if (enrolledPrograms.length > 1) {
      setPickingProgram(true);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase">Sessions</h1>
        {enrolledPrograms.length > 0 && (
          <Button onClick={handleNewSession}>New Session</Button>
        )}
      </div>

      <Dialog open={pickingProgram} onOpenChange={setPickingProgram}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pick a program</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {enrolledPrograms.map((p) => (
              <Button
                key={p._id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setPickingProgram(false);
                  navigate(`/athlete/programs/${p._id}?log=1`);
                }}
              >
                {p.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {sessions === undefined ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No sessions recorded yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const isExpanded = expandedId === session._id;

            return (
              <Card key={session._id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {session.programName}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : session._id)
                    }
                  >
                    {isExpanded ? "Hide Details" : "Show Details"}
                  </Button>

                  {isExpanded && <SessionDetail sessionId={session._id} />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
