export type ExerciseType = "reps" | "time";

export type ExerciseCategory = "Pull" | "Push" | "Core" | "Legs" | "Mobility";

export interface Exercise {
  name: string;
  type: ExerciseType;
  category: ExerciseCategory;
}

export const EXERCISES: Exercise[] = [
  // Pull
  { name: "Pull up", type: "reps", category: "Pull" },
  { name: "Pull up hold", type: "time", category: "Pull" },
  { name: "Chin up", type: "reps", category: "Pull" },
  { name: "Active hang", type: "time", category: "Pull" },
  { name: "Dead hang", type: "time", category: "Pull" },
  { name: "Australian row", type: "reps", category: "Pull" },
  { name: "False grip row", type: "reps", category: "Pull" },
  { name: "Muscle up", type: "reps", category: "Pull" },
  { name: "Skin the cat", type: "reps", category: "Pull" },
  { name: "Tuck front lever hold", type: "time", category: "Pull" },
  { name: "Assisted tuck front lever hold", type: "time", category: "Pull" },
  { name: "Advanced tuck front lever hold", type: "time", category: "Pull" },
  { name: "Front lever raise", type: "reps", category: "Pull" },
  { name: "Assisted one arm hang", type: "time", category: "Pull" },
  { name: "One arm hang", type: "time", category: "Pull" },

  // Push
  { name: "Push up", type: "reps", category: "Push" },
  { name: "Mike Tyson push up", type: "reps", category: "Push" },
  { name: "Knee push up", type: "reps", category: "Push" },
  { name: "Diamond push up", type: "reps", category: "Push" },
  { name: "Pike push up", type: "reps", category: "Push" },
  { name: "HSPU", type: "reps", category: "Push" },
  { name: "Handstand hold", type: "time", category: "Push" },
  { name: "Dip", type: "reps", category: "Push" },
  { name: "Ring dip", type: "reps", category: "Push" },
  { name: "Inverted dip", type: "reps", category: "Push" },
  { name: "Planche lean", type: "time", category: "Push" },
  { name: "Push up feet elevated", type: "reps", category: "Push" },
  { name: "Pseudo push up", type: "reps", category: "Push" },
  { name: "Pseudo planche push up", type: "reps", category: "Push" },

  // Core
  { name: "L-sit", type: "time", category: "Core" },
  { name: "L-sit raise", type: "reps", category: "Core" },
  { name: "Farm plank", type: "time", category: "Core" },
  { name: "Arm plank", type: "time", category: "Core" },
  { name: "1 arm plank", type: "time", category: "Core" },
  { name: "Hollow body hold", type: "time", category: "Core" },
  { name: "Hanging knee raise", type: "reps", category: "Core" },
  { name: "Hanging leg raise", type: "reps", category: "Core" },
  { name: "Dragon flag", type: "reps", category: "Core" },

  // Legs
  { name: "Pistol squat", type: "reps", category: "Legs" },
  { name: "Bulgarian split squat", type: "reps", category: "Legs" },
  { name: "Cossack squat", type: "reps", category: "Legs" },
  { name: "Nordic curl", type: "reps", category: "Legs" },
  { name: "Shrimp squat", type: "reps", category: "Legs" },

  // Mobility
  { name: "Shoulder dislocate", type: "reps", category: "Mobility" },
  { name: "Wrist circles", type: "reps", category: "Mobility" },
  { name: "Deep squat hold", type: "time", category: "Mobility" },
  { name: "Pancake stretch", type: "time", category: "Mobility" },
  { name: "Pike stretch", type: "time", category: "Mobility" },
];

export const CATEGORIES: ExerciseCategory[] = [
  "Pull",
  "Push",
  "Core",
  "Legs",
  "Mobility",
];

export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return EXERCISES.filter((e) => e.category === category);
}
