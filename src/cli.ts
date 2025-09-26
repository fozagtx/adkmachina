import * as dotenv from "dotenv";
import { getRootAgent } from "./agents/agent";

dotenv.config();

/**
 * CLI interface for single questions
 * Usage: npm run cli "What are the latest AI developments?"
 */
async function cli() {
  const question = process.argv[2];

  if (!question) {
    console.log("❌ Please provide a question as an argument");
    console.log("Usage: npm run cli \"Your question here\"");
    console.log("\nExamples:");
    console.log('npm run cli "What are the latest AI developments?"');
    console.log('npm run cli "Generate a dataset of 10 user profiles"');
    process.exit(1);
  }

  console.log("🚀 AI Agent System - CLI Mode");
  console.log("=".repeat(50));
  console.log(`📝 Question: ${question}`);
  console.log("-".repeat(50));

  try {
    const { runner } = await getRootAgent();
    const response = await runner.ask(question);

    console.log("✅ Response:");
    console.log(response);
    console.log("\n" + "=".repeat(50));
    console.log("✨ Task completed successfully!");

  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log("💡 Tip: Check your .env file configuration");
    process.exit(1);
  }
}

cli();
