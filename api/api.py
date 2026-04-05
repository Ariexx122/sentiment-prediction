import joblib
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


logreg_model = joblib.load("sentiment_model.pkl")
tfidf_vectorizer = joblib.load("tfidf_vectorizer.pkl")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)


def clean_text(text: str) -> str:
    text = re.sub(r"[^a-zA-Z']", " ", text)
    text = text.lower()
    return " ".join(text.split())


class ReviewRequest(BaseModel):
    review: str


@app.post("/predict-sentiment/")
def predict_sentiment(request: ReviewRequest):
    cleaned = clean_text(request.review)
    tfidf = tfidf_vectorizer.transform([cleaned])
    prediction = logreg_model.predict(tfidf)
    probability = logreg_model.predict_proba(tfidf)[0][1]

    return {
        "sentiment": "positive" if prediction[0] == 1 else "negative",
        "probability": round(float(probability), 3)
    }
