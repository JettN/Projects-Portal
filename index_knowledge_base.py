"""
index_knowledge_base.py
=======================
Run this script ONCE (or whenever content changes) to populate Pinecone.

Install dependencies:
    pip install llama-index llama-index-vector-stores-pinecone
                llama-index-readers-github llama-index-readers-google
                llama-index-readers-web llama-index-embeddings-google-genai
                pinecone-client python-dotenv google-genai
"""

import os
from dotenv import load_dotenv
load_dotenv()

from pinecone import Pinecone, ServerlessSpec
from llama_index.core import VectorStoreIndex, StorageContext, Settings
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core.node_parser import SentenceSplitter

# ── Embedding setup (updated google-genai SDK) ────────────────────────────────
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding

embed_model = GoogleGenAIEmbedding(
    model_name="text-embedding-004",
    api_key=os.getenv("GEMINI_API_KEY"),
)

Settings.embed_model = embed_model
Settings.chunk_size = 512
Settings.chunk_overlap = 50


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 1 — GitHub Markdown files (Aman)
# ══════════════════════════════════════════════════════════════════════════════
from llama_index.readers.github import GithubRepositoryReader, GithubClient

github_docs = []
try:
    github_client = GithubClient(
        github_token=os.getenv("GITHUB_TOKEN"),  # fixed: was api_key
    )
    github_reader = GithubRepositoryReader(
        github_client=github_client,
        owner="JettN",
        repo="Projects-Portal",
        filter_directories=(
            ["content/projects"],
            GithubRepositoryReader.FilterType.INCLUDE,
        ),
        filter_file_extensions=(
            [".md"],
            GithubRepositoryReader.FilterType.INCLUDE,
        ),
    )
    github_docs = github_reader.load_data(branch="test-deployment")
    for doc in github_docs:
        doc.metadata["source"] = "github_cms"
    print(f"✅ GitHub: loaded {len(github_docs)} documents")
except Exception as e:
    print(f"❌ GitHub: {e}")


# ══════════════════════════════════════════════════════════════════════════════
# SECTION 2 — Google Drive folder PDFs (Annie & Lina)
#
# IMPORTANT: credentials.json must be a SERVICE ACCOUNT key, not an
# OAuth client secret. See README for how to create one.
# Also make sure you've shared the Drive folder with the service account email.
# ══════════════════════════════════════════════════════════════════════════════
from llama_index.readers.google import GoogleDriveReader

drive_docs = []
try:
    drive_reader = GoogleDriveReader(
        service_account_key_path=os.getenv("GOOGLE_CREDENTIALS", "credentials.json"),
    )
    drive_docs = drive_reader.load_data(
        folder_id="1zf3JNZbrSKR1mnLBhirNdoJuncY99tOQ"
    )
    for doc in drive_docs:
        doc.metadata["source"] = "google_drive"
    print(f"✅ Drive folder: loaded {len(drive_docs)} documents")
except Exception as e:
    print(f"❌ Drive folder: {e}")



# ══════════════════════════════════════════════════════════════════════════════
# SECTION 4 — Organisation websites (Saravanan & Benny)
# ══════════════════════════════════════════════════════════════════════════════
from llama_index.readers.web import SimpleWebPageReader

web_docs = []
try:
    web_reader = SimpleWebPageReader(html_to_text=True)
    web_docs = web_reader.load_data(urls=[
        "https://hknucsd.com/",
        "https://hardhack.dev",
    ])
    for doc in web_docs:
        doc.metadata["source"] = "website"
    print(f"✅ Websites: loaded {len(web_docs)} documents")
except Exception as e:
    print(f"❌ Websites: {e}")


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
        dimension=768,
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
print("Ramsey can now answer questions using this knowledge base.")


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