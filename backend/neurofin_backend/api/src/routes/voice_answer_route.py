from flask import Blueprint, request, jsonify
from services.voice_answer_service import generate_voice_answer
import requests
import base64
import os

bp_voice_answer = Blueprint("voice_answer", __name__)

GROQ_KEY = os.getenv("GROQ_API_KEY")


def groq_tts(text):
    url = "https://api.groq.com/openai/v1/audio/speech"

    payload = {
        "model": "playai-tts",
        "voice": "Aaliyah-PlayAI",
        "input": text
    }

    headers = {
        "Authorization": f"Bearer {GROQ_KEY}",
        "Content-Type": "application/json"
    }

    res = requests.post(url, json=payload, headers=headers)

    if res.status_code != 200:
        print("Groq TTS Error:", res.text)
        return None

    return res.content  # raw mp3 bytes


@bp_voice_answer.route("/voice-answer", methods=["POST"])
def voice_answer():
    data = request.get_json() or {}

    user_id = data.get("user_id")
    question = data.get("question")

    if not user_id or not question:
        return jsonify({"error": "user_id and question are required"}), 400

    # 1️⃣ TEXT: ask Groq for the answer
    result = generate_voice_answer(user_id, question)

    answer_text = result.get("answer_text") if isinstance(result, dict) else result

    if not answer_text:
        return jsonify({"error": "AI did not return a text answer"}), 500

    # 2️⃣ AUDIO: convert text → speech (MP3)
    audio_bytes = groq_tts(answer_text)

    if audio_bytes is None:
        return jsonify({"error": "Groq TTS generation failed"}), 500

    # Convert audio to base64 for frontend
    audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

    # 3️⃣ Return JSON with text + audio
    return jsonify({
        "answer_text": answer_text,
        "audio_base64": audio_base64,
        "mimetype": "audio/mpeg"
    })
