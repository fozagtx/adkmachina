"use client";

import { useState } from "react";
import { askAgent } from "../_actions";

export default function AgentForm() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const result = await askAgent(input);
      setResponse(result);
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Your Message
            </label>
            <input
              id="message"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about jokes or weather..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? "Processing..." : "Send"}
          </button>
        </div>
      </form>

      {response && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Response:
          </h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {response}
          </p>
        </div>
      )}
    </>
  );
}
