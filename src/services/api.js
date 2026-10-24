const baseUrl = (import.meta.env.VITE_RENDER_API_URL || "").replace(/\/$/, "");

async function request(path, options = {}) {
  if (!baseUrl) return { skipped: true };
  const response = await fetch(baseUrl + path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "Backend request failed with status " + response.status);
  }
  return response.status === 204 ? null : response.json().catch(() => null);
}

export function submitQuoteToApi(quote) {
  return request("/quotes", { method: "POST", body: JSON.stringify(quote) });
}
