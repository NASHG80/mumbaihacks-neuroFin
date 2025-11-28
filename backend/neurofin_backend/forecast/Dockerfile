FROM python:3.11-slim

WORKDIR /app

# system deps for TF and pandas
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libsndfile1 libatlas3-base libopenblas-dev liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=5000
EXPOSE 5000

# use gunicorn for production; entrypoint will run app
CMD ["gunicorn", "-b", "0.0.0.0:5000", "forecast_service:app", "--workers", "1", "--threads", "2"]
