# ------------ Base Image ------------
FROM python:3.11-slim

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=6000

# ------------ Work Directory ------------
WORKDIR /app

# ------------ System Dependencies ------------
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      gcc \
      build-essential \
      libffi-dev \
      curl \
 && rm -rf /var/lib/apt/lists/*

# ------------ Install Python Requirements First ------------
COPY requirements.txt /app/requirements.txt

RUN pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir -r /app/requirements.txt

# ------------ Copy Entire Agent Source ------------
# This includes:
# - agents/
# - langgraph_flow.py
# - rag.py
# - respond.py
# - tools/
COPY . /app

# ------------ Add Non-Root User ------------
RUN groupadd -r neurofin && \
    useradd  -r -g neurofin neurofin && \
    chown -R neurofin:neurofin /app

USER neurofin

# ------------ Expose LangGraph Port ------------
EXPOSE ${PORT}

# ------------ Entrypoint ------------
# Run the LangGraph service
CMD ["python", "-u", "langgraph_flow.py"]
