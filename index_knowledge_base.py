"""
index_knowledge_base.py
=======================
Run this script ONCE (or whenever content changes) to populate Pinecone.

Install dependencies:
    pip install llama-index llama-index-vector-stores-pinecone
                llama-index-embeddings-google-genai
                pinecone-client python-dotenv google-genai requests
"""

import os
import base64
import requests
from dotenv import load_dotenv
load_dotenv()

from pinecone import Pinecone, ServerlessSpec
from llama_index.core import VectorStoreIndex, StorageContext, Settings, Document
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core.node_parser import SentenceSplitter

# ── Embedding setup ───────────────────────────────────────────────────────────
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding

embed_model = GoogleGenAIEmbedding(
    model_name="gemini-embedding-2",
    api_key=os.getenv("GEMINI_API_KEY"),
)

Settings.embed_model = embed_model
Settings.chunk_size = 512
Settings.chunk_overlap = 50


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 1 — GitHub Markdown files (direct API, no llama_index reader)
# ══════════════════════════════════════════════════════════════════════════════

github_docs = []
try:
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    REPO_OWNER   = "JettN"
    REPO_NAME    = "Projects-Portal"
    CONTENT_PATH = "content/projects"
    BRANCH       = "main"

    headers = {"Authorization": f"token {GITHUB_TOKEN}"}

    # List project folders
    r = requests.get(
        f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{CONTENT_PATH}?ref={BRANCH}",
        headers=headers,
    )
    r.raise_for_status()
    folders = r.json()

    for folder in folders:
        if folder["type"] != "dir":
            continue
        try:
            fr = requests.get(
                f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{CONTENT_PATH}/{folder['name']}/index.md?ref={BRANCH}",
                headers=headers,
            )
            fr.raise_for_status()
            file_data = fr.json()
            text = base64.b64decode(file_data["content"]).decode("utf-8")
            doc = Document(
                text=text,
                metadata={
                    "source": "github_cms",
                    "project": folder["name"],
                    "path": file_data["path"],
                },
            )
            github_docs.append(doc)
        except Exception as e:
            print(f"  ⚠ Skipped {folder['name']}: {e}")

    print(f"✅ GitHub: loaded {len(github_docs)} documents")
except Exception as e:
    print(f"❌ GitHub: {e}")


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 2 — Google Drive (disabled — requires service account credentials)
# ══════════════════════════════════════════════════════════════════════════════
drive_docs = []
print("⚠ Google Drive: skipped (disabled)")


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 3 — Organisation websites
# ══════════════════════════════════════════════════════════════════════════════
web_docs = []
try:
    from llama_index.readers.web import SimpleWebPageReader
    web_reader = SimpleWebPageReader(html_to_text=True)
    web_docs = web_reader.load_data(urls=[
        "https://hknucsd.com/",
        "https://hardhack.dev",
    ])
    for doc in web_docs:
        doc.metadata["source"] = "website"
    print(f"✅ Websites: loaded {len(web_docs)} documents")
except Exception as e:
    print(f"⚠ Websites: skipped ({e})")


# ══════════════════════════════════════════════════════════════════════════════
# COMBINE & INDEX
# ══════════════════════════════════════════════════════════════════════════════

all_docs = github_docs + drive_docs + web_docs

if not all_docs:
    print("\n❌ No documents loaded — check errors above. Aborting.")
    exit(1)

print(f"\n📄 Total documents loaded: {len(all_docs)}")

# ── Connect to Pinecone ───────────────────────────────────────────────────────

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index_name = os.getenv("PINECONE_INDEX")

if index_name not in [i.name for i in pc.list_indexes()]:
    pc.create_index(
        name=index_name,
        dimension=3072,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )
    print(f"✅ Created Pinecone index: {index_name}")
else:
    print(f"✅ Using existing Pinecone index: {index_name}")

pinecone_index = pc.Index(index_name)

# ── Chunk and push ────────────────────────────────────────────────────────────

vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

print("\n⏳ Embedding and indexing — this may take a minute...")

VectorStoreIndex.from_documents(
    all_docs,
    storage_context=storage_context,
    transformations=[SentenceSplitter(chunk_size=512, chunk_overlap=50)],
    show_progress=True,
)

print(f"\n🎉 Done! {len(all_docs)} documents indexed into '{index_name}'")
print("The chatbot can now answer questions using this knowledge base.")


# ══════════════════════════════════════════════════════════════════════════════
# QUICK TEST
# ══════════════════════════════════════════════════════════════════════════════

print("\n── Quick retrieval test ──")

test_store = PineconeVectorStore(pinecone_index=pinecone_index)
test_index = VectorStoreIndex.from_vector_store(test_store)
query_engine = test_index.as_query_engine(similarity_top_k=3)

test_query = "What projects does HKN work on?"
response = query_engine.query(test_query)
print(f"Query:    {test_query}")
print(f"Response: {response}\n")