import { useReducer, useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router";
import { api } from "../../../convex/_generated/api";
import { EXERCISES } from "../../../convex/exercises";
import { Button } from "@/components/ui/button";
import { ProgramForm } from "@/components/program-builder/ProgramForm";
import { SetCard } from "@/components/program-builder/SetCard";

// --- State types ---

export interface ScaleState {
  id: string;
  level: number;
  exerciseName: string;
  type: "reps" | "time";
  targetValue: string;
}

export interface SlotState {
  id: string;
  position: string;
  scales: ScaleState[];
}

export interface SetState {
  id: string;
  order: number;
  slots: SlotState[];
}

interface ProgramFormState {
  name: string;
  duration: number;
  description: string;
  password: string;
  sets: SetState[];
}

// --- Helpers ---

const POSITIONS = ["A", "B", "C"];

function makeScale(level: number): ScaleState {
  return {
    id: crypto.randomUUID(),
    level,
    exerciseName: "",
    type: "reps",
    targetValue: "",
  };
}

function makeSlot(position: string): SlotState {
  return {
    id: crypto.randomUUID(),
    position,
    scales: [makeScale(1)],
  };
}

function makeSet(order: number): SetState {
  return {
    id: crypto.randomUUID(),
    order,
    slots: [makeSlot("A")],
  };
}

// --- Reducer ---

type Action =
  | { type: "SET_FIELD"; field: string; value: string | number }
  | { type: "ADD_SET" }
  | { type: "REMOVE_SET"; setId: string }
  | { type: "ADD_SLOT"; setId: string }
  | { type: "REMOVE_SLOT"; setId: string; slotId: string }
  | { type: "ADD_SCALE"; setId: string; slotId: string }
  | { type: "REMOVE_SCALE"; setId: string; slotId: string; scaleId: string }
  | {
      type: "UPDATE_SCALE";
      setId: string;
      slotId: string;
      scaleId: string;
      field: string;
      value: string;
    };

function reducer(state: ProgramFormState, action: Action): ProgramFormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "ADD_SET": {
      const nextOrder = state.sets.length + 1;
      return { ...state, sets: [...state.sets, makeSet(nextOrder)] };
    }

    case "REMOVE_SET": {
      const sets = state.sets
        .filter((s) => s.id !== action.setId)
        .map((s, i) => ({ ...s, order: i + 1 }));
      return { ...state, sets };
    }

    case "ADD_SLOT": {
      return {
        ...state,
        sets: state.sets.map((s) => {
          if (s.id !== action.setId) return s;
          const nextPos = POSITIONS[s.slots.length] ?? `${s.slots.length + 1}`;
          return { ...s, slots: [...s.slots, makeSlot(nextPos)] };
        }),
      };
    }

    case "REMOVE_SLOT": {
      return {
        ...state,
        sets: state.sets.map((s) => {
          if (s.id !== action.setId) return s;
          const slots = s.slots
            .filter((sl) => sl.id !== action.slotId)
            .map((sl, i) => ({ ...sl, position: POSITIONS[i] ?? `${i + 1}` }));
          return { ...s, slots };
        }),
      };
    }

    case "ADD_SCALE": {
      return {
        ...state,
        sets: state.sets.map((s) => {
          if (s.id !== action.setId) return s;
          return {
            ...s,
            slots: s.slots.map((sl) => {
              if (sl.id !== action.slotId) return sl;
              const nextLevel = sl.scales.length + 1;
              return { ...sl, scales: [...sl.scales, makeScale(nextLevel)] };
            }),
          };
        }),
      };
    }

    case "REMOVE_SCALE": {
      return {
        ...state,
        sets: state.sets.map((s) => {
          if (s.id !== action.setId) return s;
          return {
            ...s,
            slots: s.slots.map((sl) => {
              if (sl.id !== action.slotId) return sl;
              const scales = sl.scales
                .filter((sc) => sc.id !== action.scaleId)
                .map((sc, i) => ({ ...sc, level: i + 1 }));
              return { ...sl, scales };
            }),
          };
        }),
      };
    }

    case "UPDATE_SCALE": {
      return {
        ...state,
        sets: state.sets.map((s) => {
          if (s.id !== action.setId) return s;
          return {
            ...s,
            slots: s.slots.map((sl) => {
              if (sl.id !== action.slotId) return sl;
              return {
                ...sl,
                scales: sl.scales.map((sc) => {
                  if (sc.id !== action.scaleId) return sc;
                  const updated = { ...sc, [action.field]: action.value };
                  // Auto-set type from exercise list when exercise changes
                  if (action.field === "exerciseName") {
                    const exercise = EXERCISES.find(
                      (e) => e.name === action.value,
                    );
                    if (exercise) {
                      updated.type = exercise.type;
                    }
                  }
                  return updated;
                }),
              };
            }),
          };
        }),
      };
    }

    default:
      return state;
  }
}

const initialState: ProgramFormState = {
  name: "",
  duration: 4,
  description: "",
  password: "",
  sets: [makeSet(1)],
};

// --- Component ---

export default function ProgramBuilderPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [saving, setSaving] = useState(false);
  const createProgram = useMutation(api.programs.create);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!state.name.trim() || !state.password.trim()) return;

    setSaving(true);
    try {
      await createProgram({
        name: state.name.trim(),
        duration: state.duration,
        description: state.description.trim() || undefined,
        password: state.password.trim(),
        sets: state.sets.map((set) => ({
          order: set.order,
          slots: set.slots.map((slot) => ({
            position: slot.position,
            scales: slot.scales.map((scale) => ({
              level: scale.level,
              exerciseName: scale.exerciseName,
              type: scale.type,
              targetValue: scale.targetValue,
            })),
          })),
        })),
      });
      navigate("/coach/programs");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl uppercase">New Program</h1>
        <Button onClick={handleSave} disabled={saving || !state.name.trim() || !state.password.trim()}>
          {saving ? "Saving..." : "Save Program"}
        </Button>
      </div>

      <ProgramForm
        name={state.name}
        duration={state.duration}
        description={state.description}
        password={state.password}
        onFieldChange={(field, value) =>
          dispatch({ type: "SET_FIELD", field, value })
        }
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl uppercase">Sets</h2>
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "ADD_SET" })}
          >
            + Add Set
          </Button>
        </div>

        {state.sets.map((set) => (
          <SetCard
            key={set.id}
            set={set}
            onAddSlot={() => dispatch({ type: "ADD_SLOT", setId: set.id })}
            onRemoveSlot={(slotId) =>
              dispatch({ type: "REMOVE_SLOT", setId: set.id, slotId })
            }
            onAddScale={(slotId) =>
              dispatch({ type: "ADD_SCALE", setId: set.id, slotId })
            }
            onRemoveScale={(slotId, scaleId) =>
              dispatch({
                type: "REMOVE_SCALE",
                setId: set.id,
                slotId,
                scaleId,
              })
            }
            onUpdateScale={(slotId, scaleId, field, value) =>
              dispatch({
                type: "UPDATE_SCALE",
                setId: set.id,
                slotId,
                scaleId,
                field,
                value,
              })
            }
            onRemove={() => dispatch({ type: "REMOVE_SET", setId: set.id })}
            canRemove={state.sets.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
