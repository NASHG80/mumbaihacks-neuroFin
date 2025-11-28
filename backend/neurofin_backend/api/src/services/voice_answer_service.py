import requests
import os
from conversation_memory import get_history, add_to_history

GROQ_KEY = os.getenv("GROQ_API_KEY")

def generate_voice_answer(user_id, question):
    
    # 1️⃣ Load last few messages
    history = get_history(user_id)

    # 2️⃣ Build messages with memory + new question
    messages = history + [
        {"role": "user", "content": question}
    ]

    # 3️⃣ Call Groq Chat Completion
    groq_res = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {GROQ_KEY}"},
        json={
            "model": "llama-3.1-8b-instant",
            "messages": messages
        }
    ).json()

    answer = groq_res["choices"][0]["message"]["content"]

    # 4️⃣ Save new messages to memory
    add_to_history(user_id, "user", question)
    add_to_history(user_id, "assistant", answer)

    return {"answer_text": answer}
