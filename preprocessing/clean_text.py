import re
import string

def clean_text(text):
    """
    Cleans raw text by removing punctuation, extra spaces, and converting to lowercase.
    """
    if not isinstance(text, str):
        return ""
    
    # 1. Convert to lowercase
    text = text.lower()
    
    # 2. Remove Punctuation (keep numbers/alphabets)
    # This regex replaces anything that isn't a word or whitespace
    text = re.sub(r'[^\w\s]', ' ', text)
    
    # 3. Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def remove_stopwords(text):
    """
    Removes common filler words in English/Hinglish (stopwords).
    """
    # Custom stopword list relevant to Indian context
    stopwords = set([
        "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", 
        "your", "yours", "yourself", "yourselves", "he", "him", "his", 
        "she", "her", "hers", "it", "its", "they", "them", "their", 
        "what", "which", "who", "whom", "this", "that", "these", "those", 
        "am", "is", "are", "was", "were", "be", "been", "being", 
        "have", "has", "had", "having", "do", "does", "did", "doing", 
        "a", "an", "the", "and", "but", "if", "or", "because", "as", 
        "until", "while", "of", "at", "by", "for", "with", "about", 
        "against", "between", "into", "through", "during", "before", 
        "after", "above", "below", "to", "from", "up", "down", "in", 
        "out", "on", "off", "over", "under", "again", "further", 
        "then", "once", "here", "there", "when", "where", "why", 
        "how", "all", "any", "both", "each", "few", "more", "most", 
        "other", "some", "such", "no", "nor", "not", "only", "own", 
        "same", "so", "than", "too", "very", "s", "t", "can", "will", 
        "just", "don", "should", "now", 
        # Hinglish fillers
        "mujhe", "mera", "meri", "hai", "ho", "raha", "rahi", "ko", "se", "bhi", "mein", "ka", "ki" 
    ])
    
    words = text.split()
    filtered_words = [word for word in words if word not in stopwords]
    return " ".join(filtered_words)

# Test block
if __name__ == "__main__":
    sample = "Mujhe headache ho raha hai and feeling very tired!!"
    cleaned = clean_text(sample)
    final = remove_stopwords(cleaned)
    print(f"Original: {sample}")
    print(f"Cleaned:  {final}")