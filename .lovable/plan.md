# Use the real VRITTACARE prediction across authenticated pages

## Result handling

- Keep the existing Assessment form fields, FastAPI URL, and request payload unchanged.
- Correct the prediction response shape so `needs_attention`, `watch`, and `stable` remain arrays of real API-provided items.
- Save the submitted assessment together with the successful prediction in the existing browser session storage flow, while safely reading older saved results.

## Results page

- Show the real score and category from the latest prediction.
- Render every API-provided item under Needs Attention, Watch, and Stable, with honest empty states for empty arrays.
- Reuse the existing score gauge and assessment-based profile chart when the latest saved assessment is available; do not synthesize values.

## Home and Insights

- Make the Dashboard prefer the latest working FastAPI result for its score, category, charts, lifestyle values, and insight lists, while retaining the existing saved-account fallback where needed.
- Replace Dashboard-generated suggestion text with the real Needs Attention, Watch, and Stable items when a latest FastAPI result exists.
- Make Insights & Tips display the same three real response groups, showing the assessment prompt only when no result exists.

## Branding and scope

- Replace remaining visible and metadata references to MindBalance with VRITTACARE across existing routes and the shared navigation.
- Preserve the current visual design and do not change the database schema, Python service, model, request fields, or unrelated pages.

## Verification

- Run a TypeScript typecheck using the project toolchain.
- Verify Results, Dashboard, and Insights in the authenticated preview with a representative saved response containing arrays, including desktop and mobile layouts.
- Confirm no visible `MindBalance` text remains and the Assessment request payload is unchanged.
