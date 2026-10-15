# Cidea Marketing – ChatGPT creative director review, Phase 3 draft 1

**Date:** 2026-10-16
**Source evidence:** `phase3/oversikt-sidemaler.png`, `README.md`, `DESIGN.md`, `SIDEPLAN.md`, `RETTIGHETER.md` (and Claude's delivery report).
**Decision:** KEEP selected C – Fremtidig håndverk. **PHASE 3 NOT APPROVED.** Proceed only with focused draft 2 to complete missing mobile/design system and fix content/visual issues. No code, merge, deploy, spend or new direction.

## Creative evaluation

The style is cohesive enough to pursue: substantial terracotta/navy/forest color masses, Outfit/DM Sans, rectilinear modules, concise conversion hierarchy and a comparatively consistent page family. But several sections remain too repetitive/templated: near-identical hero blocks, generic rectangular card grids, excessive whitespace and repetitive geometric decorations. The strongest ownable graphic language appears on `Tilnærming` with connected planes and one diagonal notched corner. This should be refined into a **single generative composition rule** applicable to heroes, cards, article art, icons, mobile, subtle CSS motion; do not simply paste the same image everywhere.

## Decisions within ChatGPT remit

1. **Motif:** Adopt connected rectangular color planes with **one unmistakable diagonal corner notch** (as on Tilnærming), consistently and with variations by page content. No unrelated circles on mobile, no generic separated rectangles that undermine identity. Artboard rule must be specified with simple SVG geometry, responsive composition and ≥2 nonidentical applications. User final visual sign-off still required.
2. **Norwegian H1, provisionally approved for concept:** “Nettsider og helhetlig markedsføring som utvikles over tid.” It communicates services and ongoing work without numeric claims; improve rhythm only with a demonstrably stronger alternative, not vague slogans.
3. **Primary CTA:** “Snakk med oss” → `/kontakt`. **Closing CTA heading** (all pages, desktop/mobile): “Klar for et overbevisende digitalt uttrykk?” Choose one supporting sentence that describes what happens after contact without invented service commitments.
4. **Secondary CTA:** Meaningful destinations: “Les om nettsider” → service page; “Se konseptet” → real, explicitly labeled concept; “Les artikkelen” → actual article. Replace vague “Metodikk”, “Se arkitektur”, “Kampanjeform” where they are used as actions.
5. **Unverifiable claims:** Delete “kompromissløs”, “lynraske”, “aldri stagnerer”, “Direkte dialog med fagpersonen som faktisk utfører arbeidet” and “Én fast kontaktperson” unless Cidea owner specifically verifies that as a service commitment. Don't replace with another unsupported promise. Use concrete process statements instead: “Vi avklarer behov, designer og utvikler nettsiden, og kan videreutvikle løsningen etter lansering” only if this is the intended actual offer; avoid asserting a guaranteed response time.
6. **Service labels:** Nettsider, Merkevarebygging, SEO, Digital markedsføring og sosiale medier. “Fire kjerneområder for helhetlig digital vekst” can be shortened to “Dette kan vi hjelpe deg med”; use **same approved heading across desktop/mobile**, not two different meanings.
7. **Concept content:** Do NOT invent client work, client industries, outcomes, portfolios or clients; “industri og rådgivning” should be removed unless tied to a genuine documented concept. Produce a small number of **genuine internally created concept studies**, labeled “Konsept – ikke kundeprosjekt”, with truthful scope and actual graphical work. Do not imply a completed client project where only a concept card exists.
8. **Insights/blog:** Article titles and excerpts must match real existing files `blog/*.md`. No generated synopsis that overstates/rephrases the articles into false claims. Article layout must be readable.
9. **Navigation/URLs:** Approve Norwegian *information architecture* as working target: `/nettsider`, `/merkevarebygging`, `/seo`, `/digital-markedsforing`, `/konsepter`, `/tilnaerming`, `/innsikt`, `/kontakt`, `/personvern`. Do NOT yet approve redirects as technically safe; audit existing route/indexing and install 301 redirects, canonical and sitemap in implementation/SEO phases, preserving `/blog/{slug}` legacy traffic.
10. **Contrast and fonts:** Require accessible dyp terrakotta `#AD2C07` with white for small-text buttons; reserve `#D84A26` for non-small text and decorative planes. The Stitch screenshots currently show insufficient contrast in places: revise visual comps if needed, not only code. Outfit/DM Sans; Nettsider desktop missing these due to Stitch bug: mark as a design fidelity exception, supply an accurate corrected screenshot using design tokens or a safe source layout. Do not waste credits repeatedly on a broken upstream correction.
11. **Approach page:** Replace white bordered boxes with purposeful modular color-plane/list composition consistent with chosen identity. Be sparing with borders and boxes, avoid repetitive marketing blocks.
12. **Contact:** No fake email, phone, address, reviews, team members or response-time promise. Privacy/consent wording must reflect actual data collection and real recipient when implemented.

## Mandatory Phase 3 Draft 2 deliverables

- Complete **mobile mockups** for Konsepter, Tilnærming and Innsikt.
- Complete page-specific content design for the service subtypes Merkevarebygging, SEO and Digital markedsføring, using one shared responsive template and different genuine offer descriptions (no need to waste 3× credits if variant documentation and responsive examples demonstrate consistency).
- Create design layouts for one **real detailed concept**, privacy page and accessible 404. A concept detail must have an actual content plan and honest presentation, not filler.
- Fix typography mismatch on Nettsider desktop by documenting the precise corrected design and how React will render it; if necessary produce a React/CSS visual proof later, but **do not implement site code in Phase 3**.
- Refine and document a systematic SVG motif with desktop/mobile variants, geometry rule and alternative uses. Keep it visually original and credible.
- Finalize `DESIGN.md`, `SIDEPLAN.md` and `RETTIGHETER.md` with approved design tokens and media/license checks, and produce a complete comparison board showing desktop/mobile of all **unique** layouts.
- Perform copy review on all UI screens in Norwegian; remove English labels, decorative numbers, false claims, repetitive phrasing and inconsistent CTA text.
- Document open **owner-only factual approvals** rather than making them up: verified company name/about facts, who responds to enquiries, contact recipient, logo/trademark permissions, and actual created concepts.
- **User acceptance gate:** all above documented + ChatGPT reviews actual exported screens + user explicitly signs off on the complete visual direction. Do not mark Phase 3 done before that.

## Cost and process controls

Current known starting point before Phase 3 was user-verified 44/400, but **Phase 3 usage is NOT verified**: user must read exact Stitch credits. Do not assume ~50 until account shows it. Continue zero NOK new spending, no paid image/video, do not parallel edit_screens on same Stitch project (previous mis-routing), preserve extra accidental screens and never delete without explicit approval.

## Status after this review

PHASE 3: DRAFT 1 REVIEWED; **NOT APPROVED**. Draft 2 authorized as *recommendation* pending user confirmation of daily credit availability and full brief. No frontend coding, production changes, merge, deploy, URL redirect execution.
