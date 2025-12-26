import re

def detect_language(text):
    """
    Simple heuristic to detect if text contains Devanagari script (Hindi) 
    or Latin script (English/Hinglish).
    """
    # Range for Devanagari unicode characters
    hindi_pattern = re.compile(r'[\u0900-\u097F]+')
    
    if hindi_pattern.search(text):
        return "hindi"
    else:
        # Default to English/Hinglish for Latin script
        return "english_hinglish"

if __name__ == "__main__":
    print(detect_language("Mujhe bukhar hai")) # english_hinglish
    print(detect_language("मुझे बुखार है"))     # hindi