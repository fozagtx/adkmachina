import { createTool } from "@iqai/adk";
import { z } from "@iqai/adk/node_modules/zod";

const hookGenerationSchema = z.object({
  avatarType: z
    .enum(["default", "fitness", "beauty", "tech", "lifestyle"])
    .default("lifestyle")
    .describe("Avatar persona or niche category the hook should be tailored for."),
  niche: z
    .string()
    .min(1, "Provide the specific niche or topic the content should reference.")
    .describe("The content niche to speak to, e.g. fat loss, skincare, SaaS automation."),
  goalType: z
    .string()
    .min(1, "State the outcome or goal the viewer should achieve.")
    .describe(
      "Primary objective for the content such as awareness, engagement, conversion, or education.",
    ),
  vibe: z
    .enum(["bold", "friendly", "urgent", "story", "curious"])
    .optional()
    .describe("Optional prompt for tonal direction of the hook."),
  platform: z
    .enum(["tiktok", "reels", "shorts", "linkedin", "youtube"])
    .optional()
    .describe("Platform the content is intended for, to fine-tune pacing and framing."),
});

export type HookGenerationInput = z.infer<typeof hookGenerationSchema>;

export const hookGenerationTool = createTool<HookGenerationInput>({
  name: "generate_viral_hooks",
  description:
    "Generate scroll-stopping hooks, pattern interrupts, and testing angles for viral short-form content.",
  schema: hookGenerationSchema,
  fn: async ({ avatarType, niche, goalType, vibe, platform }) => {
    const hooks = generateHookLines({ avatarType, niche, goalType, vibe });
    const patternInterrupts = generatePatternInterrupts(avatarType);
    const deliveryAngles = getDeliveryAngles(avatarType, vibe, platform);
    const testingPlan = buildTestingPlan(hooks, platform);

    return {
      success: true,
      hooks,
      patternInterrupts,
      deliveryAngles,
      testingPlan,
    } as const;
  },
});

type HookContext = Pick<HookGenerationInput, "avatarType" | "niche" | "goalType" | "vibe">;

function generateHookLines({ avatarType, niche, goalType, vibe }: HookContext): string[] {
  const personaPrefix = getPersonaPrefix(avatarType);
  const baseHooks = [
    `Stop scrolling if you're trying to ${goalType} with ${niche}!`,
    `You're wasting time on ${niche} if you still do this...`,
    `POV: You finally ${goalType} without the usual ${niche} stress`,
    `No one in ${niche} is talking about this ${goalType} shortcut...`,
    `I bet you haven't tried this ${niche} play to ${goalType}.`,
    `If you care about ${goalType}, you need to hear this ${niche} myth buster.`,
    `${capitalize(goalType)} in ${niche} just got way easier—here's how.`,
  ];

  const personaLines = personaSpecificHooks(avatarType, niche, goalType);
  const merged = [...personaLines, ...baseHooks]
    .map((hook) => applyVibe(`${personaPrefix}${hook}`, vibe))
    .map((hook) => hook.trim());

  return Array.from(new Set(merged));
}

function getPersonaPrefix(avatarType: string): string {
  const prefixes: Record<string, string> = {
    fitness: "Coach tip: ",
    beauty: "Beauty pro here: ",
    tech: "Tech hot take: ",
    lifestyle: "Real talk: ",
    default: "",
  };

  return prefixes[avatarType] ?? prefixes.default;
}

function personaSpecificHooks(avatarType: string, niche: string, goalType: string): string[] {
  const templates: Record<string, string[]> = {
    fitness: [
      `I used this ${niche} tweak to help clients ${goalType} in 21 days.`,
      `${goalType} isn't about harder workouts—it's the ${niche} switch you skip.`,
      `You're burning out chasing ${goalType}; try this ${niche} reset instead.`,
    ],
    beauty: [
      `This ${niche} routine made my ${goalType} results explode.`,
      `I tested every ${niche} trend—this is the only one that ${goalType}.`,
      `Your ${niche} shelf is missing the one step that unlocks ${goalType}.`,
    ],
    tech: [
      `${goalType} without code? This ${niche} automation is the cheat code.`,
      `I shipped ${goalType} in a weekend using this ${niche} workflow.`,
      `If you're still doing ${niche} manually, you're losing ${goalType}.`,
    ],
    lifestyle: [
      `${goalType} finally clicked when I shifted this one ${niche} habit.`,
      `Here's the five-minute ${niche} reset that keeps me on track for ${goalType}.`,
      `This is your sign to stop overcomplicating ${niche} and start ${goalType}.`,
    ],
    default: [
      `${goalType} is easier than you think—start with this ${niche} move.`,
      `The fastest way to ${goalType}? Rethink your ${niche} in 30 seconds.`,
      `Everyone misses this basic ${niche} fix that unlocks ${goalType}.`,
    ],
  };

  return templates[avatarType] ?? templates.default;
}

