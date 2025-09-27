import { intro, outro, text, confirm, spinner } from "@clack/prompts";
import {
  blue,
  green,
  red,
  cyan,
  bgRed,
  bold,
  magenta,
  yellow,
} from "picocolors";
import { getRootAgent } from "./agents/agent.js";

async function runSession() {
  console.log(
    cyan(`
 █████╗ ██████╗ ██╗  ██╗    ███╗   ███╗ █████╗  ██████╗██╗  ██╗██╗███╗   ██╗ █████╗
██╔══██╗██╔══██╗██║ ██╔╝    ████╗ ████║██╔══██╗██╔════╝██║  ██║██║████╗  ██║██╔══██╗
███████║██║  ██║█████╔╝     ██╔████╔██║███████║██║     ███████║██║██╔██╗ ██║███████║
██╔══██║██║  ██║██╔═██╗     ██║╚██╔╝██║██╔══██║██║     ██╔══██║██║██║╚██╗██║██╔══██║
██║  ██║██████╔╝██║  ██╗    ██║ ╚═╝ ██║██║  ██║╚██████╗██║  ██║██║██║ ╚████║██║  ██║
╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
  `),
  );
  console.log(
    magenta(
      "                           🎮 " +
        bold("Educational GAMING AI SYSTEM") +
        " 🔥",
    ),
  );
  console.log(
    yellow("                              💯 Learn with the Agent! 💯\n"),
  );

  intro(cyan("🕹️ Ask me anything!"));

  const question = await text({
    message: "What is your question?",
    placeholder: "Enter your question...",
    validate: (value) => (value ? undefined : "Please enter a question"),
  });

  if (!question || typeof question !== "string") {
    outro(red("❌ No question provided"));
    return;
  }

  const s = spinner();
  s.start(blue("Processing..."));

  try {
    const { runner } = await getRootAgent();
    const response = await runner.ask(question);

    s.stop(green("✅ Done!"));
    console.log("\n" + cyan("📝 Response:"));
    console.log(response);

    const continueSession = await confirm({ message: "Ask another question?" });
    if (continueSession) {
      console.log("\n");
      await runSession();
    } else {
      outro(green("👋 Goodbye!"));
    }
  } catch (error) {
    s.stop(red("❌ Error"));
    console.error(
      red("Error:"),
      error instanceof Error ? error.message : "Unknown",
    );
    outro(red("Session ended"));
  }
}

runSession().catch(console.error);
