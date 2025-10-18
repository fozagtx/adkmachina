import { createTool } from "@iqai/adk";
import { z } from "@iqai/adk/node_modules/zod";

const scriptWritingSchema = z.object({
  avatarType: z
    .enum(["default", "fitness", "beauty", "tech", "lifestyle"])
    .default("lifestyle")
    .describe("Avatar persona to mirror in the script voice and delivery."),
  niche: z
    .string()
    .min(1, "Provide the content niche the script should reference.")
    .describe("Specific niche or topic to anchor the script in."),
  goalType: z
    .string()
    .min(1, "State the outcome the viewer should reach.")
    .describe("Desired outcome such as awareness, engagement, conversion, or habit change."),
  hook: z
    .string()
    .optional()
    .describe("Validated hook line the script should build from."),
  callToAction: z
    .string()
    .optional()
    .describe("Optional override for the final call-to-action wording."),
  durationSeconds: z
    .number()
    .int()
    .min(15)
    .max(90)
    .optional()
    .describe("Total runtime for the script between 15-90 seconds. Defaults to 45 seconds."),
});

export type ScriptWritingInput = z.infer<typeof scriptWritingSchema>;

export const scriptWritingTool = createTool<ScriptWritingInput>({
  name: "write_short_form_script",
  description:
    "Transform a high-performing hook into a retention-optimized short-form video script with pacing notes and supporting assets.",
  schema: scriptWritingSchema,
  fn: async ({
    avatarType,
    niche,
    goalType,
    hook,
    callToAction,
    durationSeconds,
  }) => {
    const persona = getPersonaConfig(avatarType);
    const runtime = durationSeconds ?? 45;
    const resolvedHook = sanitizeText(
      hook && hook.trim().length > 0 ? hook.trim() : persona.defaultHook(niche, goalType),
    );

    const outline = generateScriptOutline({
      avatarType,
      niche,
      goalType,
      hook: resolvedHook,
      callToAction: callToAction ?? persona.cta[0],
    });

    const script = buildScript(outline);
    const pacingBeats = calculatePacing(outline, runtime);
    const supportingShots = getBRollSuggestions(persona, niche, goalType);

    return {
      success: true,
      script,
      outline,
      pacingBeats,
      supportingShots,
      callToAction: outline.cta,
      deliveryNotes: persona.deliveryNotes,
    } as const;
  },
});

type PersonaKey = "fitness" | "beauty" | "tech" | "lifestyle" | "default";

interface PersonaConfig {
  id: PersonaKey;
  personaVoice: string;
  defaultHook: (niche: string, goalType: string) => string;
  painPoint: (niche: string, goalType: string) => string;
  promise: (niche: string, goalType: string) => string;
  proof: (niche: string, goalType: string) => string;
  recap: (goalType: string) => string;
  cta: string[];
  bRoll: string[];
  deliveryNotes: string[];
}