function applyVibe(hook: string, vibe?: HookGenerationInput["vibe"]): string {
  if (!vibe) return hook;

  switch (vibe) {
    case "bold":
      return `🔥 ${hook}`;
    case "friendly":
      return hook.replace(/Stop scrolling/i, "Hey friend, quick thing");
    case "urgent":
      return hook.replace(/\!$/, " — do this now!");
    case "story":
      return hook.replace(/^/, "Story time: ");
    case "curious":
      return hook.replace(/\.$/, "? Guess why.");
    default:
      return hook;
  }
}

function generatePatternInterrupts(avatarType: string): string[] {
  const interrupts: Record<string, string[]> = {
    fitness: [
      "Start mid-rep, drop the weight, and lean into the camera for the hook.",
      "Show a dramatic before/after split while the hook lands.",
      "Snap to a whiteboard or timer just as you deliver the core line.",
    ],
    beauty: [
      "Begin with a bare face, snap to glam as you hit the first sentence.",
      "Hold up the product blurred, then focus it right on the claim.",
      "Use a macro shot of texture while delivering the controversy.",
    ],
    tech: [
      "Start with your screen glitching, then reveal the streamlined workflow.",
      "Flash rapid cuts of the old process before you announce the new one.",
      "Overlay big bold text while you cold-open with the hot take.",
    ],
    lifestyle: [
      "Cold open with the mistake in action, then freeze-frame for the hook.",
      "Hard cut from chaos to calm as you explain the framework.",
      "Open a journal or checklist right as you share the first tip.",
    ],
    default: [
      "Interrupt the scroll with a quick zoom and snap when you deliver the first line.",
      "Cut to an over-the-shoulder angle exactly on the key phrase.",
      "Use on-screen captions that reveal each word as you speak it.",
    ],
  };

  return interrupts[avatarType] ?? interrupts.default;
}

function getDeliveryAngles(
  avatarType: string,
  vibe?: HookGenerationInput["vibe"],
  platform?: HookGenerationInput["platform"],
): string[] {
  const base: string[] = [
    "Keep the first shot under 1.2 seconds to maximize retention.",
    "Punch keywords with on-beat captions or text overlays.",
    "Plan the hook to be understood without sound—assume auto-captioning.",
  ];

  if (platform === "tiktok" || platform === "reels") {
    base.push("Front-load trending sounds at low volume under the hook.");
  }

  if (platform === "linkedin") {
    base.push("Anchor the hook in a relatable professional scenario.");
  }

  if (vibe === "bold") {
    base.push("Use tight framing and direct eye contact for authority.");
  }

  if (vibe === "story") {
    base.push("Layer B-roll that teases the payoff while you narrate.");
  }

  if (avatarType === "tech") {
    base.push("Pop up UI callouts that highlight the automation or workflow shift.");
  }

  return Array.from(new Set(base));
}

function buildTestingPlan(hooks: string[], platform?: HookGenerationInput["platform"]) {
  if (!hooks.length) {
    return {
      experiments: [],
      metrics: [],
      iterationTips: [],
    } as const;
  }

  const [firstHook, secondHook] = hooks;
  const platformSuffix = platform ? ` on ${platform}` : "";
  const experiments: string[] = [];

  if (firstHook && secondHook) {
    experiments.push(
      `A/B test \"${firstHook}\" vs \"${secondHook}\"${platformSuffix} using identical footage to isolate the hook.`,
    );
  }

  if (firstHook) {
    experiments.push(
      `Create a text-post or static carousel version of \"${firstHook}\" to validate copy resonance before filming variations.`,
    );
  }

  experiments.push(
    "Swap in a new hook weekly while keeping the body identical to identify fatigue quickly.",
  );

  const metrics = [
    "3-second hold rate",
    "First comment sentiment",
    "Saves vs. views",
  ];

  const iterationTips = [
    "Turn the strongest hook into a question to invite duets or stitches.",
    "Test a numbered list variation of the top-performing hook.",
    "Speed up the hook delivery by 10% to see if retention improves.",
  ];

  return {
    experiments,
    metrics,
    iterationTips,
  } as const;
}

function capitalize(value: string): string {
  if (!value.length) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
