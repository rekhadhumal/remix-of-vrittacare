# Refine the VRITTACARE brand lockup

## What will change
- Refine the shared brain-and-leaf symbol to closely reproduce the reference composition and proportions as a crisp, symmetrical cyan-to-blue vector with integrated leaves and consistent strokes.
- Add reusable full and compact lockups so every placement uses the same geometry, uppercase weight, capitalization, spacing, proportions, and restrained glow shown by the reference.
- Use the full centered lockup with `VRITTACARE` and `Student's Mental Wellness Companion`, preserving the reference hierarchy and light subtitle treatment, on the sign-in and About introduction areas.
- Use the compact symbol plus `VRITTACARE` in the desktop sidebar and mobile navigation without changing navigation behavior.
- Create a small, padded favicon from the same symbol and replace the existing browser icon.

## What will stay unchanged
- Preserve the current dark teal, blue, and purple palette, existing imagery, page structure, and responsive layout.
- Do not alter authentication, assessment fields, prediction requests or results, FastAPI integration, database behavior, or ML logic.
- Treat the uploaded screenshot as visual guidance only; do not embed the screenshot in the app.

## Technical details
- Extend the existing shared `BrandMark` rather than introducing unrelated branding.
- Keep all visual colors tied to the existing semantic theme tokens.
- Update only the current brand placements and root favicon declaration.
- Verify type/build health and inspect sign-in, About, sidebar, and mobile navigation at desktop and mobile sizes.
