# Simple in-memory chat memory (reset on restart)
conversation_store = {}   # { user_id: [ {role, content}, ... ] }

def get_history(user_id, limit=6):
    """Return last few messages for short-term memory."""
    return conversation_store.get(user_id, [])[-limit:]

def add_to_history(user_id, role, content):
    """Append a new message to memory."""
    if user_id not in conversation_store:
        conversation_store[user_id] = []
    conversation_store[user_id].append({"role": role, "content": content})
