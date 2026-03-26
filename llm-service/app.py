# import os
# from fastapi import FastAPI, Header, HTTPException
# from pydantic import BaseModel
# from dotenv import load_dotenv

# load_dotenv()

# API_KEY = os.getenv("LLM_API_KEY", "")

# app = FastAPI(title="Legal LLM Service")

# class QueryRequest(BaseModel):
#     query: str
#     top_k: int = 5
#     user_id: str | None = None
#     session_id: str | None = None

# rag = None
# startup_error = None

# @app.on_event("startup")
# def startup():
#     global rag, startup_error
#     try:
#         from rag_pipeline_improved import ImprovedLegalRAG
#         rag = ImprovedLegalRAG(
#             vector_store_dir=os.getenv("RAG_VECTOR_STORE_DIR", "vector_store_improved"),
#             model_path=os.getenv("RAG_MODEL_PATH", "models/legal-llm-finetuned"),
#             base_model_name=os.getenv("RAG_BASE_MODEL_NAME", "mistralai/Mistral-7B-Instruct-v0.2"),
#             use_gpu=os.getenv("RAG_USE_GPU", "true").lower() == "true",
#             use_hybrid_retrieval=os.getenv("RAG_USE_HYBRID", "true").lower() == "true",
#             hybrid_alpha=float(os.getenv("RAG_HYBRID_ALPHA", "0.6"))
#         )
#     except Exception as e:
#         startup_error = str(e)

# def verify_api_key(auth_header: str | None):
#     if not API_KEY:
#         return
#     if not auth_header or not auth_header.startswith("Bearer "):
#         raise HTTPException(status_code=401, detail="Missing auth token")
#     token = auth_header.replace("Bearer ", "")
#     if token != API_KEY:
#         raise HTTPException(status_code=401, detail="Invalid token")

# @app.get("/health")
# def health():
#     return {"ok": rag is not None, "startup_error": startup_error}

# @app.post("/answer")
# def answer(req: QueryRequest, authorization: str | None = Header(default=None)):
#     verify_api_key(authorization)

#     if rag is None:
#         raise HTTPException(status_code=503, detail=f"Model not loaded: {startup_error}")

#     result = rag.answer_query(req.query, top_k=req.top_k, verbose=False)
#     return {
#         "answer": result.get("answer", ""),
#         "citations": result.get("citations", []),
#         "confidence": result.get("confidence", 0.0),
#         "num_sources": result.get("num_sources", 0)
#     }

import os
import traceback
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("LLM_API_KEY", "")
RAG_VECTOR_STORE_DIR = os.getenv("RAG_VECTOR_STORE_DIR", "vector_store_improved")
RAG_MODEL_PATH = os.getenv("RAG_MODEL_PATH", "models/legal-llm-finetuned")
RAG_BASE_MODEL_NAME = os.getenv("RAG_BASE_MODEL_NAME", "mistralai/Mistral-7B-Instruct-v0.2")
RAG_USE_GPU = os.getenv("RAG_USE_GPU", "true").lower() == "true"
RAG_USE_HYBRID = os.getenv("RAG_USE_HYBRID", "true").lower() == "true"
RAG_HYBRID_ALPHA = float(os.getenv("RAG_HYBRID_ALPHA", "0.6"))

app = FastAPI(title="Legal LLM API")
rag = None
startup_error = None

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5
    user_id: str | None = None
    session_id: str | None = None

def verify_api_key(auth_header: str | None):
    if not API_KEY:
        return
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Authorization")
    token = auth_header.split(" ", 1)[1]
    if token != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.on_event("startup")
def startup():
    global rag, startup_error
    try:
        from rag_pipeline_improved import ImprovedLegalRAG
        rag = ImprovedLegalRAG(
            vector_store_dir=RAG_VECTOR_STORE_DIR,
            model_path=RAG_MODEL_PATH,
            base_model_name=RAG_BASE_MODEL_NAME,
            use_gpu=RAG_USE_GPU,
            use_hybrid_retrieval=RAG_USE_HYBRID,
            hybrid_alpha=RAG_HYBRID_ALPHA,
        )
        startup_error = None
    except Exception as e:
        rag = None
        startup_error = f"{e}\n{traceback.format_exc()}"

@app.get("/health")
def health():
    return {"ok": rag is not None, "startup_error": startup_error}

@app.post("/answer")
def answer(req: QueryRequest, authorization: str | None = Header(default=None)):
    verify_api_key(authorization)

    if rag is None:
        raise HTTPException(status_code=503, detail=f"Model not loaded: {startup_error}")

    result = rag.answer_query(req.query, top_k=req.top_k, verbose=False)
    return {
        "answer": result.get("answer", ""),
        "citations": result.get("citations", []),
        "confidence": result.get("confidence", 0.0),
        "num_sources": result.get("num_sources", 0),
    }
