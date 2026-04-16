# Design System: Tem no Mapa

## 1. Visual Theme & Atmosphere
A clean, community-focused web application with a data-driven yet warm interface. The atmosphere is functional and approachable — like a well-organized community hub. White primary surfaces with strategic green accents create a sense of Brazilian national pride without being overwhelming. Ample whitespace conveys openness and accessibility.

## 2. Color Palette & Roles
- **Canvas White** (#FFFFFF) — Primary background surface
- **Subtle Gray** (#F8F9FA) — Secondary backgrounds, section fills
- **Charcoal Ink** (#1A1A1A) — Primary text, headlines
- **Muted Gray** (#6B7280) — Secondary text, descriptions
- **Whisper Border** (#E5E7EB) — Card borders, dividers
- **Brazil Green** (#009C3B) — Primary accent, CTAs, active states, verification badges
- **Brazil Yellow** (#FFDF00) — Highlights, featured badges, ambassador seals

## 3. Typography Rules
- **Display/Headlines:** Manrope — Bold weights for headlines, clean geometric forms
- **Body:** Manrope — Regular weight, relaxed leading
- **Mono:** JetBrains Mono — For numbers, statistics, counts
- **Banned:** Inter for premium contexts, generic serif fonts

## 4. Component Stylings
- **Buttons:** Subtle border-radius (8px), clean flat design. Green fill for primary CTAs. White or transparent for secondary.
- **Cards:** White background, subtle border, generous padding (24px). Used for user profiles, location cards.
- **Badges:** Small rounded pills for verification status. Green background with white text for "Verificado", yellow for "Embaixador".
- **Map Markers:** Circular pins with state abbreviations (SP, RJ, MG) and user counts
- **Inputs:** Clean borders, focus ring in green. Label above, error below.

## 5. Layout Principles
- Centered content container (max-width: 1200px)
- Single column on mobile, multi-column grid on desktop
- Card-based layouts for user profiles and location data
- Map as primary visual element on main map screen

## 6. Motion & Interaction
- Subtle hover states on interactive elements
- Smooth transitions (200ms ease-out)
- Spring physics for button interactions

## 7. Anti-Patterns (Banned)
- No emojis
- No Inter font
- No pure black (#000000)
- No neon glows or gradients
- No excessive color usage — green as single accent only
- No AI-generated fake statistics
- No generic placeholder names
- No centered hero sections with overlapping elements