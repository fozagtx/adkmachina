# Relo AI

Multi-agent platform for User Generated Content (UGC) creation.
![Relo AI Logo](/clickable_button_verification)


## Demo

[🎥 Watch a demo of Relo AI in action](./public/delight.mp4)


## What It Does

Relo AI gives you two AI agents that work together to create viral-ready UGC content:

* **Hook Agent:** Optimizes your hooks to be scroll-stopping and engaging.
* **Script Agent:** Expands your hooks into a structured, retention-optimized script.
* **Voice Over Generation:** Generates high-quality voice over for your scripts using the ElevenLabs API.

---

## Real-World Usage Examples

### **Hook Tool**

> I’m creating a short-form video in the **tech** niche about **automation**.
> The goal is to help viewers **save time and scale their workflow**.
> I want the hooks to sound **bold and story-driven**, and I’m posting on **TikTok**.
> Generate some viral hook ideas, a few visual pattern interrupts, and quick A/B test suggestions.

---

### **Script Tool**

> I have a viral hook that says, *“You’re wasting hours, this automation gets you results in half the time.”*
> I want to turn it into a **45-second short-form script** for a **tech creator persona**.
> The goal is to **boost awareness and engagement**.
> End it with a call to action that invites viewers to follow for more automation tips.
> Include pacing notes, shot suggestions, and delivery style.

---

### **Template Versions (for dynamic inputs)**

#### Hook Tool Prompt

> I’m creating a short-form video in the **{niche}** niche.
> The goal is to help viewers **{goalType}**.
> I want the hooks to sound **{vibe}**, and I’m posting on **{platform}**.
> Generate several viral hook ideas, along with pattern interrupts, delivery angles, and quick A/B testing suggestions.

#### Script Tool Prompt

> I have a hook that says, *“{hook}”*.
> Turn it into a **{durationSeconds}-second short-form script** for a **{avatarType} persona**.
> The goal is to **{goalType}** within the **{niche}** niche.
> End it with a clear call to action that encourages viewers to **{callToAction}**.
> Include pacing notes, suggested visuals or B-roll ideas, and delivery style.

---

## Quick Start

```bash
git clone <your-repo-url>
cd relo-ai
pnpm install
pnpm dev
```

Set up your `.env` file:

```
GOOGLE_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
```

---

## Core Features

* **Multi-agent architecture:** Specialized agents for each stage of content creation.
* **Interactive chat UI:** Talk directly with agents to refine your ideas.
* **Workflow editor:** Visualize and manage your creative process.
* **High-quality voice generation:** Create realistic narration with ElevenLabs.

---

## 🧠 Tech Stack

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="40" height="40" alt="Next.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" height="40" alt="TypeScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" alt="React" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="40" height="40" alt="Tailwind CSS" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40" height="40" alt="Node.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="40" height="40" alt="Git" />
</p>

* **Next.js** – React framework for fast, modern web apps
* **TypeScript** – Strongly typed language for scalable code
* **Tailwind CSS** – Utility-first styling
* **@iqai/adk** – Agent Development Kit for AI agent creation
* **ElevenLabs** – API for generating lifelike voiceovers
* **React Flow** – Node-based workflow visualization

---

## Use Cases

* Create short-form content for TikTok, Reels, or YouTube Shorts
* Generate voiceovers for scripts automatically
* Brainstorm fresh hooks and video ideas
* Learn how to write viral hooks that retain attention

