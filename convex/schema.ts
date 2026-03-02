import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(v.union(v.literal("coach"), v.literal("athlete"))),
  }).index("email", ["email"]),

  programs: defineTable({
    name: v.string(),
    duration: v.number(), // in weeks
    description: v.optional(v.string()),
    password: v.string(), // join code for athletes
  }),

  sets: defineTable({
    programId: v.id("programs"),
    order: v.number(), // 1, 2, 3...
    numExercises: v.number(), // 2 or 3
  }).index("by_program", ["programId"]),

  exerciseSlots: defineTable({
    setId: v.id("sets"),
    position: v.string(), // "A", "B", "C"
  }).index("by_set", ["setId"]),

  scales: defineTable({
    exerciseSlotId: v.id("exerciseSlots"),
    level: v.number(), // 1, 2, 3
    exerciseName: v.string(), // e.g. "Pull up 30s hold"
    type: v.union(v.literal("reps"), v.literal("time")),
    targetValue: v.string(), // e.g. "6-8" or "10-30s"
  }).index("by_exerciseSlot", ["exerciseSlotId"]),

  enrollments: defineTable({
    userId: v.id("users"),
    programId: v.id("programs"),
  })
    .index("by_user", ["userId"])
    .index("by_program", ["programId"])
    .index("by_user_program", ["userId", "programId"]),

  sessions: defineTable({
    programId: v.id("programs"),
    userId: v.id("users"),
    date: v.number(), // timestamp
  })
    .index("by_program", ["programId"])
    .index("by_user", ["userId"])
    .index("by_program_user", ["programId", "userId"]),

  sessionEntries: defineTable({
    sessionId: v.id("sessions"),
    exerciseSlotId: v.id("exerciseSlots"),
    levelChosen: v.number(), // which scale level
    actualValue: v.number(), // reps count or seconds
    notes: v.optional(v.string()),
  }).index("by_session", ["sessionId"]),
});
