# MindBalance — full app build

Turn the current single-screen mockup into a real, signed-in product with six pages, saved
assessments, a grounded AI assistant, and a clean hand-off point for your Random Forest model.

## 1. Accounts

- Sign up / sign in with email + password, plus one-tap Google sign-in.
- Session stays after refresh; the dashboard and all inner pages require sign-in.
- A public welcome/sign-in page; everything else is protected.
- Sign-out from the top bar avatar.

## 2. Saved data

Four private tables, each locked so a person can only ever see their own rows:

- **profiles** — display name, avatar, created date (auto-created on first sign-in).
- **assessments** — the 12 answers: Age, Gender, Country, Academic Level, Most Used Platform,
  Purpose Of Use, Avg Daily Usage Hours, Daily Unlocks, Study Hours, Physical Activity Hours,
  Sleep Hours Per Night, Stress Level (Low / Medium / High / Very High).
- **prediction_results** — score returned by your model, status label, factor importances,
  insights, and the raw model response, linked to the assessment it came from.
- **chat_messages** — one ongoing conversation per person.

## 3. Pages

Left sidebar exactly as in the reference, linking to:

- **Home** — the reference dashboard: hero banner, score gauge, wellness radar with 3D view,
  lifestyle cards, key factors bars, insights, Remember banner. Reads the latest saved result.
  With no assessment yet, shows a welcome state inviting the first assessment.
- **Take Assessment** — a friendly multi-step form for the 12 inputs, validated, saved, then
  sent for prediction and routed to results.
- **My Results** — latest result plus full history with a trend chart and comparison.
- **Insights & Tips** — personalised guidance derived from the saved result.
- **Chat with Assistant** — full-page version of the right-hand panel, one ongoing saved chat.
- **About Project** — model, pipeline and data description.

The assistant panel stays docked on the right of Home, as in the image.

## 4. Your Random Forest model — the integration boundary

No JavaScript stand-in, no invented numbers. The app calls out to your Python service:

- A backend prediction endpoint in the app takes the 12 raw inputs, verifies the signed-in
  user, forwards them to your Python service, and stores the returned score and feature
  importances.
- Two settings you provide later: the service address and an access key. Until they are set,
  the app shows a clear "prediction service not connected" state instead of a fake score.
- `PREDICTION_API.md` at the project root documents the exact contract your FastAPI service
  must implement, including the request/response shape, the Stress_Level ordering, the
  Rare_Country rule, and a ready-to-run `main.py` skeleton that loads
  `Models/preprocessor.pkl` and `Models/final_random_forest.pkl` and returns the score plus
  feature importances.

**What you need to do:** deploy that small Python service (Render/Railway/Fly/HuggingFace all
work) with your two `.pkl` files, then give me its URL and key and I will connect it. The
`.pkl` files cannot run inside this app itself — it has no Python runtime.

## 5. AI assistant

Grounded in the signed-in person's own saved data — latest score, the 12 inputs, factor
importances, insights, and previous assessments — so it can answer "Why this score?",
"What should I improve?" and "Compare my latest result with my previous one". Quick-action
chips as in the reference; the conversation is saved and continues across visits.

## 6. Polish

Glowing animated score ring, hover lift on cards, animated bar fills, radar draw-in
transition, and an interactive rotating 3D wellness view in a modal.

## Technical notes

- TanStack Start routes; protected pages under `_authenticated`, shared sidebar layout.
- Prediction call and chat both run as server functions with `requireSupabaseAuth`; the model
  URL and key stay server-side secrets.
- Assistant uses the Lovable AI gateway with the user's own data injected as context.
- All four tables get row-level security scoped to `auth.uid()` plus explicit grants.
