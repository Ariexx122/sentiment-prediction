# 🎬 CineRead — Sentiment Analyzer

**Live Interface:**  
https://sentimentpredict.netlify.app

This project is a full-stack Machine Learning application that predicts the sentiment of movie reviews. It features a **TF-IDF + Logistic Regression** model served via a **FastAPI** backend, containerized with **Docker**, deployed on **Azure**, and paired with a responsive web frontend.

---

## Project Overview

This project analyzes the text of a movie review and classifies it as positive or negative, returning the probability for each class.

A key focus of this project was building a rigorous and reproducible ML pipeline, achieved by:

- Evaluating multiple modeling approaches: baseline TF-IDF, feature-enriched TF-IDF, and BERT embeddings as a frozen feature extractor
- Applying systematic preprocessing: URL/HTML removal, deduplication, and text normalization
- Selecting the deployment model based on performance **and** computational cost

---

## Modeling Approach

Three experimental configurations were evaluated:

| Configuration | F1 (Test) | ROC AUC | Notes |
|---|---|---|---|
| TF-IDF Baseline | 0.90 | 0.96 | Selected for deployment |
| TF-IDF + Structured Features | 0.91 | 0.97 | Marginal gain, higher complexity |
| BERT (Frozen Feature Extractor) | 0.88 | 0.95 | Better generalization, no fine-tuning |

**Final model:** Logistic Regression on TF-IDF (unigrams + bigrams, no lemmatization)

### Key decisions:
- **MultinomialNB excluded from BERT and extended experiments**, the model assumes non-negative count features, which BERT embeddings and StandardScaler outputs violate
- **Lemmatization dropped**, no significant performance improvement over cleaned text
- **BERT used as frozen extractor, not fine-tuned**, valid approach for a portfolio context; fine-tuning would require significantly higher compute
- **Baseline selected for deployment**, 0.01 F1 difference over the extended model does not justify the added preprocessing overhead at inference time

---

## Business Impact

This system can be applied to:
- Automated review moderation pipelines
- Content recommendation systems
- Brand monitoring and customer feedback analysis

---

## 🛠️ Tech Stack

- **Modeling:** Python, Scikit-learn, Pandas, BERT (HuggingFace Transformers)
- **API:** FastAPI, Uvicorn
- **Containerization:** Docker
- **Frontend:** HTML5, CSS3, JavaScript
- **Deployment:** Azure App Service (Backend) + Netlify (Frontend)

---

## 📂 Repository Structure

- **`/api`** → FastAPI backend, trained model, vectorizer, Dockerfile, and requirements
- **`/docs`** → Frontend (HTML, CSS, JS) deployed with Netlify
- **`/notebooks`** → EDA and model development

---

## 🛠️ Features

- **Real-time prediction** via frontend → Azure API communication
- **Dual probability display** — positive and negative confidence shown as animated bars
- **Docker containerization** for reproducible and portable deployment
- **Cold-start handling** for free-tier backend deployment
- **Clear separation** between ML, API, and frontend layers

---

## 💻 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Ariexx122/sentiment-prediction.git
cd sentiment-prediction
```

### 2. Build and run with Docker
```bash
cd api
docker build -t sentiment-api .
docker run -p 8000:8000 sentiment-api
```

### 3. Or run without Docker
```bash
pip install -r api/requirements.txt
uvicorn api.main:app --reload
```

### 4. Open the interface
Open **`docs/index.html`** in your browser or visit the live site.
