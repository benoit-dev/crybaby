import { Link, Outlet } from "react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

export default function AthleteLayout() {
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link
            to="/athlete/programs"
            className="font-heading text-2xl uppercase tracking-wide"
          >
            crybabygym
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/athlete/programs">Programs</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/athlete/sessions">Sessions</Link>
              </Button>
            </nav>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void signOut()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
