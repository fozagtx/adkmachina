import { intro, outro, text, confirm, spinner, isCancel } from "@clack/prompts";
import {
  blue,
  green,
  red,
  cyan,
  bgRed,
  bold,
  magenta,
  yellow,
  dim,
} from "picocolors";
import { getRootAgent } from "./agents/agent.js";

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n");
  outro(yellow("👋 Goodbye! Thanks for using ADK Agent!"));
  process.exit(0);
});

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
  console.log(dim("💡 Tip: Press CTRL+C anytime to quit\n"));

  const question = await text({
    message: "What is your question?",
    placeholder:
      "Type your question here... (e.g., 'search for cars', 'help me with coding')",
    validate: (value) => {
      if (!value || value.trim().length === 0) {
        return "Please enter a question";
      }
      if (value.trim().length < 3) {
        return "Question must be at least 3 characters";
      }
      return undefined;
    },
  });

  // Handle cancellation (CTRL+C)
  if (isCancel(question)) {
    outro(yellow("👋 Operation cancelled. Goodbye!"));
    process.exit(0);
  }

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

    const continueSession = await confirm({
      message: "Ask another question?",
      initialValue: true,
    });

    // Handle cancellation (CTRL+C)
    if (isCancel(continueSession)) {
      outro(yellow("👋 Operation cancelled. Goodbye!"));
      process.exit(0);
    }

    if (continueSession) {
      console.log("\n");
      await runSession();
    } else {
      outro(green("👋 Thanks for using ADK Agent! Goodbye!"));
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
