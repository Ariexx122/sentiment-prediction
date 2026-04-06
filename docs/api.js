const API_URL =
  "https://sentimentapi-gmejc2b5dbdffpgn.canadacentral-01.azurewebsites.net/predict-sentiment/";

const input = document.getElementById("reviewInput");
const btn = document.getElementById("analyzeBtn");
const charCount = document.getElementById("charCount");

["input", "paste"].forEach((evt) =>
  input.addEventListener(evt, () => {
    const len = input.value.length;
    charCount.textContent = len;
    btn.disabled = len < 10;
  }),
);

async function analyze() {
  const review = input.value.trim();
  if (!review) return;

  // Reset UI
  document.getElementById("result").classList.remove("visible");
  document.getElementById("error").classList.remove("visible");
  document.getElementById("loading").classList.add("visible");
  btn.disabled = true;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    showResult(data);
  } catch (err) {
    showError(err.message);
  } finally {
    document.getElementById("loading").classList.remove("visible");
    btn.disabled = false;
  }
}

function showResult(data) {
  const isPos = data.sentiment === "positive";
  const posPct = Math.round(data.positive_prob * 100);
  const negPct = Math.round(data.negative_prob * 100);
  const confidence = Math.max(posPct, negPct);

  document.getElementById("verdictText").textContent = isPos
    ? "Positive"
    : "Negative";
  document.getElementById("verdictText").className =
    `verdict ${isPos ? "positive" : "negative"}`;
  document.getElementById("verdictIcon").textContent = isPos ? "★" : "✕";

  document.getElementById("posLabel").textContent = `${posPct}%`;
  document.getElementById("negLabel").textContent = `${negPct}%`;

  document.getElementById("resultFooter").textContent =
    `Model confidence: ${confidence}% · TF-IDF + Logistic Regression · Deployed on Azure`;

  document.getElementById("result").classList.add("visible");

  // Animate bars after render
  setTimeout(() => {
    document.getElementById("posBar").style.width = `${posPct}%`;
    document.getElementById("negBar").style.width = `${negPct}%`;
  }, 50);
}

function showError(msg) {
  const el = document.getElementById("error");
  el.textContent = `Error: ${msg}. The API may be waking up — try again in a few seconds.`;
  el.classList.add("visible");
}

// Allow Ctrl+Enter to submit
input.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") analyze();
});
