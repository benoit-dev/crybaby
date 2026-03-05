import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("exercises").collect();
  },
});

export const create = mutation({
  args: {
    type: v.string(),
    variation: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exercises", {
      type: args.type.trim(),
      variation: args.variation.trim(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("exercises"),
    type: v.string(),
    variation: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      type: args.type.trim(),
      variation: args.variation.trim(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("exercises") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
