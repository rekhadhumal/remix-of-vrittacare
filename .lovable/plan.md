# Credit 1 — VRITTACARE auth foundation

Establish VRITTACARE as the app-facing identity and substantially redesign the existing sign-in/sign-up experience without changing dashboard screens, account behavior, saved data, or prediction services.

## Brand foundation

- Replace MindBalance with **VRITTACARE** and the tagline **Student's Mental Wellness Companion** on the authentication screen and in browser/share metadata.
- Use a distinctive abstract wellness mark built from flowing rings and a central spark; no creator name, compass, or V/R monogram.
- Keep the existing midnight/navy design system, strengthening cyan/teal as the primary light and using violet only for subtle depth.

## Full-screen authentication experience

- Replace the split screen with one full-viewport cinematic scene using the existing inclusive student landscape as a continuous background.
- Layer controlled navy atmosphere, a fine texture, soft cyan light, and slow depth motion while respecting reduced-motion settings.
- Place a refined glass sign-in card toward the right on desktop, with a complementary welcome statement integrated directly into the scene rather than another card.
- Recompose the mobile view so the brand, message, and form remain readable and visually balanced without hiding essential context.

## Form treatment

- Preserve current email/password sign-in, account creation, confirmation message, Google sign-in, session redirect, and error handling.
- Restyle inputs, primary action, divider, Google action, and account-mode switch as a cohesive premium control set with clear focus, loading, and disabled states.
- Add familiar field/action icons and a password visibility control; use the existing shared button component for actions.

## Scope and verification

- Update only authentication presentation and global browser-facing brand text; leave the dashboard composition and backend/API code untouched.
- Verify the auth page at desktop and mobile sizes, confirm form mode switching and password control, check browser metadata, and confirm the app compiles cleanly.

## Technical details

- Reuse the existing authentication calls and inclusive generated asset.
- Add any auth-specific visual tokens and animations to the current global theme, using semantic colors and reduced-motion fallbacks.
- Preserve TanStack route structure and existing protected-route behavior.
