FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y build-essential
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PORT=7000
EXPOSE 7000
CMD ["python", "risk_service.py"]
