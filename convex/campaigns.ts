import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const create = mutation({
  args: {
    name: v.string(),
    companyId: v.id("companies"),
    productImageId: v.optional(v.id("_storage")),
    layoutImageId: v.optional(v.id("_storage")),
    instructions: v.optional(v.string()),
    productDescription: v.optional(v.string()),
    layoutPresent: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const campaignId = await ctx.db.insert("campaigns", {
      userId,
      status: "draft",
      ...args,
    });

    return campaignId;
  },
});

export const markGenerated = mutation({
  args: { campaignId: v.id("campaigns") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.campaignId, { status: "generated" });
  },
});

export const get = query({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign || campaign.userId !== userId) return null;

    const posts = await ctx.db
      .query("generatedPosts")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .unique();

    return { ...campaign, posts };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("campaigns")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const updateSelectedPosts = mutation({
  args: {
    campaignId: v.id("campaigns"),
    selectedPosts: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign || campaign.userId !== userId) throw new Error("Not found");

    await ctx.db.patch(args.campaignId, {
      selectedPosts: args.selectedPosts,
      status: "completed",
    });
  },
});

export const updateEditPrompt = mutation({
  args: {
    campaignId: v.id("campaigns"),
    postIndex: v.number(),
    editPrompt: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign || campaign.userId !== userId) throw new Error("Not found");

    const posts = await ctx.db
      .query("generatedPosts")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .unique();

    if (!posts) throw new Error("Posts not found");

    const updatedPosts = [...posts.posts];
    updatedPosts[args.postIndex] = {
      ...updatedPosts[args.postIndex],
      editPrompt: args.editPrompt,
    };

    await ctx.db.patch(posts._id, {
      posts: updatedPosts,
    });
  },
});
