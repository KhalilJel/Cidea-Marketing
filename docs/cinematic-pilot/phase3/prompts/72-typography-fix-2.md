Typography-only fix on these two screens. Change NOTHING else (layout, colours, copy, images stay exactly as they are).
Add a global style rule to each screen exactly like this, so every element uses the design-system typefaces:
h1, h2, h3, h4, h5, h6 { font-family: "Outfit", sans-serif !important; }
body, p, a, span, li, button, input, textarea, label { font-family: "DM Sans", sans-serif; }
and make sure both Outfit and DM Sans are loaded. Headings in Outfit, all body text, labels and buttons in DM Sans. No element may fall back to a system font.
