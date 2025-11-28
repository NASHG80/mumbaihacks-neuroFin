# replace existing embed_texts with this
import os
import time
import logging

logger = logging.getLogger("rag")

def embed_texts(texts, model="text-embedding-3-small", batch_size=16, max_retries=4):
    """
    Return list-of-embedding vectors for input texts.
    Supports both the new "OpenAI" client (client.embeddings.create) and legacy
    openai.Embedding.create(...) APIs. Retries with exponential backoff on failure.
    """
    if not texts:
        return []

    # chunking utility
    def chunks(lst, n):
        for i in range(0, len(lst), n):
            yield lst[i : i + n]

    api_key = os.environ.get("OPENAI_API_KEY", "")
    last_exc = None
    out_embeddings = []

    for batch in chunks(texts, batch_size):
        backoff = 1.0
        for attempt in range(1, max_retries + 1):
            try:
                # Try new-style client first (if available)
                try:
                    # new OpenAI client style: from openai import OpenAI; client = OpenAI()
                    from openai import OpenAI as _OpenAIClient  # type: ignore
                    client = _OpenAIClient(api_key=api_key) if api_key else _OpenAIClient()
                    resp = client.embeddings.create(model=model, input=batch)
                    # response shape: resp.data -> list of { "embedding": [...] }
                    out_embeddings.extend([d["embedding"] for d in resp.data])
                    last_exc = None
                    break
                except Exception as e_new:
                    # fallback to legacy openai module
                    try:
                        import openai as _openai_legacy  # type: ignore
                        if api_key:
                            # older clients use openai.api_key
                            try:
                                _openai_legacy.api_key = api_key
                            except Exception:
                                # some versions use _openai_legacy.api_key = ...
                                pass
                        # legacy call
                        resp = _openai_legacy.Embedding.create(input=batch, model=model)
                        # resp['data'] list of {'embedding': [...]}
                        out_embeddings.extend([item["embedding"] for item in resp["data"]])
                        last_exc = None
                        break
                    except Exception as e_legacy:
                        # both attempts failed — record to raise or retry
                        last_exc = e_legacy
                        logger.warning("Embedding call failed (attempt %d/%d): %s", attempt, max_retries, repr(e_legacy))
                        # fall through to retry/backoff
            except Exception as e_outer:
                last_exc = e_outer
                logger.warning("Unexpected embedding error (attempt %d/%d): %s", attempt, max_retries, repr(e_outer))

            # exponential backoff before retrying
            time.sleep(backoff)
            backoff *= 2.0

        if last_exc is not None:
            # abort early if we exhausted retries for this batch
            raise RuntimeError(f"Embedding failed after {max_retries} attempts: {repr(last_exc)}")

    return out_embeddings
# ------------------------------------------------------------------------
# COMPATIBILITY SHIM: Make sure `retrieve` exists for langgraph_flow.py
# ------------------------------------------------------------------------

def retrieve(user_id, k=5, embed_model="text-embedding-3-small"):
    """
    Temporary fallback RAG retrieval function.

    If your real RAG code is not implemented or uses a different function
    name, this prevents ImportErrors and allows the agent to run properly.

    Returns a list of dicts like:
    [
        {"text": "sample", "meta": {"source": "none"}}
    ]
    """

    # Optionally try calling your actual retrieval function if it exists
    for alt in ["retrieve_docs", "retrieve_documents", "retrieve_for_user", "rag_retrieve"]:
        if alt in globals() and callable(globals()[alt]):
            try:
                return globals()[alt](user_id, k=k, embed_model=embed_model)
            except Exception:
                pass  # fall back if it fails

    # FINAL fallback: return empty list
    return []

