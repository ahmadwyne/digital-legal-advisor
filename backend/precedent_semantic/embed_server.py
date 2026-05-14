"""
embed_server.py
===============
Standalone FastAPI service that generates sentence embeddings for
legal precedent semantic search. Completely independent of the chatbot
RAG service (python_service/).

Model : sentence-transformers/all-MiniLM-L6-v2  (384-dim, ~90 MB, CPU-fast)
Port  : 5001  (separate from chatbot service on 8000)

Start:
  uvicorn embed_server:app --host 0.0.0.0 --port 5001

Or with auto-reload during development:
  uvicorn embed_server:app --host 0.0.0.0 --port 5001 --reload
"""

import logging
import os
import warnings
from pathlib import Path

# Block TensorFlow from loading — we use PyTorch only.
# Must be set before any ML library is imported.
os.environ["USE_TF"]                           = "0"
os.environ["USE_TORCH"]                        = "1"
os.environ["TF_CPP_MIN_LOG_LEVEL"]             = "3"
os.environ["TF_ENABLE_ONEDNN_OPTS"]            = "0"
os.environ["TOKENIZERS_PARALLELISM"]           = "false"
os.environ["TRANSFORMERS_NO_ADVISORY_WARNINGS"] = "1"
warnings.filterwarnings("ignore")

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load backend/.env so PORT can be overridden if needed
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
logger = logging.getLogger("embed_server")

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Precedent Embedding Service",
    description="Generates 384-dim sentence embeddings for legal precedent semantic search",
    version="1.0.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",   # Node.js backend
        "http://localhost:5173",   # Vite frontend
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Model (loaded once at startup) ────────────────────────────────────────────

_model = None


@app.on_event("startup")
def load_model():
    global _model
    logger.info(f"Loading embedding model: {MODEL_NAME}")
    try:
        import torch
        import torch.nn.functional as F
        from transformers import AutoTokenizer, AutoModel

        tok = AutoTokenizer.from_pretrained(MODEL_NAME)
        mdl = AutoModel.from_pretrained(MODEL_NAME)
        mdl.eval()

        def _encode(texts: list) -> list:
            enc = tok(texts, padding=True, truncation=True,
                      max_length=256, return_tensors="pt")
            with torch.no_grad():
                out = mdl(**enc)
            mask   = enc["attention_mask"].unsqueeze(-1).float()
            pooled = (out.last_hidden_state * mask).sum(1) / mask.sum(1).clamp(min=1e-9)
            return torch.nn.functional.normalize(pooled, p=2, dim=1).tolist()

        _model = _encode
        dim = len(_encode(["test"])[0])
        logger.info(f"Model ready — {dim}-dim embeddings.")
    except Exception as exc:
        logger.error(f"Failed to load model: {exc}")
        raise


# ── Request / Response schemas ────────────────────────────────────────────────

class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    embedding: list[float]
    dimension: int
    model: str


class BatchEmbedRequest(BaseModel):
    texts: list[str]


class BatchEmbedResponse(BaseModel):
    embeddings: list[list[float]]
    dimension: int
    model: str
    count: int


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/")
def health():
    return {
        "status": "online",
        "model": MODEL_NAME,
        "model_loaded": _model is not None,
        "service": "Precedent Embedding Service",
    }


@app.post("/embed", response_model=EmbedResponse)
def embed_single(req: EmbedRequest):
    """Embed a single query string. Called by the Node.js backend at search time."""
    if _model is None:
        raise HTTPException(status_code=503, detail="Embedding model not loaded yet")
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="text cannot be empty")

    vector = _model([text[:2000]])[0]
    return EmbedResponse(embedding=vector, dimension=len(vector), model=MODEL_NAME)


@app.post("/embed/batch", response_model=BatchEmbedResponse)
def embed_batch(req: BatchEmbedRequest):
    """Batch embed multiple texts. Used by embed_and_import.py during the one-time import."""
    if _model is None:
        raise HTTPException(status_code=503, detail="Embedding model not loaded yet")
    if not req.texts:
        raise HTTPException(status_code=400, detail="texts list cannot be empty")
    if len(req.texts) > 128:
        raise HTTPException(status_code=400, detail="Maximum 128 texts per batch")

    vectors = _model([t[:2000] for t in req.texts])
    return BatchEmbedResponse(
        embeddings=vectors,
        dimension=len(vectors[0]) if vectors else 0,
        model=MODEL_NAME,
        count=len(vectors),
    )


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PRECEDENT_EMBED_PORT", 5001))
    logger.info(f"Starting Precedent Embedding Service on port {port}")
    uvicorn.run("embed_server:app", host="0.0.0.0", port=port, reload=False)
