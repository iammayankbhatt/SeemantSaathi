# To use real transliteration, run: pip install googletrans==4.0.0-rc1
# from googletrans import Translator

def transliterate_to_english(text, lang_code):
    """
    Converts Hindi script to English text (Translation/Transliteration).
    For Hackathon demo purposes, this is a simplified wrapper.
    """
    if lang_code == "english_hinglish":
        return text # Already in Latin script
    
    if lang_code == "hindi":
        # Placeholder for actual translation logic
        # In a real deployment, integrate Google Translate API or similar here.
        # For now, we return a mock translation for specific demo cases.
        
        # MOCK LOGIC for DEMO:
        if "बुखार" in text:
            return "fever"
        if "दर्द" in text:
            return "pain"
        
        return text 

    return text