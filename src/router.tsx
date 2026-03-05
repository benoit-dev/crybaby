import { createBrowserRouter } from "react-router";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleRedirect from "@/components/RoleRedirect";
import CoachLayout from "@/layouts/CoachLayout";
import AthleteLayout from "@/layouts/AthleteLayout";
import SignInPage from "@/pages/SignInPage";
import ProgramListPage from "@/pages/coach/ProgramListPage";
import ProgramBuilderPage from "@/pages/coach/ProgramBuilderPage";
import ExerciseListPage from "@/pages/coach/ExerciseListPage";
import AthleteProgramListPage from "@/pages/athlete/AthleteProgramListPage";
import AthleteProgramPage from "@/pages/athlete/AthleteProgramPage";
import SessionHistoryPage from "@/pages/athlete/SessionHistoryPage";

export const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RoleRedirect />,
      },
      {
        path: "/athlete",
        element: <AthleteLayout />,
        children: [
          { path: "programs", element: <AthleteProgramListPage /> },
          { path: "programs/:id", element: <AthleteProgramPage /> },
          { path: "sessions", element: <SessionHistoryPage /> },
        ],
      },
      {
        path: "/coach",
        element: <CoachLayout />,
        children: [
          { path: "programs", element: <ProgramListPage /> },
          { path: "programs/new", element: <ProgramBuilderPage /> },
          { path: "exercises", element: <ExerciseListPage /> },
        ],
      },
    ],
  },
]);
