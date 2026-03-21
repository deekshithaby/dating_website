# Project Research Summary

**Project:** ShowUp - Dating PWA with GPS Verification
**Domain:** Campus dating app with hidden profiles, payment-gated matching, AI-moderated chat, GPS-verified meetups
**Researched:** 2026-03-21
**Confidence:** MEDIUM-HIGH

## Executive Summary

ShowUp is a notification-driven dating PWA for BIT Bangalore where algorithmic matching replaces swiping, photos remain hidden until both users physically arrive at a campus venue, and a Rs 99 payment filters for genuine intent. The recommended build approach is a Supabase-centric serverless architecture: Next.js 16 on Vercel for the frontend and API layer, Supabase Cloud for database (PostgreSQL + pgvector), authentication (phone OTP), real-time chat (Realtime Broadcast), and server-side logic (Edge Functions in Deno), with Cloudflare R2 for photo storage. This stack is well-documented, cost-effective (under $36/mo for MVP), and avoids premature infrastructure complexity for a single-campus launch of hundreds of users. A critical SMS finding: Zoho cannot be used for transactional SMS/OTP (marketing only) -- Fast2SMS at Rs 0.25/SMS with pre-registered DLT templates is the recommended provider, connected via Supabase's Send SMS Hook.

The product's critical path follows a strict dependency chain: Auth then Profile + Quiz then Matching Algorithm then SMS/Email Notifications to Men then Pay-to-Lock then AI-Moderated Chat then Meetup Scheduling then GPS Verification then Photo Reveal. Every phase builds on the previous one, and the core differentiators (hidden profiles, GPS verification, pay-to-lock) are architectural decisions rather than bolt-on features. The matching algorithm runs entirely in PostgreSQL using pgvector for cosine similarity on quiz responses, avoiding external ML services. Chat moderation uses Gemini 2.5 Flash-Lite in a single Edge Function call that handles both identity-reveal detection and toxicity filtering at $0.10/1M input tokens.

The top risks are: (1) GPS spoofing via browser DevTools undermining the core product mechanic -- mitigated by multi-signal verification (GPS + IP geolocation), temporal plausibility checks, and accepting that Rs 99 payment + campus social pressure are stronger deterrents than technical perfection; (2) Women's safety on a small campus -- mitigated by requiring women to approve matches before lock, minimizing pre-reveal profile data, and enforcing public venue-only meetups; (3) Cold start death spiral if the initial user pool is too small -- mitigated by batch launch events and a pre-registration gate at 150+ users with minimum 40% each gender. These are product-level risks, not purely technical ones, and they demand design decisions before code is written.

## Key Findings

### Recommended Stack

