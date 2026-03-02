import { Link, Outlet } from "react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

export default function CoachLayout() {
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link
            to="/coach/programs"
            className="font-heading text-2xl uppercase tracking-wide"
          >
            crybabygym
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void signOut()}
          >
            Sign Out
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
