import * as dotenv from "dotenv";
import { getRootAgent } from "./agents/agent";

dotenv.config();

async function main() {
  console.log("🚀 AI Agent System");
  
  const { runner } = await getRootAgent();
  
  const args = process.argv.slice(2);
  const question = args.join(" ");
  
  if (!question) {
    console.log("Usage: pnpm start \"your question here\"");
    return;
  }
  
  try {
    console.log(`Question: ${question}`);
    const response = await runner.ask(question);
    console.log(`Response: ${response}`);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

main().catch(console.error);
