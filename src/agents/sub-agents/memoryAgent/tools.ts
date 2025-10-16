import { createTool } from "@iqai/adk";
import { z } from "zod";

export const memoryTool = createTool({
  name: "generate_memory_ideas",
  description: "Generate creative memory moment ideas based on occasion type",
  schema: z.object({
    occasion: z
      .string()
      .describe(
        "Type of event (vacation, birthday, wedding, daily life, etc.)",
      ),
  }),
  fn: async ({ occasion }) => {
    const ideas: Record<string, string> = {
      vacation:
        "Arrival reactions, Golden hour shots, Local food experiences, Candid interactions",
      birthday:
        "Cake moment, Gift reactions, Family gathering, Party highlights",
      wedding: "Getting ready, First look, Ceremony, First dance",
      "daily life":
        "Morning routine, Pet moments, Meal prep, Evening wind-down",
    };
    return (
      ideas[occasion.toLowerCase()] ||
      "Opening shot, Genuine reactions, Detail shots, Ambient sounds"
    );
  },
});
