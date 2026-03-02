import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    programId: v.id("programs"),
    entries: v.array(
      v.object({
        exerciseSlotId: v.id("exerciseSlots"),
        levelChosen: v.number(),
        actualValue: v.number(),
        notes: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const sessionId = await ctx.db.insert("sessions", {
      programId: args.programId,
      userId,
      date: Date.now(),
    });

    for (const entry of args.entries) {
      await ctx.db.insert("sessionEntries", {
        sessionId,
        exerciseSlotId: entry.exerciseSlotId,
        levelChosen: entry.levelChosen,
        actualValue: entry.actualValue,
        notes: entry.notes,
      });
    }

    return sessionId;
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return await Promise.all(
      sessions.map(async (session) => {
        const program = await ctx.db.get(session.programId);
        return {
          ...session,
          programName: program?.name ?? "Unknown Program",
        };
      }),
    );
  },
});

export const getWithEntries = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;

    const program = await ctx.db.get(session.programId);

    const entries = await ctx.db
      .query("sessionEntries")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const entriesWithDetails = await Promise.all(
      entries.map(async (entry) => {
        const slot = await ctx.db.get(entry.exerciseSlotId);
        let scaleName = "";
        let scaleType: "reps" | "time" = "reps";
        if (slot) {
          const scales = await ctx.db
            .query("scales")
            .withIndex("by_exerciseSlot", (q) =>
              q.eq("exerciseSlotId", slot._id),
            )
            .collect();
          const chosen = scales.find((s) => s.level === entry.levelChosen);
          if (chosen) {
            scaleName = chosen.exerciseName;
            scaleType = chosen.type;
          }
        }
        return {
          ...entry,
          exerciseName: scaleName,
          type: scaleType,
          position: slot?.position ?? "?",
        };
      }),
    );

    return {
      ...session,
      programName: program?.name ?? "Unknown Program",
      entries: entriesWithDetails,
    };
  },
});
