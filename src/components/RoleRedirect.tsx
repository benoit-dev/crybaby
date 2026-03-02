import { useQuery } from "convex/react";
import { Navigate } from "react-router";
import { api } from "../../convex/_generated/api";

export default function RoleRedirect() {
  const user = useQuery(api.users.currentUser);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (user?.role === "coach") {
    return <Navigate to="/coach/programs" replace />;
  }

  return <Navigate to="/athlete/programs" replace />;
}