const personaConfigs: Record<PersonaKey, PersonaConfig> = {
  fitness: {
    id: "fitness",
    personaVoice: "high-energy coach",
    defaultHook: (niche, goalType) =>
      `You can ${goalType} without living in the gym—try this ${niche} tweak.`,
    painPoint: (niche, goalType) =>
      `You're grinding through ${niche}, but ${goalType} still feels stuck because there's no structure.`,
    promise: (niche, goalType) =>
      `Here's the three-part ${niche} stack my clients use to ${goalType} and stay consistent.`,
    proof: (niche, goalType) =>
      `We run this play with busy clients and they hit ${goalType} in under four weeks.`,
    recap: (goalType) => `Structure, simple execution, quick feedback—that's how you lock ${goalType}.`,
    cta: [
      'Follow for more bite-size coaching—comment "TRAIN" and I\'ll send you the template.',
    ],
    bRoll: [
      "Dynamic warm-up footage while calling out the framework.",
      "Close-up of a timer or rep counter overlaying each step.",
      "Over-the-shoulder shot updating progress inside a training app.",
    ],
    deliveryNotes: [
      "Start mid-movement so the hook lands over action.",
      "Keep energy high with crisp transitions between each step.",
      "Layer subtle whoosh SFX to emphasize the new point.",
    ],
  },
  beauty: {
    id: "beauty",
    personaVoice: "beauty expert bestie",
    defaultHook: (niche, goalType) => `This ${niche} swap finally gave me ${goalType}—here's why.`,
    painPoint: (niche, goalType) =>
      `Your ${niche} routine is overflowing with steps, so ${goalType} never shows up.`,
    promise: (niche, goalType) =>
      `Let me show you the simplified routine that keeps ${goalType} consistent.`,
    proof: (niche, goalType) =>
      `I tested this across skin types and it's the only routine that delivered ${goalType}.`,
    recap: (goalType) => `Prep, active treatment, lock it in—that's how ${goalType} stays.`,
    cta: ['Follow for more beauty lab notes—comment "GLOW" for the product list.'],
    bRoll: [
      "Macro shot of product texture under the hook.",
      "Split-screen showing before/after results while describing the shift.",
      "Application close-up synced to the three-step breakdown.",
    ],
    deliveryNotes: [
      "Stay conversational with a smile or soft expression.",
      "Use gentle zooms or pans to keep the visuals premium.",
      "Punch key claims with on-screen ingredient callouts.",
    ],
  },
  tech: {
    id: "tech",
    personaVoice: "operator with receipts",
    defaultHook: (niche, goalType) =>
      `You're wasting hours—this ${niche} automation gets you ${goalType} in half the time.`,
    painPoint: (niche, goalType) =>
      `Manually doing ${niche} buries you in busywork so ${goalType} never scales.`,
    promise: (niche, goalType) =>
      `I'll map the automation I built that unlocked ${goalType} for our team.`,
    proof: (niche, goalType) =>
      `We shipped it last sprint and ${goalType} jumped 40% overnight.`,
    recap: (goalType) => `Trigger, automate, review the metric—that's the loop for ${goalType}.`,
    cta: ['Smash follow for no-code playbooks—DM "FLOW" for the SOP.'],
    bRoll: [
      "Screen recording of the automation firing with cursor highlights.",
      "Workflow diagram overlay while listing the sequence.",
      "Analytics dashboard showing the lift in ${goalType}.",
    ],
    deliveryNotes: [
      "Use callouts to highlight UI elements the moment you mention them.",
      "Keep pacing punchy with jump cuts on each new step.",
      "Zoom on the metric spike to anchor the payoff visually.",
    ],
  },
  lifestyle: {
    id: "lifestyle",
    personaVoice: "relatable habit coach",
    defaultHook: (niche, goalType) =>
      `If you're trying to ${goalType}, this ${niche} tweak changes everything.`,
    painPoint: (niche, goalType) =>
      `Your ${niche} routine swings between all-in or nothing, so ${goalType} keeps slipping.`,
    promise: (niche, goalType) =>
      `Here's my three-beat rhythm that keeps ${goalType} effortless.`,
    proof: (niche, goalType) =>
      `I teach this to busy creatives and it keeps them aligned with ${goalType}.`,
    recap: (goalType) => `Anchor it, simplify it, celebrate it—that's how ${goalType} sticks.`,
    cta: ['Follow for more habit stacking—comment "FLOW" for the checklist.'],
    bRoll: [
      "Morning routine snippet with natural light under the hook.",
      "Close-up of planner or checklist when the framework is explained.",
      "Evening wind-down shot to reinforce the payoff.",
    ],
    deliveryNotes: [
      "Keep tone warm and slightly playful for relatability.",
      "Use gentle handheld movement for authenticity.",
      "Layer soft background music around -18 LUFS to support but not distract.",
    ],
  },
  default: {
    id: "default",
    personaVoice: "strategic creator guide",
    defaultHook: (niche, goalType) => `Trying to ${goalType}? This ${niche} play is the shortcut.`,
    painPoint: (niche, goalType) =>
      `You're juggling a dozen moving parts in ${niche}, so ${goalType} keeps slipping.`,
    promise: (niche, goalType) =>
      `Let me give you the simple blueprint that makes ${goalType} predictable.`,
    proof: (niche, goalType) =>
      `We've run this with dozens of creators and it consistently drives ${goalType}.`,
    recap: (goalType) => `Clarify, deliver, prove it—that's the loop to secure ${goalType}.`,
    cta: ['Follow for more viral workflow breakdowns—drop "PLAY" for the cheatsheet.'],
    bRoll: [
      "Fast zoom onto a sticky note or bold text as the hook lands.",
      "Screen recording or slides while outlining the framework.",
      "Direct-to-camera close for the closing promise and CTA.",
    ],
    deliveryNotes: [
      "Punch key phrases with gestures or text pops.",
      "Trim pauses longer than half a second for pace.",
      "Keep captions tight—no more than six words per line.",
    ],
  },
};

function getPersonaConfig(avatarType: string): PersonaConfig {
  if (avatarType in personaConfigs) {
    return personaConfigs[avatarType as PersonaKey];
  }
  return personaConfigs.default;
}

interface ScriptOutline {
  hook: string;
  setup: string;
  promise: string;
  keyPoints: string[];
  proof: string;
  recap: string;
  cta: string;
}

interface OutlineInput {
  avatarType: string;
  niche: string;
  goalType: string;
  hook: string;
  callToAction: string;
}

function generateScriptOutline({
  avatarType,
  niche,
  goalType,
  hook,
  callToAction,
}: OutlineInput): ScriptOutline {
  const persona = getPersonaConfig(avatarType);
  return {
    hook,
    setup: persona.painPoint(niche, goalType),
    promise: persona.promise(niche, goalType),
    keyPoints: generateKeyPoints(goalType, niche),
    proof: persona.proof(niche, goalType),
    recap: persona.recap(goalType),
    cta: sanitizeText(callToAction),
  };
}

