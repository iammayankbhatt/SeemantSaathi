# 🏥 BioBERT-Health: AI Triage Assistant

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0-orange)
![Hugging Face](https://img.shields.io/badge/Model-BioBERT-yellow)
![Accuracy](https://img.shields.io/badge/Accuracy-94.5%25-green)

### 🚀 **Bridging the gap between rural healthcare and modern AI.**

---

## 💡 The Problem
In remote clinics and rural areas, internet access is often unstable, and privacy laws make it difficult to send patient data to cloud giants like OpenAI or Google. Doctors need tools that are **fast**, **private**, and **work offline**.

## 🛠 The Solution
**BioBERT-Health** is a specialized, lightweight AI model designed to classify patient symptoms into 24 common disease categories. 

Unlike massive LLMs (like ChatGPT) that require heavy cloud GPUs and constant internet, this model is:
* **Privacy-First:** Designed to run locally on a simple laptop or edge device.
* **Specialized:** Fine-tuned specifically on medical data, not general internet text.
* **Lightweight:** The entire brain of the model is just ~400 MB.

---

## 🧠 How It Works (The Tech Stack)

We didn't just wrap an API; we engineered a custom classifier using **Transfer Learning**.

### 1. The Core Brain: BioBERT
We utilized `monologg/biobert_v1.1_pubmed`, a version of Google's BERT architecture that was pre-trained on millions of biomedical research papers (PubMed). This gives it a deep understanding of medical terminology (like "lesions," "nausea," or "inflammation") right out of the box.

### 2. The Dataset
We trained the model on the **Symptom2Disease** dataset, consisting of **1,200 detailed symptom descriptions** covering 24 classes, including:
* **Infectious:** Malaria, Dengue, Typhoid
* **Dermatological:** Psoriasis, Impetigo, Acne, Fungal Infections
* **Gastroenterological:** Peptic Ulcer, Jaundice, GERD
* **Neurological/Other:** Migraine, Cervical Spondylosis



---

## 📊 Performance & Training

We trained this model on an NVIDIA T4 GPU. Here are the engineering stats:

| Metric | Value |
| :--- | :--- |
| **Final Test Accuracy** | **94.5%** |
| **F1-Score** | **0.95** |
| **Training Epochs** | 10 |
| **Batch Size** | 16 |
| **Optimizer** | AdamW (Learning Rate: 2e-5) |

*The validation loss stabilized at **0.80**, indicating the model generalizes well to new, unseen patient descriptions without overfitting.*

---


