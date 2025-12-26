# Language Normalization & Input Preprocessing Layer
## 🏥 The Heart of the System
In rural healthcare, patients don't describe their pain in perfect medical terminology. They speak from the heart, often using Hindi, Hinglish, regional dialects, or informal English.

This layer is the bridge between the patient and the AI. Its job is to listen to the user—regardless of how they speak—and translate their concerns into the structured, clean English keywords that our diagnostic model requires. It ensures that language barriers don't stand in the way of accurate healthcare.

## 🎯 Why This Exists
Even the most advanced AI models fail if the input is messy. This module is built for real-world resilience.

Instead of forcing users to adapt to the machine, we adapt the machine to the user. We handle:

Multilingual inputs (switching between languages mid-sentence).

** informal phrasing** ("My head feels heavy" vs. "Headache").

Noise reduction (filtering out polite greetings or filler words to focus on symptoms).

## ⚙️ Core Responsibilities
**1. Language Detection & Translation**
We don't assume the user speaks English. The system actively detects:

Hindi (Devanagari script)

Hinglish (Hindi words in Latin script)

Regional dialects

English It then standardizes everything into a common English baseline.

**2. Intelligent Text Cleaning**
Real conversation is messy. We strip away the noise—stopwords, filler words, and irrelevant phrases—and correct spelling errors caused by phonetic typing.

**3. Medical Concept Mapping**
This is the critical step. We map colloquial descriptions to standardized medical tags.

User says: "Sir dard" or "splitting head"

System reads: "Headache"

**4. Data Normalization**
We standardize metrics for consistency.

Example: “101 bukhar” becomes “fever 101 F”

## 🛠️ Tech Stack
We utilize robust NLP libraries to handle the complexity of Indic languages:

**Python**: The core logic implementation.

**NLTK / spaCy**: Used for tokenization, lemmatization, and removing stopwords.

**Indic NLP / Transliteration Libraries**: The engine for handling Hindi, Hinglish, and regional scripts.

**Regex**: Precise pattern matching for text cleaning and unit normalization.

**Custom Dictionaries**: A specialized map connecting slang/colloquialisms to medical keywords.

## ⚡ Workflow Example
Here is how the layer transforms a raw patient query into model-ready data:

**User Input**: "Mujhe 2 din se bukhar hai, headache bhi ho raha hai."

⬇️ **Preprocessing Magic** ⬇️

**Preprocessing Output**: fever, headache, duration: 2 days

⬇️ **Final Model Input** ⬇️

["fever", "headache", "2 days"]

## 📂 Project Structure
```

/preprocessing 
├── normalize.py        # Main normalization pipeline 
├── language_detect.py  # Detects Hindi/Hinglish/English 
├── transliterate.py    # Converts Hindi/Hinglish → English 
├── clean_text.py       # Removes noise, stopwords, informal words 
├── keyword_map.json    # The dictionary mapping colloquial → medical terms 
└── README.md           # Documentation

```
## 🚀 Future Roadmap
We are constantly working to make this layer more inclusive:

Expanding Language Support: Adding more regional Indian languages.

Voice Integration: Preprocessing specifically for Voice-to-Text inputs.

Dataset Integration: Linking with government health datasets for more accurate terminology mapping.

## 🤝 Contribution & Impact
This layer was designed with a single goal: Equity.

By strictly focusing on language normalization, we ensure that a user in a remote village describing symptoms in Hinglish gets the same quality of AI diagnosis as someone typing in perfect medical English. It is the first step in making our AI truly accessible.