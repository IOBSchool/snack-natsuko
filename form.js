// ▼ ここをデプロイ後のGAS Web App URLに差し替える
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxfkjC4Z2s4zkn64Je2_54wnn5INmN2_gF3MW5i6Dn6r70af_UR3jJWF1QwEZKnGgwn/exec";

const form = document.getElementById("applyForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    status.textContent = "必須項目をご確認ください。";
    status.className = "form-status err";
    return;
  }

  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  status.textContent = "送信中…";
  status.className = "form-status";

  const data = new FormData(form);
  const payload = {
    name: data.get("name"),
    email: data.get("email"),
    source: data.get("source") || "",
    message: data.get("message") || "",
    event: "snack-natsuko-2026-04-28",
    timestamp: new Date().toISOString(),
  };

  try {
    // GASのdoPostはCORSプリフライトを受けられないため no-cors で送信
    await fetch(GAS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    form.reset();
    window.location.href = "thanks.html";
    return;
  } catch (err) {
    status.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
    status.className = "form-status err";
  } finally {
    btn.disabled = false;
  }
});
