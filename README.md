# AI Agent System with Search & Dataset Generation

A powerful AI agent system built with IQAI ADK that provides web search and synthetic dataset generation capabilities.

## Features

### 🔍 Search Agent (Brave Search API)
- Web search for current information and research
- News search for recent articles and breaking news  
- Ad-free, privacy-focused search results

### 📊 Dataset Agent (Synthik API)
- Generate synthetic tabular datasets with custom columns
- Create text datasets for NLP and AI training
- Support for multiple data types: string, int, email, categorical
- **No API key required!** Works out of the box

## Quick Start

1. **Install dependencies:**
```bash
pnpm install
```

2. **Set up environment:**
```bash
cp .env.example .env
```
Edit `.env` and add your `GOOGLE_API_KEY` (required)

3. **Ask questions directly:**
```bash
# Ask any question - the system routes to the right agent automatically
pnpm ask "What are the latest AI developments in 2025?"
pnpm ask "Generate a dataset of 10 user profiles with name, age, email"
pnpm ask "Search for TypeScript best practices"
pnpm ask "Create a text dataset for sentiment analysis"

# Or build and run
pnpm build
pnpm start "your question here"
```

## API Keys

### Google AI (Required)
Get your free API key at: https://aistudio.google.com/app/apikey

### Brave Search (Optional)
Get your free API key at: https://api-dashboard.search.brave.com/
- Free tier: 2,000 queries/month
- Add `BRAVE_API_KEY` to `.env` for search functionality

### Synthik Labs (No API Key Required!)
Synthik API works out of the box - no setup needed!
- High-quality synthetic data generation
- Free to use with reasonable limits

## Usage Examples

### Interactive Mode
```bash
npm run interactive
### Search Questions
```bash
pnpm ask "What are the latest AI developments?"
pnpm ask "Find recent news about renewable energy"
pnpm ask "Search for React best practices"
```
Then ask questions like:

**Search### Dataset Generation
```bash
pnpm ask "Generate a dataset of 50 user profiles"
pnpm ask "Create sales data with product, price, quantity columns"
pnpm ask "Generate text data for sentiment analysis"
```

## How It Works

The system uses a **Root Agent** that automatically routes your questions to specialized sub-agents:

- **Search Agent** - Handles information requests, research, news
- **Dataset Agent** - Handles data generation, ML datasets, test data

No need to specify which agent to use - the system intelligently determines the best agent for your question!

## Development

```bash
# Development mode
pnpm dev "your question"

# Build for production
pnpm build

# Clean build artifacts
pnpm clean
```

## Architecture

- **Root Agent**: Intelligent request routing
- **Search Agent**: Brave Search API integration
- **Dataset Agent**: Synthik API integration
- **Tools**: Modular API integrations

Built with:
- [IQAI ADK](https://github.com/IQAICOM/adk-ts) - AI Agent Development Kit
- [Brave Search API](https://brave.com/search/api/) - Privacy-focused web search
- [Synthik API](https://synthiklabs.com/) - Synthetic data generation
- TypeScript for type safety