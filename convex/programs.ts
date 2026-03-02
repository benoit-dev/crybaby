import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("programs").collect();
  },
});

export const getWithDetails = query({
  args: { programId: v.id("programs") },
  handler: async (ctx, args) => {
    const program = await ctx.db.get(args.programId);
    if (!program) return null;

    const sets = await ctx.db
      .query("sets")
      .withIndex("by_program", (q) => q.eq("programId", args.programId))
      .collect();

    const setsWithDetails = await Promise.all(
      sets.map(async (set) => {
        const slots = await ctx.db
          .query("exerciseSlots")
          .withIndex("by_set", (q) => q.eq("setId", set._id))
          .collect();

        const slotsWithScales = await Promise.all(
          slots.map(async (slot) => {
            const scales = await ctx.db
              .query("scales")
              .withIndex("by_exerciseSlot", (q) =>
                q.eq("exerciseSlotId", slot._id),
              )
              .collect();
            return { ...slot, scales };
          }),
        );

        return { ...set, slots: slotsWithScales };
      }),
    );

    return { ...program, sets: setsWithDetails };
  },
});

export const listForAthlete = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const programs = await ctx.db.query("programs").collect();
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const enrolledProgramIds = new Set(enrollments.map((e) => e.programId));

    return programs.map((program) => ({
      _id: program._id,
      _creationTime: program._creationTime,
      name: program.name,
      duration: program.duration,
      description: program.description,
      enrolled: enrolledProgramIds.has(program._id),
    }));
  },
});

export const join = mutation({
  args: {
    programId: v.id("programs"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const program = await ctx.db.get(args.programId);
    if (!program) throw new Error("Program not found");

    if (args.password !== program.password) {
      throw new Error("Wrong password");
    }

    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user_program", (q) =>
        q.eq("userId", userId).eq("programId", args.programId),
      )
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("enrollments", {
      userId,
      programId: args.programId,
    });
  },
});

const scaleValidator = v.object({
  level: v.number(),
  exerciseName: v.string(),
  type: v.union(v.literal("reps"), v.literal("time")),
  targetValue: v.string(),
});

const slotValidator = v.object({
  position: v.string(),
  scales: v.array(scaleValidator),
});

const setValidator = v.object({
  order: v.number(),
  slots: v.array(slotValidator),
});

export const create = mutation({
  args: {
    name: v.string(),
    duration: v.number(),
    description: v.optional(v.string()),
    password: v.string(),
    sets: v.array(setValidator),
  },
  handler: async (ctx, args) => {
    const programId = await ctx.db.insert("programs", {
      name: args.name,
      duration: args.duration,
      description: args.description,
      password: args.password,
    });

    for (const set of args.sets) {
      const numExercises = set.slots.length;

      const setId = await ctx.db.insert("sets", {
        programId,
        order: set.order,
        numExercises,
      });

      for (const slot of set.slots) {
        const exerciseSlotId = await ctx.db.insert("exerciseSlots", {
          setId,
          position: slot.position,
        });

        for (const scale of slot.scales) {
          await ctx.db.insert("scales", {
            exerciseSlotId,
            level: scale.level,
            exerciseName: scale.exerciseName,
            type: scale.type,
            targetValue: scale.targetValue,
          });
        }
      }
    }

    return programId;
  },
});
