// netlify/plugins/index-pinecone/index.js
//
// Netlify Build Plugin — re-indexes Pinecone after every successful deploy.
// Triggered automatically whenever Decap CMS commits a new project to GitHub.
//
// Setup:
//   1. Place this file at netlify/plugins/index-pinecone/index.js
//   2. Add the plugin to netlify.toml (see below)
//   3. Add PINECONE_API_KEY, PINECONE_INDEX, GEMINI_API_KEY,
//      GITHUB_TOKEN to Netlify environment variables

module.exports = {
  onSuccess: async ({ utils }) => {
    console.log("[pinecone-plugin] Deploy succeeded — starting re-index...");

    try {
      const { Pinecone } = await import("@pinecone-database/pinecone");
      const { GoogleGenAI } = await import("@google/genai");
      const { Octokit } = await import("@octokit/rest");
      const path = await import("path");

      // ── Config ──────────────────────────────────────────────────────────────

      const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
      const PINECONE_INDEX   = process.env.PINECONE_INDEX;
      const GEMINI_API_KEY   = process.env.GEMINI_API_KEY;
      const GITHUB_TOKEN     = process.env.GITHUB_TOKEN;
      const REPO_OWNER       = "JettN";
      const REPO_NAME        = "Projects-Portal";
      const CONTENT_PATH     = "content/projects";

      if (!PINECONE_API_KEY || !GEMINI_API_KEY || !GITHUB_TOKEN) {
        utils.build.failPlugin(
          "Missing required env vars: PINECONE_API_KEY, GEMINI_API_KEY, GITHUB_TOKEN"
        );
        return;
      }

      // ── 1. Fetch all markdown files from GitHub ──────────────────────────────

      const octokit = new Octokit({ auth: GITHUB_TOKEN });

      // Get the list of project folders
      const { data: folders } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo:  REPO_NAME,
        path:  CONTENT_PATH,
      });

      const docs = [];

      for (const folder of folders) {
        if (folder.type !== "dir") continue;

        try {
          // Each project is a folder containing index.md
          const { data: file } = await octokit.repos.getContent({
            owner: REPO_OWNER,
            repo:  REPO_NAME,
            path:  `${CONTENT_PATH}/${folder.name}/index.md`,
          });

          // Content comes back as base64
          const text = Buffer.from(file.content, "base64").toString("utf-8");

          docs.push({
            text,
            metadata: {
              source: "github_cms",
              project: folder.name,
              path: file.path,
            },
          });
        } catch {
          // Some folders may not have an index.md yet — skip silently
        }
      }

      console.log(`[pinecone-plugin] Fetched ${docs.length} project documents from GitHub`);

      if (docs.length === 0) {
        console.log("[pinecone-plugin] No documents found — skipping index update");
        return;
      }

      // ── 2. Chunk documents ────────────────────────────────────────────────────

      const CHUNK_SIZE    = 512;
      const CHUNK_OVERLAP = 50;

      const chunks = [];
      for (const doc of docs) {
        const words = doc.text.split(/\s+/);
        let i = 0;
        while (i < words.length) {
          const chunkWords = words.slice(i, i + CHUNK_SIZE);
          chunks.push({
            text:     chunkWords.join(" "),
            metadata: doc.metadata,
          });
          i += CHUNK_SIZE - CHUNK_OVERLAP;
        }
      }

      console.log(`[pinecone-plugin] Created ${chunks.length} chunks`);

      // ── 3. Embed chunks using Gemini ─────────────────────────────────────────

      const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

      const vectors = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const result = await client.models.embedContent({
          model: "text-embedding-004",
          contents: [{ parts: [{ text: chunk.text }] }],
        });
        vectors.push({
          id:       `cms-${chunk.metadata.project}-${i}`,
          values:   result.embeddings[0].values,
          metadata: {
            ...chunk.metadata,
            text: chunk.text,
          },
        });
      }

      console.log(`[pinecone-plugin] Embedded ${vectors.length} vectors`);

      // ── 4. Push to Pinecone ───────────────────────────────────────────────────
      // We delete existing cms vectors first so removed projects don't linger.

      const pc    = new Pinecone({ apiKey: PINECONE_API_KEY });
      const index = pc.index(PINECONE_INDEX);

      // Delete all previously indexed CMS vectors by prefix
      await index.deleteMany({ source: "github_cms" });
      console.log("[pinecone-plugin] Cleared old github_cms vectors");

      // Upsert in batches of 100 (Pinecone limit)
      const BATCH_SIZE = 100;
      for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
        const batch = vectors.slice(i, i + BATCH_SIZE);
        await index.upsert(batch);
      }

      console.log(`[pinecone-plugin] ✅ Upserted ${vectors.length} vectors into '${PINECONE_INDEX}'`);

    } catch (err) {
      // Use failPlugin so Netlify marks the deploy as failed if indexing breaks
      utils.build.failPlugin(`Pinecone indexing failed: ${err.message}`);
    }
  },
};