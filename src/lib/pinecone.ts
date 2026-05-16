import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";

// ── Initialise clients ────────────────────────────────────────────────────────

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const INDEX_NAME = process.env.PINECONE_INDEX;

// We use Gemini's embedding model to turn the user's query into a vector.
// This MUST be the same model used when indexing — both use "text-embedding-004"
// so they produce vectors in the same dimensional space.
const embedder = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY!, httpOptions: { apiVersion: "v1" } });

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Given a user query, fetch the most relevant chunks from Pinecone
 * and return them as a single string ready to paste into the system prompt.
 *
 * @param query   The user's latest message
 * @param topK    How many chunks to retrieve (3 is a good default)
 */
export async function retrieveContext(query: string, topK = 3): Promise<string> {
  try {
    // 1. Embed the query
    const result = await embedder.models.embedContent({
      model: "text-embedding-004",
      contents: [{ parts: [{ text: query }] }],
    });
    const queryVector = result.embeddings[0].values;

    // 2. Query Pinecone for the nearest neighbours
    const index = pinecone.index(INDEX_NAME);
    const queryResponse = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    });

    // 3. Pull the raw text out of each match and join into one block
    const chunks = queryResponse.matches
      .filter((m) => m.score && m.score > 0.5) // ignore low-confidence matches
      .map((m) => {
        const source = m.metadata?.source ?? "unknown";
        const text   = m.metadata?.text   ?? "";
        return `[${source}]\n${text}`;
      });

    if (chunks.length === 0) return "";

    return chunks.join("\n\n---\n\n");

  } catch (err) {
    // If Pinecone is unreachable, fall back gracefully — the assistant still works,
    // just without the extra knowledge base context.
    console.error("[pinecone] retrieval error:", err);
    return "";
  }
}