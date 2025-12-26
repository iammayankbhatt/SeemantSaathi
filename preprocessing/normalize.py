import json
import os
from .clean_text import clean_text, remove_stopwords
from .language_detect import detect_language
from .transliterate import transliterate_to_english

# Load Keyword Map
# We use os.path to ensure we find the JSON file relative to this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MAP_FILE = os.path.join(BASE_DIR, 'keyword_map.json')

try:
    with open(MAP_FILE, 'r') as f:
        KEYWORD_MAP = json.load(f)
except FileNotFoundError:
    print("⚠️ Warning: keyword_map.json not found. Using empty map.")
    KEYWORD_MAP = {}

def map_keywords(text):
    """
    Replaces colloquial terms with medical terms using the JSON dictionary.
    """
    words = text.split()
    new_words = []
    
    # Check for multi-word phrases first (e.g., "sir dard")
    # This is a simple implementation; efficient implementation uses n-grams
    i = 0
    while i < len(words):
        # Try to match 2-word phrase
        if i < len(words) - 1:
            phrase = f"{words[i]} {words[i+1]}"
            if phrase in KEYWORD_MAP:
                new_words.append(KEYWORD_MAP[phrase])
                i += 2
                continue
        
        # Try single word match
        word = words[i]
        if word in KEYWORD_MAP:
            new_words.append(KEYWORD_MAP[word])
        else:
            new_words.append(word)
        i += 1
        
    return " ".join(new_words)

def normalize_input(raw_input):
    """
    The Main Pipeline Function.
    1. Detect Language
    2. Transliterate/Translate if needed
    3. Clean Text (Lower, Remove Punctuation)
    4. Remove Stopwords
    5. Map Keywords (Hinglish -> Medical)
    """
    if not raw_input:
        return ""

    # Step 1: Detect Language
    lang = detect_language(raw_input)
    
    # Step 2: Handle Hindi Script
    text = transliterate_to_english(raw_input, lang)
    
    # Step 3: Basic Cleaning
    text = clean_text(text)
    
    # Step 4: Keyword Mapping (Do this BEFORE removing stopwords to catch phrases like 'sir dard')
    text = map_keywords(text)
    
    # Step 5: Remove Stopwords (Noise reduction)
    final_text = remove_stopwords(text)
    
    return final_text

# --- Testing the Pipeline ---
if __name__ == "__main__":
    print("--- Preprocessing Layer Test ---")
    
    test_cases = [
        "Mujhe 2 din se bukhar hai",
        "Sir dard kar raha hai bahut tez",
        "I have stomach ache and vomiting",
        "Mera head hurting since morning"
    ]
    
    for case in test_cases:
        result = normalize_input(case)
        print(f"\nInput:  '{case}'")
        print(f"Output: '{result}'") 
        # Expected Output -> "2 days fever", "headache fast", "stomach pain vomiting", "headache morning"