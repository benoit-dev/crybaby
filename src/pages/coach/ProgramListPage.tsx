import { useQuery } from "convex/react";
import { Link } from "react-router";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgramListPage() {
  const programs = useQuery(api.programs.list);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase">Programs</h1>
        <Button asChild>
          <Link to="/coach/programs/new">New Program</Link>
        </Button>
      </div>

      {programs === undefined ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : programs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No programs yet.</p>
            <Button asChild className="mt-4">
              <Link to="/coach/programs/new">Create your first program</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Card key={program._id}>
              <CardHeader>
                <CardTitle className="font-heading text-xl uppercase">
                  {program.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {program.duration} {program.duration === 1 ? "week" : "weeks"}
                </p>
                {program.description && (
                  <p className="mt-1 text-sm">{program.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