The stack is unified around Supabase as the backend platform, eliminating the need for a custom Node.js server, Redis, or separate WebSocket infrastructure. Supabase was chosen over Firebase because the relational data model (users, matches, payments, chat messages with joins) maps naturally to PostgreSQL, pricing is predictable ($25/mo Pro vs Firebase's pay-per-use surprises), and pgvector enables compatibility scoring without external ML services. Total MVP infrastructure cost: $9-36/month.

**Core technologies:**
- **Next.js 16 + TypeScript**: Full-stack React framework with SSR, API routes (Razorpay webhooks), Server Actions (R2 uploads), and zero-config Vercel deployment
- **Supabase Cloud**: PostgreSQL 15 + pgvector + pg_cron, Auth with phone OTP, Realtime Broadcast for chat, Edge Functions (Deno) for server-side logic -- single platform replaces 5+ separate services
- **Serwist 9.5**: PWA service worker library (successor to next-pwa), handles app shell caching, offline support, install prompts
- **Cloudflare R2**: Photo storage with 10GB free (10x Supabase Storage), zero egress, S3-compatible API via presigned URLs -- zero tech debt
- **Fast2SMS**: SMS OTP + match notifications at Rs 0.25/SMS, no DLT registration needed from developer, integrated via Supabase Send SMS Hook
- **Zoho ZeptoMail**: Transactional email for match alerts, 10K free emails (Zoho SMS is marketing-only, confirmed unsuitable for OTP)
- **Razorpay**: Payment processing for Rs 99/match, 0% MDR on UPI, Standard Checkout JS widget
- **Gemini 2.5 Flash-Lite**: AI chat moderation, $0.10/1M input tokens, handles both identity detection and toxicity in one call -- 33-50% cheaper than GPT-4o-mini
- **Zustand + TanStack Query**: Client state + server state management, lightweight and well-matched to the app's complexity
- **React Hook Form + Zod**: Form handling and schema validation for quiz, profile, payment flows

### Expected Features

**Must have (table stakes):**
- Phone OTP authentication -- standard in India, students will not create passwords
- Profile with hidden photo upload -- photos stored in R2, never exposed until GPS verification
- Compatibility quiz (10-15 questions) -- feeds matching algorithm, completion drops past 15
- Real-time text chat with time-gating (1-2 days) -- Supabase Realtime Broadcast
- Push/SMS/email notifications -- SMS as primary, email secondary, Web Push as enhancement only
- Block and report -- non-negotiable safety feature, one-tap block from chat
- Terms of service and privacy policy -- DPDPA 2023 legal requirement

**Should have (differentiators -- these ARE the product):**
- Hidden profiles until GPS meetup verification -- core USP, presigned URL enforcement mechanism
- GPS-verified meetup check-in -- Geolocation API + server-side Haversine, 50m radius
- Pay-to-lock match mechanic -- Rs 99 via Razorpay, race condition handled by PostgreSQL SELECT FOR UPDATE
- AI-moderated chat blocking identity reveals -- Gemini 2.5 Flash-Lite in Edge Function
- Notification-driven matching (no browsing/swiping) -- algorithmic push via SMS/email to men
- Time-gated chat window -- best defense against moderation bypass, forces meetup decision
- Curated venue assignment -- admin-managed safe public campus locations
- No-show voiding and free credit compensation -- fairness mechanic

**Defer to v2+:**
- Multi-campus expansion -- requires operational playbook, not just code
- ID/selfie verification -- campus community provides social verification for v1
- Native mobile apps -- only if PWA limitations block growth
- Group meetups, events integration, advanced AI matching
- Women's choice mechanic (letting women pick from compatible men vs first-to-pay)

### Architecture Approach

Supabase-centric serverless architecture with four clear layers: PWA Client (app shell + service worker + GPS collection), Next.js App Router on Vercel (SSR + API routes + Server Actions), Supabase Cloud (database + auth + realtime + edge functions), and External Services (Razorpay, Fast2SMS, ZeptoMail, Gemini, Cloudflare R2). No microservices, no custom backend server, no Redis. This matches the single-campus scale (hundreds of users) and avoids infrastructure complexity that provides no benefit at this size.

**Major components:**
1. **PWA Client** -- UI rendering via React + Tailwind (converted from Google Stitch HTML), Serwist service worker for caching, Zustand for client state, TanStack Query for server state
2. **Supabase PostgreSQL** -- Core data (users, matches, payments, messages, venues), pgvector for quiz-based compatibility scoring, pg_cron for scheduled reminders, RLS for row-level security
3. **Supabase Edge Functions (Deno)** -- Chat moderation (Gemini API), GPS verification (Haversine), match notifications (Fast2SMS + ZeptoMail), Razorpay order creation, Send SMS Hook for OTP
4. **Supabase Realtime Broadcast** -- Low-latency WebSocket chat between matched pairs, built-in auth integration, 200 free concurrent connections
5. **Cloudflare R2** -- Photo storage with presigned upload/download URLs; download URLs generated ONLY after GPS verification passes (this is the enforcement mechanism for hidden profiles)

**Data model centerpiece:** Match status state machine with 10 states: `pool -> candidates_notified -> payment_pending -> locked -> chat_active -> chat_closed -> meetup_pending -> gps_verified -> revealed` (or `no_show -> voided`). This state machine drives the entire user experience and must be implemented correctly in Phase 2.

### Critical Pitfalls

1. **GPS spoofing defeats core mechanic** -- Browser Geolocation API is trivially spoofable via DevTools or extensions. PWAs have zero access to mock location detection (unlike native Android). Mitigate with multi-signal verification (GPS + IP geolocation cross-reference via ipinfo.io), temporal plausibility (multiple pings showing natural drift over 5-10 minutes), and accept that Rs 99 payment + campus social pressure are the real deterrents. Plan native app for v2 where mock location detection is possible.

2. **Women's safety on a small campus** -- Men receive match notifications without women having veto power in the original design. On a 3,000-5,000 student campus, anonymity is thin. A single safety incident kills adoption via campus word-of-mouth. Mitigate by adding a woman's confirmation step before match locks, minimizing pre-reveal profile data (show only compatibility score, age, dating intent -- no department or year), enforcing public daytime venues only, and implementing block-with-teeth (permanent mutual exclusion).

3. **Payment fraud and chargebacks** -- Rs 500 chargeback fee on Rs 99 transaction = 5x revenue lost. College students may see chargebacks as "free matches." Mitigate with webhook-first confirmation (NEVER trust frontend Razorpay callback alone), raw body HMAC-SHA256 signature verification, idempotent webhook handlers (processed events table), evidence chain logging (payment -> match lock -> chat open -> GPS verify -> reveal), UPI-first strategy (lower chargeback rates + 0% MDR), and clear no-refund terms before payment.

4. **AI moderation bypass** -- Users will attempt romanized Hindi ("mera number hai nau aath"), dotted handles ("s.u.n.i.l.k"), indirect references ("find me on the gram, same as my first name plus 99"). Mitigate with single Gemini call handling both identity detection and toxicity, text-only chat (no image sharing eliminates handwritten-note bypass entirely), short chat window (1-2 days = less time to engineer bypasses), and user reporting. Accept imperfection: moderation needs to stop casual attempts, not determined adversaries.

5. **Cold start death spiral** -- 50 signups with 70/30 gender ratio (typical Indian engineering college) exhausts the pool in 2-3 weeks and the app feels "dead." Mitigate with batch campus launch event targeting 200+ day-one signups, pre-registration gate (activate matching only at 150+ users with min 40% each gender), controlled match cadence (drip-feed 1-2 matches/week), and cross-gender incentives (women = free access, men = first-match-free credit).

## Implications for Roadmap

Based on research, the suggested phase structure follows the strict dependency chain identified across all four research files:

### Phase 1: Foundation + Auth + Onboarding
**Rationale:** Everything depends on authenticated users with completed profiles. Auth is the root dependency. Photo upload to R2 establishes the hidden-profile enforcement mechanism from day one. The database schema must be designed for all downstream features (match state machine, payments, messages).
**Delivers:** Working PWA shell with service worker, landing page, phone OTP login, profile creation with photo upload to R2, compatibility quiz with quiz vector storage in pgvector, full database schema for all core entities, privacy policy and consent flows.
**Addresses features:** Phone OTP auth, profile creation, photo upload, compatibility quiz, landing page, terms/privacy policy, loading/waiting states.
**Avoids pitfalls:** SMS pumping (rate limiting + CAPTCHA + +91 only + daily budget cap), DLT compliance (Fast2SMS Service route), photo storage leak (randomized R2 keys + presigned URLs with short expiry), quiz fingerprinting (never expose raw answers).
**Stack focus:** Next.js + Serwist PWA setup, Supabase Auth + Fast2SMS Send SMS Hook, Cloudflare R2 presigned upload, PostgreSQL schema + pgvector, React Hook Form + Zod, Tailwind CSS.

### Phase 2: Matching + Notifications + Payment
**Rationale:** This is the revenue-generating core mechanic. Matching algorithm produces candidates, SMS/email notifications bring men to the app, payment locks the match. These three must ship together -- matching without payment is incomplete, payment without matching is useless. This phase also contains the most critical design decision: time-window bidding vs pure first-to-pay.
**Delivers:** Working match algorithm with pgvector cosine similarity, SMS + email notifications to compatible men, Razorpay payment flow with race-condition-safe match locking (SELECT FOR UPDATE), match status state machine, women's consent step before match lock.
**Addresses features:** Matching algorithm, match notifications (SMS + email), pay-to-lock mechanic, match locking, privacy controls.
**Avoids pitfalls:** Unfair first-to-pay outcomes (implement time-window bidding), webhook signature mismatches (raw body HMAC), chargeback abuse (evidence chain logging + UPI-first), women's safety (consent step before lock).
**Stack focus:** PostgreSQL function + pgvector cosine similarity, Fast2SMS + ZeptoMail Edge Functions, Razorpay Standard Checkout + webhook handler, SELECT FOR UPDATE atomic locking.

### Phase 3: AI-Moderated Chat
**Rationale:** Chat opens only after confirmed payment, so it depends on Phase 2. AI moderation is the technical heart of the hidden-profile mechanic during the chat window -- without it, users trivially exchange identities before meetup. This is also the highest-complexity AI integration in the product.
**Delivers:** Real-time 1:1 chat between matched pairs, AI moderation blocking identity reveals and toxic content in single Gemini call, chat expiry timer (1-2 days), message persistence for reconnection, block and report functionality.
**Addresses features:** Real-time text chat, AI-moderated chat, chat expiry timer, block and report.
**Avoids pitfalls:** Moderation bypass (single Gemini call, text-only, short window, Hinglish-aware prompt), WebSocket reliability on mobile (server-side persistence BEFORE broadcast, load history on reconnect, connection state indicator).
**Stack focus:** Supabase Realtime Broadcast, Edge Function calling Gemini 2.5 Flash-Lite (temperature=0, JSON output), messages table with RLS, moderation metadata storage.

### Phase 4: Meetup Verification + Photo Reveal
**Rationale:** This is the product's climax -- the moment hidden profiles become visible. Depends on matched + chatted pairs from Phase 3. GPS verification, venue management, reminder notifications, photo reveal, and no-show handling all ship together because they form one atomic user experience.
**Delivers:** Curated venue assignment (10-15 campus spots), meetup scheduling with countdown, push/SMS reminders (24h, 1h, 15min), GPS check-in with server-side Haversine verification, multi-signal GPS validation (+ IP geolocation), photo + name reveal via R2 presigned download URLs, no-show detection and free credit compensation.
**Addresses features:** GPS verification, photo/name reveal, curated venue assignment, meetup scheduling, push notification reminders, no-show voiding, free credit compensation.
**Avoids pitfalls:** GPS spoofing (multi-signal verification + temporal plausibility + generous radius), iOS PWA push limitations (SMS as primary notification, Web Push as bonus), women's safety (public daytime venues only).
**Stack focus:** Geolocation API, Haversine Edge Function, pg_cron + Web Push (VAPID) + Fast2SMS for reminders, R2 presigned download URL generation gated on GPS verification.

### Phase Ordering Rationale

- **Strict linear dependency:** The feature dependency chain is Auth -> Profile -> Quiz -> Matching -> Notification -> Payment -> Chat -> Meetup -> GPS -> Reveal. Phases cannot be reordered without breaking the product.
- **Revenue unlocks at Phase 2:** Payment integration in Phase 2 means the product can generate revenue even before chat and meetup features exist. Useful for validating willingness-to-pay with a partial flow during testing.
- **Architectural grouping:** Phase 1 is Supabase + R2 setup and data foundations. Phase 2 is PostgreSQL algorithms + external API integrations (payment, SMS, email). Phase 3 is real-time infrastructure + AI. Phase 4 is geolocation + notification scheduling. Each phase exercises a distinct architectural concern.
- **Risk front-loading:** The highest-risk integrations (SMS OTP delivery, payment webhooks and race conditions, AI moderation accuracy) are in Phases 1-3 where problems surface early and can be addressed before the full system is built.
- **Parallelizable work within phases:** Landing page design, venue data entry, notification infrastructure setup, and privacy policy drafting can proceed in parallel with core feature work in early phases.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Matching + Payment):** Matching algorithm tuning (pgvector cosine similarity thresholds, scoring weights, handling sparse quiz data). Razorpay webhook edge cases (retry behavior, idempotency keys, refund flow for race condition losers). The time-window vs first-to-pay design decision needs product validation before implementation.
- **Phase 3 (AI Chat Moderation):** Gemini 2.5 Flash-Lite prompt engineering for Hinglish/Kannada transliteration. Latency testing under real conditions (~200-500ms expected). False positive rate calibration -- too aggressive kills UX, too lenient leaks identities.
- **Phase 4 (GPS Verification):** Multi-signal GPS verification implementation details (IP geolocation provider selection, temporal plausibility algorithm). Indoor venue accuracy testing at actual BIT Bangalore buildings. Edge cases (both claim "here" but GPS disagrees).

