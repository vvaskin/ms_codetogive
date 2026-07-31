# Agent guidance

Keep this file updated whenever project architecture, conventions, commands, or
workflows change.

## Architecture

### Styling standardisation

CSS Modules are the official component-styling approach.

- Use colocated `ComponentName.module.css` files with camel-cased selectors
  (for example `.homeHero`, `.storyStage`).
- Reserve global CSS for design tokens (`styles/tokens.css`), foundational
  element rules (`styles/base.css`), and temporarily retained legacy styles in
  `app/globals.css`.
- Do not add new globally named component classes. Prefer a CSS Module on the
  component that owns the markup.
- Reuse semantic tokens (`--color-brand-primary`, `--color-text-primary`,
  `--color-border`, `--color-focus`, and related names) instead of repeating
  brand colours or shared measurements. Legacy `--love-*` and
  `--header-height` aliases remain for compatibility.
- Keep page files focused on composition; extract repeated visual patterns into
  shared components with their own modules.
- Preserve responsive behavior, keyboard focus, reduced motion, and
  English / Traditional Chinese layouts.

Tailwind remains installed temporarily because removing its preflight could
alter rendering. Do not introduce new Tailwind utility classes. Evaluate
removing Tailwind during the rebrand when visual baselines are intentionally
changing.

Future rebrand work should migrate legacy global rules into colocated CSS
Modules one component or template family at a time. Delete a global selector
only after all usages are removed.

Homepage visual styles already live in `components/HomeExperience.module.css`
and must not be moved back into global CSS.
