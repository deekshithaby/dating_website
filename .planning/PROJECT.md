# ShowUp

## What This Is

A dating web app (PWA) for BIT Bangalore students where compatibility is algorithmic and profiles stay hidden until both people physically show up to a real-world meetup. Women's profiles are sent to multiple compatible men simultaneously — the first guy to pay ₹99 locks the match. After payment, an AI-moderated chat opens for 1-2 days (blocking identity reveals), then the app assigns a curated campus venue. GPS verification at the meetup unlocks photo + name/nickname reveal.

## Core Value

Real-world accountability: you only see each other after you both physically show up. No catfishing, no ghosting — the product mechanic enforces genuine intent.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Phone OTP authentication (SMS-based signup/login)
- [ ] Personality & compatibility quiz (personality type, lifestyle, dating intent, boundaries)
- [ ] Photo upload (hidden until GPS verification)
- [ ] Algorithmic matching (age, proximity, intent alignment, quiz similarity)
- [ ] Gendered matching mechanic (women's profiles sent to multiple compatible men)
- [ ] Per-match payment (₹99 via Razorpay, first to pay locks the match)
- [ ] AI-moderated chat (blocks names, phone numbers, social handles, identity reveals)
- [ ] Chat window (1-2 days between match payment and meetup)
- [ ] Curated venue selection (app picks from campus cafés/nearby spots)
- [ ] Meetup scheduling (date, time, countdown timer)
- [ ] Reminder notifications (24h, 1h, 15min before meetup)
- [ ] GPS verification (both users confirmed at venue location)
- [ ] Photo + name/nickname reveal (unlocked after GPS verification)
- [ ] Match voiding (no-show = no reveal)
- [ ] Free credit compensation (guy gets 1 free match if girl doesn't show)
- [ ] Landing page (bold, minimal hero with tagline + single CTA)

### Out of Scope

- Native mobile apps (iOS/Android) — web-first PWA, mobile apps later
- OAuth/social login — phone OTP sufficient for campus launch
- Video posts/stories — not core to matching mechanic
- Real-time video chat — high complexity, not needed for v1
- ID/selfie verification — trust-based for campus community, defer to v2
- Multi-city support — BIT Bangalore only for launch
- Subscription model — per-match payment is the core mechanic

## Context

- **Target audience:** BIT (Bangalore Institute of Technology) students only
- **Market:** India (Bangalore), campus-constrained launch
- **Platform:** Progressive Web App (browser-based)
- **Payment:** Razorpay integration, ₹99 per match
- **Matching model:** Gendered — women receive match requests, men compete to pay first
- **Chat moderation:** AI-powered filtering to prevent identity reveals before meetup
- **Venues:** App-curated list of campus cafés, nearby spots; users don't choose
- **Verification:** Phone OTP only, no college email verification — relies on word-of-mouth and campus community trust
- **Core USP:** Hidden profiles + GPS meetup verification eliminates catfishing and ghosting

## Constraints

- **Platform**: PWA (browser-based) — must work on mobile browsers with GPS access
- **Payment**: Razorpay only — Indian payment gateway for ₹99 per-match payments
- **Geography**: BIT Bangalore campus and nearby venues — geofenced matching
- **Privacy**: Photos and names must remain hidden until GPS verification confirms both users at venue
- **Moderation**: Chat must block identity-revealing information (names, numbers, handles) via AI filter

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| PWA over native apps | Faster to build, easy to share via links on campus | — Pending |
| Phone OTP over college email | Lower friction, trust-based campus community | — Pending |
| Razorpay at ₹99/match | Indian market, per-match revenue model, creates commitment | — Pending |
| Gendered matching (women receive, men pay) | Creates urgency, reduces passive behavior | — Pending |
| AI chat moderation over manual review | Scalable, real-time blocking of identity reveals | — Pending |
| App-curated venues over user choice | Simpler UX, ensures safe/known locations on campus | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-21 after initialization*
