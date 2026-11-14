async function callGemini(prompt, schema) {
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const generationConfig = { responseMimeType: "application/json" };
  if (schema) {
    generationConfig.responseSchema = schema;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig
    })
  });

  if (!response.ok) {
    throw new Error("Gemini request failed with status " + response.status);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  return JSON.parse(text);
}

async function askGemini(prompt, schema) {
  try {
    return await callGemini(prompt, schema);
  } catch (firstError) {
    return await callGemini(prompt, schema);
  }
}

module.exports = { askGemini };