Phases with standard, well-documented patterns (skip research-phase):
- **Phase 1 (Foundation + Auth):** Next.js PWA setup (Serwist docs), Supabase Auth phone OTP (official guide), Cloudflare R2 presigned URLs (multiple tutorials), React Hook Form + Zod (standard pattern). All extensively documented.
- **Phase 4 (Reminder Notifications):** pg_cron scheduling, Web Push API with VAPID, SMS sending via Fast2SMS -- standard patterns requiring configuration, not research.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies have official documentation, active maintenance, and established integration patterns. Supabase + Next.js + Vercel is the dominant serverless stack in 2025-2026. Cost estimates based on published pricing pages. |
| Features | MEDIUM-HIGH | Feature landscape well-understood from dating app domain research and campus competitor analysis (Date Drop, Cerca). Anti-features list is strong. MVP scope is aggressive but follows the strict dependency chain. |
| Architecture | HIGH | Supabase-centric architecture is standard for this scale. Data model covers all flows with explicit state machine. Code patterns provided for all critical operations (match locking, chat moderation, GPS verification, presigned URLs). |
| Pitfalls | MEDIUM-HIGH | Critical pitfalls are real and multi-source documented (GPS spoofing, payment fraud, moderation bypass, women's safety, cold start). Prevention strategies are practical but some are untested at this specific scale (multi-signal GPS verification, Gemini moderation for Hinglish). |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Women's consent flow:** Research strongly recommends women approve matches before lock. The original product vision has first-to-pay-wins without women's confirmation. This design decision must be resolved before Phase 2 implementation -- it affects the match status state machine, notification flow, and payment timing.
- **Time-window vs first-to-pay:** PITFALLS.md recommends a 2-4 hour bidding window where selection is by compatibility score, not speed. This fundamentally changes the "urgency" mechanic described in the product vision. Needs product decision before Phase 2.
- **Fast2SMS + Supabase Send SMS Hook:** No specific tutorial exists for this combination. Must adapt the documented MSG91 pattern to Fast2SMS REST API. Low risk but needs implementation-time verification.
- **Gemini moderation for Indian languages:** No tested prompt templates for Hinglish/Kannada transliteration bypass detection. Needs empirical testing during Phase 3 development.
- **Indoor GPS accuracy at BIT Bangalore:** No data on actual GPS accuracy inside campus buildings. May need to adjust geofence radius (50m vs 100m) based on field testing. Validate during Phase 4.
- **Cold start execution plan:** Technical research is complete, but the batch launch event, pre-registration campaign, and gender ratio management are operational challenges outside the codebase. Need a go-to-market plan alongside Phase 1 development.

## Sources

### Primary (HIGH confidence)
- [Supabase Documentation](https://supabase.com/docs) -- Auth, Realtime, Edge Functions, RLS, pricing, phone login, Send SMS Hook
- [Razorpay Documentation](https://razorpay.com/docs) -- Payment flow, webhooks, disputes, Standard Checkout
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2) -- Presigned URLs, pricing, S3 compatibility
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs) -- Flash-Lite pricing, content moderation guide
- [MDN Web APIs](https://developer.mozilla.org) -- Geolocation API accuracy, Web Push API
- [Fast2SMS](https://www.fast2sms.com) -- OTP without DLT registration, pricing tiers
- [Serwist Documentation](https://serwist.pages.dev/docs) -- Next.js PWA service worker setup
- [Vercel Pricing](https://vercel.com/pricing) -- Hobby plan limits

### Secondary (MEDIUM confidence)
- [Nature: Harassment of Indian Women on Dating Apps](https://www.nature.com/articles/s41599-024-04286-6) -- Safety context for product design
- [Georgetown Cerca App](https://georgetownvoice.com/2025/04/06/) -- Campus dating safety patterns
- [Date Drop (TechCrunch 2026)](https://techcrunch.com/2026/02/13/) -- Campus dating competitor analysis
- [Guardsquare: GPS Spoofing](https://www.guardsquare.com/blog/securing-location-trust-to-prevent-geo-spoofing) -- Spoofing threat model
- [Sardine: SMS Pumping](https://www.sardine.ai/blog/sms-pumping) -- OTP abuse prevention patterns
- [2Factor.in](https://2factor.in/v3/bulk-sms-pricing), [MSG91](https://msg91.com/in/pricing/otp), [MessageCentral](https://www.messagecentral.com) -- Alternative SMS provider comparison

### Tertiary (LOW confidence)
- [SkaDate: Cold Start Problem 2026](https://www.skadate.com/how-to-launch-a-dating-app-in-2026-solving-the-cold-start-problem/) -- Cold start mitigation (generic, not campus-specific)
- [Founderli: Tinder Campus Strategy](https://www.founderli.com/post/how-tinders-campus-strategy-sparked-a-global-phenomenon) -- Historical reference, different product model
- [Dating App Matching Algorithms (Medium)](https://medium.com/@abdulhaseeb9809/the-data-science-of-dating-apps-the-matching-algorithms-41874c88142a) -- General matching algorithm patterns

## Files Created

| File | Purpose |
|------|---------|
| `.planning/research/SUMMARY.md` | This file -- executive summary with roadmap implications |
| `.planning/research/STACK.md` | Technology recommendations with versions, rationale, alternatives, SMS provider deep-dive |
| `.planning/research/FEATURES.md` | Feature landscape: table stakes, differentiators, anti-features, dependencies, MVP definition |
| `.planning/research/ARCHITECTURE.md` | System architecture, component boundaries, data flows, data model, state machine, code patterns |
| `.planning/research/PITFALLS.md` | 15 domain pitfalls (5 critical, 4 moderate, 6 minor) with prevention strategies and phase warnings |

---
*Research completed: 2026-03-21*
*Ready for roadmap: yes*
