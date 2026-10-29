# InjectCheck — Free Browser-Based Prompt Injection Tester for Small Businesses

InjectCheck is a client-side prompt injection security audit suite built for small businesses and student developers. It tests an LLM's system prompt or live API endpoint against 24 deterministic prompt injection and leakage attack vectors.

## Key Features
- **100% In-Browser Execution**: Zero backend server, zero analytics, zero external fonts.
- **Privacy First**: API keys reside solely in browser memory and are never persisted to disk or localStorage.
- **Deterministic Evaluation**: Pure rule-based checks (canary tokens, shingle analysis, marker matching) with no subjective AI judge.
- **Full Hindi & English Localization**: All prompts, explanations, reports, and hardening fixes switch instantly between English and Hindi.
- **Direct AI Integrations**: Built-in adapters for Google Gemini and OpenAI-compatible endpoints (`/chat/completions`), plus an offline demo simulator.
- **OWASP LLM Top 10 Aligned**: Covers LLM01 (Prompt Injection) and LLM07 (System Prompt Leakage).

---

## 1. How to Run Locally and Deploy Free

### Option A: Local Run (No server needed)
Because InjectCheck uses standard ES2019 JavaScript without ES modules or build tools:
1. Clone or download this folder.
2. Double-click `index.html` to open it directly in Google Chrome, Firefox, Safari, or Microsoft Edge (`file://` protocol).
3. The Demo Simulator runs fully offline with zero setup.

### Option B: Deploy Free to Netlify / Vercel / GitHub Pages
1. Push this directory to a GitHub repository.
2. **GitHub Pages**: Go to `Settings > Pages > Branch: main > Save`.
3. **Netlify**: Drag and drop the folder into Netlify Drop, or connect your repository. Build command: *(leave blank)*; Publish directory: `.`.
4. **Vercel**: Run `vercel` or import the Git repo as an "Other" project with no build commands.

---

## 2. 10-Step Manual Test Plan (Including Live Gemini Run)

1. **Evaluator Self-Test**:
   - Open `index.html?selftest=1` in your browser.
   - Verify that the self-test results table appears and all 12 unit tests show `PASSED`.

2. **Offline Vulnerable Bot Audit**:
   - On Step 1 (Connect), select **Demo Simulator** and choose **Vulnerable Demo Bot**.
   - Click **Next: Your Bot**. Click **Sample Shop Prompt (English)**.
   - Observe that the **Run Security Audit** button is disabled until you tick the ownership consent checkbox.
   - Tick the checkbox and click **Run Security Audit**.
   - Verify the progress bar advances with 3 concurrent workers.
   - Expected result: Score ~20-35% (**High Risk**), with ~16-18 failed tests.

3. **Offline Hardened Bot Audit**:
   - Go back to Step 1 and select **Hardened Demo Bot**.
   - Run the audit.
   - Expected result: Score ~85-95% (**Low Risk**), with most tests passing.

4. **Hindi Language Localization**:
   - Click the language toggle button in the top navigation bar (`हिन्दी`).
   - Verify that all headings, test titles, wizard steps, and report tables switch to natural Devanagari Hindi without reloading the page.
   - Click again to switch back to English.

5. **Theme Switching**:
   - Click the sun/moon button in the top navigation bar.
   - Verify the theme switches smoothly between light and dark modes, and that all text retains high WCAG AA contrast.

6. **Quick vs. Full Test Scope**:
   - In Step 2, select **Quick Run (12 tests)**. Run the audit and ensure exactly 12 tests execute.
   - Switch to **Full Audit (24 tests)**. Run the audit and ensure all 24 tests execute.

7. **Audit Cancellation**:
   - Start a 24-test audit on Demo Simulator.
   - Click the red **Cancel Audit** button midway.
   - Verify that all remaining tests halt immediately and you are safely returned to the prompt configuration screen.

8. **Live Google Gemini Testing**:
   - Obtain a free API key from Google AI Studio.
   - In Step 1, select **Google Gemini**. Paste your key. Model defaults to `gemini-1.5-flash`.
   - In Step 2, load the **Sample Shop Prompt**. Tick the consent checkbox and click **Run Security Audit**.
   - Observe live replies returning directly from Google's endpoint.
   - Verify that the API key does not appear in console logs, localStorage, or network calls other than `googleapis.com`.

9. **Auto-Apply Hardening & Delta Comparison**:
   - In Step 4 (Report) of a failed run, scroll down to the **How to Fix** section.
   - Click **Add Fixes to My Prompt & Re-Test**.
   - Verify that defensive instructions are appended to the system prompt in Step 2.
   - Run the audit again.
   - Verify that the **Score Improved** delta banner appears showing positive point improvement (e.g. `+30 points`).

10. **Report Exporting**:
    - Click **Download JSON** and ensure a valid `.json` payload downloads.
    - Click **Copy Summary** and verify clipboard contents.
    - Click **Print / Save PDF** and confirm that print styles hide navigation bars, buttons, and render a clean, black-and-white page.

---

## 3. Known Limitations

- **Browser CORS Constraints**: Connecting to private local LLM endpoints (e.g., custom Ollama setups) requires the endpoint to send `Access-Control-Allow-Origin: *` headers.
- **Fixed Attack Suite**: The tool evaluates 24 fixed attack templates. While these represent common prompt injection techniques, they do not guarantee safety against multi-turn jailbreaks or novel obfuscation techniques.
- **API Rate Limits**: Running 24 tests consecutively against free-tier API endpoints may trigger HTTP 429 rate limits. InjectCheck includes exponential backoff, but users on strict free quotas should use **Quick Run (12 tests)**.
```

---

### Verification and Operational Checks
- **No Build Tools Required**: Double-clicking `index.html` loads all scripts locally via standard `<script>` tags.
- **Strict Privacy**: API keys stay in the closure state of `app.js` and are never saved to `localStorage` (only `injectcheck_lang` and `injectcheck_theme` use `localStorage`).
- **Safety**: The application only sends benign canary and injection audit probes to endpoints provided and owned by the user.