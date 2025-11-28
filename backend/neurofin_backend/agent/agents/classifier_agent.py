def classifier_agent(description: str):
    """
    Classifies spending category using rules.
    """

    desc = description.lower()

    if any(w in desc for w in ["food", "restaurant", "cafe", "pizza", "burger"]):
        return "Food & Drink"

    if any(w in desc for w in ["uber", "ola", "bus", "train"]):
        return "Transport"

    if any(w in desc for w in ["zara", "shopping", "clothes"]):
        return "Shopping"

    if any(w in desc for w in ["rent", "house", "flat"]):
        return "Rent"

    if any(w in desc for w in ["doctor", "pharmacy", "hospital"]):
        return "Health"

    return "Others"
