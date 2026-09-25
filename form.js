// ▼ ここをデプロイ後のGAS Web App URLに差し替える
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxfkjC4Z2s4zkn64Je2_54wnn5INmN2_gF3MW5i6Dn6r70af_UR3jJWF1QwEZKnGgwn/exec";

// 日程のvalue→表示ラベル対応（thanksページでの表示とsheet集計用）
const DATE_LABELS = {
  "2026-09-25": "第5夜｜2026年9月25日(金) 20:00〜21:00",
  "2026-10-30": "第6夜｜2026年10月30日(金) 20:00〜21:00",
};

const form = document.getElementById("applyForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dates = Array.from(form.querySelectorAll('input[name="dates"]:checked')).map((el) => el.value);

  if (!form.checkValidity()) {
    status.textContent = "必須項目をご確認ください。";
    status.className = "form-status err";
    return;
  }
  if (dates.length === 0) {
    status.textContent = "参加したい夜を1つ以上選んでください。";
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
    dates,
    timestamp: new Date().toISOString(),
  };

  try {
    // GASの302リダイレクトでPOST→GETに変換される対策として
    // URLSearchParamsで送り、GAS側はe.parameter.payloadで受ける
    const body = new URLSearchParams({ payload: JSON.stringify(payload) });
    await fetch(GAS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body,
    });
    // thanksページで選択した夜を表示するために保存
    sessionStorage.setItem("snackSelectedDates", JSON.stringify(dates.map((d) => DATE_LABELS[d] || d)));
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
