# api/Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=4000 \
    WORKDIR=/app

WORKDIR /app

# small build deps for some wheels
RUN apt-get update \
 && apt-get install -y --no-install-recommends gcc build-essential libffi-dev curl \
 && rm -rf /var/lib/apt/lists/*

# copy only requirements first for cache
COPY requirements.txt /app/requirements.txt

RUN pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir -r /app/requirements.txt

# copy source & models
COPY src /app/src
COPY models /app/models

# create a non-root user
RUN groupadd -r neurofin && useradd -r -g neurofin neurofin \
 && chown -R neurofin:neurofin /app

USER neurofin

EXPOSE ${PORT}

# use gunicorn to serve Flask app; workers tuned lightly
CMD ["gunicorn", "src.app:app", "--bind", "0.0.0.0:4000", "--workers", "2", "--threads", "4", "--timeout", "120"]
