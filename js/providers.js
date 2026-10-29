// Provider Adapter Pattern: Uniform interface for AI inference endpoints
// send(systemPrompt, userMessage, settings, signal) -> Promise<string>
const Providers = {
  // 1. Offline Demo Adapter
  demo: {
    async send(systemPrompt, userMessage, settings, signal) {
      await new Promise(r => setTimeout(r, 200 + Math.random() * 250)); // simulate brief latency
      if (signal && signal.aborted) throw new DOMException("Aborted", "AbortError");

      const canary = settings.canary;
      const marker = `INJECTED-OK-${settings.R}`;

      if (settings.demoBotType === "hardened") {
        return DemoSimulator.hardenedBot(userMessage, canary, marker);
      }
      return DemoSimulator.vulnerableBot(userMessage, canary, marker);
    }
  },

  // 2. Google Gemini REST Adapter (Direct browser call)
  gemini: {
    async send(systemPrompt, userMessage, settings, signal) {
      const model = encodeURIComponent(settings.geminiModel || "gemini-1.5-flash");
      const apiKey = settings.geminiKey;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        generationConfig: {
          temperature: settings.temperature ?? 0.3,
          maxOutputTokens: settings.maxTokens ?? 400
        }
      };

      const maxRetries = 3;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal
          });

          if (res.status === 429) {
            if (attempt === maxRetries) throw new Error("Rate limit reached. Try Quick run or wait 60s.");
            await new Promise(r => setTimeout(r, 1500 * Math.pow(2, attempt)));
            continue;
          }

          if (res.status === 401 || res.status === 403) {
            throw new Error("Gemini API key is invalid or lacks access permissions.");
          }

          if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`Gemini API Error (${res.status}): ${errBody.slice(0, 120)}`);
          }

          const data = await res.json();
          const candidate = data.candidates?.[0];
          const text = candidate?.content?.parts?.map(p => p.text).join("") || "";
          return text;
        } catch (err) {
          if (err.name === "AbortError") throw err;
          if (attempt === maxRetries) throw err;
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        }
      }
    }
  },

  // 3. OpenAI-Compatible REST Adapter (Supports Groq, Ollama, OpenAI, etc.)
  openai: {
    async send(systemPrompt, userMessage, settings, signal) {
      const baseUrl = (settings.openaiUrl || "https://api.openai.com/v1").replace(/\/+$/, "");
      const url = `${baseUrl}/chat/completions`;
      const apiKey = settings.openaiKey;

      const payload = {
        model: settings.openaiModel || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: settings.temperature ?? 0.3,
        max_tokens: settings.maxTokens ?? 400
      };

      const headers = { "Content-Type": "application/json" };
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error("OpenAI API key invalid or lacks model permissions.");
      }
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Provider API Error (${res.status}): ${errText.slice(0, 120)}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    }
  }
};