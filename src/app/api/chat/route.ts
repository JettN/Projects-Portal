import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// ── Setup (same as your Python "client = ..." lines) ──────────────────────────

const PROVIDER = process.env.LLM_PROVIDER || "gemini";

const claudeClient = PROVIDER === "claude"
  ? new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
  : null;

const geminiClient = PROVIDER === "gemini"
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  : null;

const openaiClient = PROVIDER === "openai"
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// ── call_llm (direct translation of your Python function) ────────────────────

async function call_llm(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {

  if (PROVIDER === "claude") {
    const response = await claudeClient!.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: `You are Ramsey, the friendly AI assistant for HKN at UCSD.
Help students learn about HKN projects, events, how to join, and engineering resources.
Be concise and friendly. If unsure, suggest they email hkn@ucsd.edu.`,
      messages,
    });
    return (response.content[0] as { text: string }).text;

  } else if (PROVIDER === "gemini") {
    const model = geminiClient!.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are Ramsey, the friendly AI assistant for HKN at UCSD.
Help students learn about HKN projects, events, how to join, and engineering resources.
Be concise and friendly. If unsure, suggest they email hkn@ucsd.edu.`,
    });

    // Convert history (all but last message) into Gemini chat format
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1].content;
    const response = await chat.sendMessage(lastMessage);
    return response.response.text();

  } else if (PROVIDER === "openai") {
    const response = await openaiClient!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Ramsey, the friendly AI assistant for HKN at UCSD.
Help students learn about HKN projects, events, how to join, and engineering resources.`,
        },
        ...messages,
      ],
    });
    return response.choices[0].message.content!;
  }

  throw new Error(`Unknown provider: ${PROVIDER}`);
}

// ── API Route handler ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const reply = await call_llm(messages);
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("[/api/chat] Error:", error?.message ?? error);
    return NextResponse.json(
      { error: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}