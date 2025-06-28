import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal,api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";

export const insert = mutation({
  args: {
    campaignId: v.id("campaigns"),
    posts: v.array(v.object({ text: v.string(), editPrompt: v.string() })),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("generatedPosts", {
      campaignId: args.campaignId,
      posts: args.posts,
    });
  },
});

export const generatePostsAndAttach = action({
    args: {
        campaignId: v.id("campaigns"),
        layout: v.optional(v.string()),
        instructions: v.optional(v.string()),
        productDescription: v.optional(v.string()),
    },

    handler:async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const campaign = await ctx.runQuery(api.campaigns.get, {
            campaignId: args.campaignId,
        });
        if (!campaign) throw new Error("Campaign not found");

        const generatedTexts: string[] = await ctx.runAction(
            api.gemini.generatePostsFromGemini,
            {
                layout: args.layout || "default",
                instructions: args.instructions,
                productDescription: args.productDescription,
            }
        );

        const posts = generatedTexts.map((text) => ({
            text,
            editPrompt: "",
        }));

        await ctx.runMutation(api.generatePosts.insert, {
            campaignId: args.campaignId,
            posts,
        });

        await ctx.runMutation(api.campaigns.markGenerated, {
            campaignId: args.campaignId,
        });
    }
})


