import torch
import joblib
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# --- CONFIGURATION ---
MODEL_PATH = "./biobert_disease_model"  # Path where you extracted the zip
ENCODER_PATH = "./label_encoder.pkl"    # Path to the saved label encoder
MAX_LEN = 128                           # Must match the training max_len

class DiseasePredictor:
    def __init__(self):
        """
        Initialize the predictor by loading the model, tokenizer, and label encoder.
        """
        print("Loading model and tokenizer...")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        try:
            # 1. Load Tokenizer & Model
            self.tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
            self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
            self.model.to(self.device)
            self.model.eval() # Set to evaluation mode
            
            # 2. Load Label Encoder (to convert Class 0 -> 'Acne')
            self.le = joblib.load(ENCODER_PATH)
            print("✅ Model loaded successfully.")
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            raise e

    def predict(self, text):
        """
        Takes a raw symptom string and returns the predicted disease and confidence score.
        """
        # 1. Preprocess Input (Tokenize)
        inputs = self.tokenizer(
            text,
            max_length=MAX_LEN,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )

        # Move inputs to the same device as model (CPU or GPU)
        input_ids = inputs["input_ids"].to(self.device)
        attention_mask = inputs["attention_mask"].to(self.device)

        # 2. Inference
        with torch.no_grad():
            outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
            logits = outputs.logits
        
        # 3. Post-processing (Logits -> Probabilities)
        probs = torch.nn.functional.softmax(logits, dim=1)
        conf, pred_idx = torch.max(probs, dim=1)
        
        # 4. Decode Label (Index -> Disease Name)
        predicted_class_index = pred_idx.item()
        predicted_disease = self.le.inverse_transform([predicted_class_index])[0]
        confidence_score = conf.item()

        return {
            "disease": predicted_disease,
            "confidence": round(confidence_score * 100, 2), # Percentage
            "status": "Success"
        }

# --- TEST BLOCK (Only runs if you run this file directly) ---
if __name__ == "__main__":
    # Initialize
    predictor = DiseasePredictor()
    
    # Test Cases
    test_symptoms = [
        "I have a skin rash and some blackheads on my face.",
        "shivering, vomiting and high fever", 
        "pain in neck and muscle weakness"
    ]
    
    print("\n--- Starting Diagnostics ---")
    for s in test_symptoms:
        result = predictor.predict(s)
        print(f"Input: '{s}'")
        print(f"Prediction: {result['disease']} (Confidence: {result['confidence']}%)")
        print("-" * 30)