function generateKeyPoints(goalType: string, niche: string): string[] {
  const normalized = goalType.toLowerCase();

  if (normalized.includes("sale") || normalized.includes("client") || normalized.includes("revenue")) {
    return [
      `Audit your ${niche} flow and circle the moment prospects drop before ${goalType}.`,
      `Swap that friction point with a micro-commitment that takes under 30 seconds.`,
      `Layer social proof so the path to ${goalType} feels trusted and safe.`,
    ];
  }

  if (
    normalized.includes("engagement") ||
    normalized.includes("view") ||
    normalized.includes("follower") ||
    normalized.includes("audience")
  ) {
    return [
      `Lead with a quick-win ${niche} tip the viewer can do in under a minute.`,
      `Show your personal proof or story in one sentence to earn attention.`,
      `Issue a challenge or question so the viewer comments when they try it.`,
    ];
  }

  if (
    normalized.includes("habit") ||
    normalized.includes("routine") ||
    normalized.includes("productivity") ||
    normalized.includes("consisten")
  ) {
    return [
      `Anchor the ${niche} action to something you already do every day.`,
      `Set a two-minute version so ${goalType} never feels overwhelming.`,
      `Track the win visually so your brain gets a reward each time.`,
    ];
  }

  return [
    `Identify the single lever in ${niche} that actually shifts ${goalType}.`,
    `Turn it into a three-step micro action the viewer can follow immediately.`,
    `Reveal how to validate progress fast so they stay motivated toward ${goalType}.`,
  ];
}

function buildScript(outline: ScriptOutline): string {
  const keyPoints = outline.keyPoints
    .map((point, index) => `${index + 1}. ${sanitizeText(point)}`)
    .join("\n");

  const scriptLines = [
    sanitizeText(outline.hook),
    "",
    sanitizeText(outline.setup),
    sanitizeText(outline.promise),
    keyPoints,
    "",
    sanitizeText(outline.proof),
    sanitizeText(outline.recap),
    sanitizeText(outline.cta),
  ];

  return scriptLines.join("\n");
}

interface PacingBeat {
  section: string;
  seconds: number;
  notes: string;
}

function calculatePacing(outline: ScriptOutline, durationSeconds: number): PacingBeat[] {
  const beats: PacingBeat[] = [];
  const hookSeconds = clampSeconds(Math.round(durationSeconds * 0.16), 3, 6);
  const setupSeconds = clampSeconds(Math.round(durationSeconds * 0.12), 3, 6);
  const promiseSeconds = clampSeconds(Math.round(durationSeconds * 0.1), 3, 5);
  const proofSeconds = clampSeconds(Math.round(durationSeconds * 0.12), 3, 6);
  const recapSeconds = clampSeconds(Math.round(durationSeconds * 0.08), 2, 4);

  const remainingForPoints = Math.max(
    6,
    durationSeconds - (hookSeconds + setupSeconds + promiseSeconds + proofSeconds + recapSeconds + 3),
  );

  const perPoint = clampSeconds(
    Math.floor(remainingForPoints / Math.max(outline.keyPoints.length, 1)),
    3,
    8,
  );

  beats.push({
    section: "Hook",
    seconds: hookSeconds,
    notes: "Cold open—no intro bumper, land the hook before any title card.",
  });
  beats.push({
    section: "Problem",
    seconds: setupSeconds,
    notes: outline.setup,
  });
  beats.push({
    section: "Promise",
    seconds: promiseSeconds,
    notes: outline.promise,
  });

  outline.keyPoints.forEach((point, index) => {
    beats.push({
      section: `Point ${index + 1}`,
      seconds: perPoint,
      notes: point,
    });
  });

  beats.push({
    section: "Proof",
    seconds: proofSeconds,
    notes: outline.proof,
  });
  beats.push({
    section: "Recap",
    seconds: recapSeconds,
    notes: outline.recap,
  });

  const totalBeforeCta = beats.reduce((sum, beat) => sum + beat.seconds, 0);
  const ctaSeconds = clampSeconds(durationSeconds - totalBeforeCta, 2, 6);

  beats.push({
    section: "CTA",
    seconds: ctaSeconds,
    notes: outline.cta,
  });

  return beats;
}

function clampSeconds(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getBRollSuggestions(
  persona: PersonaConfig,
  niche: string,
  goalType: string,
): string[] {
  return persona.bRoll.map((idea) =>
    sanitizeText(applyPersonaPlaceholders(idea, niche, goalType)),
  );
}

function applyPersonaPlaceholders(value: string, niche: string, goalType: string): string {
  return value.replace(/\${niche}/g, niche).replace(/\${goalType}/g, goalType);
}

function sanitizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
