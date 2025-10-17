import { createTool } from "@iqai/adk";
import { z } from "zod";

export const scriptIdeationTool = createTool({
  name: "generate_script_ideas",
  description: "Generate viral script ideas and hooks for UGC content",
  fn: async ({ avatarType, niche, goalType }) => {
    const ideas = generateScriptIdeas(avatarType, niche, goalType);
    const hooks = generateViralHooks(niche, goalType);
    const structure = generateScriptStructure(goalType);

    return {
      success: true,
      scriptIdeas: ideas,
      viralHooks: hooks,
      structure: structure,
      tips: getContentTips(avatarType, goalType),
    };
  },
});

function generateScriptIdeas(avatarType: string, niche: string, goalType: string): string[] {
  const templates: Record<string, string[]> = {
    fitness: [
      `The 3 exercises everyone does wrong (and how to fix them)`,
      `Why your workout isn't working: The truth nobody tells you`,
      `I tried [trend] for 30 days - here's what happened`,
      `The secret to [fitness goal] in half the time`,
      `Stop doing [common exercise]! Do this instead`,
    ],
    beauty: [
      `The $5 product that replaced my $100 skincare routine`,
      `Why your makeup looks cakey (and the simple fix)`,
      `Get ready with me for [occasion] - viral edition`,
      `The beauty hack nobody talks about`,
      `I tested viral [beauty trend] so you don't have to`,
    ],
    tech: [
      `The hidden feature in [device] that changes everything`,
      `Why everyone's switching to [tech solution]`,
      `I automated my entire [task] - here's how`,
      `The app that replaced 5 apps on my phone`,
      `Stop using [popular app]! This is way better`,
    ],
    lifestyle: [
      `How I [achievement] in just [timeframe]`,
      `The simple habit that changed my life`,
      `Things I wish I knew before [milestone]`,
      `The productivity hack everyone should know`,
      `I tried the viral [trend] - was it worth it?`,
    ],
  };

  return templates[avatarType] || templates.lifestyle;
}

function generateViralHooks(niche: string, goalType: string): string[] {
  return [
    `Stop scrolling! This will change how you think about ${niche}...`,
    `I can't believe nobody talks about this...`,
    `Wait... you've been doing this wrong the whole time!`,
    `This is the secret that ${niche} experts don't want you to know`,
    `POV: You just discovered the easiest way to ${niche}`,
    `If you're struggling with ${niche}, watch this!`,
    `The ${niche} trick that went viral for a reason`,
  ];
}

function generateScriptStructure(goalType: string): object {
  return {
    hook: "First 3 seconds - grab attention with shocking statement or question",
    problem: "Identify the pain point or challenge (5-7 seconds)",
    solution: "Present your solution or insight (15-20 seconds)",
    proof: "Show results, demo, or explanation (10-15 seconds)",
    cta: "Clear call to action - follow, save, try it (3-5 seconds)",
    timing: "Total: 30-60 seconds for maximum engagement",
  };
}

function getContentTips(avatarType: string, goalType: string): string[] {
  return [
    "Start with a pattern interrupt - something unexpected",
    "Use 'you' language to make it personal",
    "Keep sentences short and punchy",
    "Add text overlays for key points",
    "End with a clear, specific call to action",
    "Test multiple hooks for the same content",
  ];
}
