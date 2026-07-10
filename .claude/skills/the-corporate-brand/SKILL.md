---
name: the-corporate-brand
description: The Corporate's brand system — colours, type, and layout rules for the Supplier Sustainability Portal. Invoke for any UI or visual work on this project.
---

# The Corporate — Brand System

Corporate minimalism. Restraint over decoration. Precise, direct, composed, authoritative.

> Note: this file was reconstructed from the brand rules in CLAUDE.md and
> product-spec.md Section 10 because no standalone brand file was supplied to the
> repo. It is the single brand reference for this build. If the original
> the-corporate-brand file is later provided, replace this file with it.

## Colour tokens
| Token | Hex | Use |
|-------|-----|-----|
| Ink | `#000000` | Text, primary buttons, dark surfaces |
| Stone | `#B6B09F` | Borders (0.5px), muted text |
| Linen | `#EAE4D5` | Surface |
| Chalk | `#F2F2F2` | Page background, light text on Ink |
| White | `#FFFFFF` | Elevated surface |
| Acid Lime | `#C8F135` | Accent only |

**Surfaces** are Linen, Chalk, or White. **Text** is Ink. **Borders** are Stone at 0.5px.
Never use Tailwind gray defaults or any colour outside these tokens.

## Acid Lime rule
- Maximum **two** uses per page.
- Only ever placed against Ink `#000000`.
- Never on a light background.
- Never used as a default link/accent colour.

## Type
- **Playfair Display** — headlines (400 / 700).
- **DM Sans** — body (300), labels and emphasis (500).
- Imported from the Google Fonts CDN.

## Form and shape
- Square corners everywhere: `border-radius: 0`.
- No shadows. No gradients.
- Cards: 0.5px Stone border on Linen or White.
- Buttons: square, Ink or bordered; primary = Ink fill, Chalk text.
- Links: underline + Ink colour only. No blue links.
- Form fields, dropdowns, progress indicators, buttons all follow the same
  restraint: square corners, Ink text, Stone borders, no decorative colour.

## Voice
Short declarative sentences. Active voice. No exclamation points. No emoji.

## Error and empty states
Stay inside the palette. **No red** and no colour outside the brand tokens.
Signal validation and rejection with Ink text, Stone borders, and weight/underline —
never with colour. Empty states use muted Stone text on a brand surface.
