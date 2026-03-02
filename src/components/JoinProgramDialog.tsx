import { useState, type FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface JoinProgramDialogProps {
  programId: Id<"programs"> | null;
  programName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinProgramDialog({
  programId,
  programName,
  open,
  onOpenChange,
}: JoinProgramDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const join = useMutation(api.programs.join);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!programId) return;

    setError("");
    setLoading(true);

    try {
      await join({ programId, password });
      setPassword("");
      onOpenChange(false);
    } catch {
      setError("Wrong password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setPassword("");
          setError("");
        }
        onOpenChange(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join {programName}</DialogTitle>
          <DialogDescription>
            Enter the program password to enroll.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="join-password">Password</Label>
            <Input
              id="join-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter program password"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Joining..." : "Join Program"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
