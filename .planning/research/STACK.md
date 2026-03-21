# Technology Stack

**Project:** ShowUp - Dating PWA with GPS Verification
**Researched:** 2026-03-21

## Product Flow Summary

The matching algorithm runs server-side. When compatibility is found, compatible men receive a notification (email + SMS) prompting them to open the webapp. The first man to open the webapp and pay Rs 99 locks the match. After payment, a time-gated AI-moderated chat opens for 1-2 days. GPS verification at the meetup venue unlocks photo + name reveal. No profile browsing, no swiping -- purely notification-driven matching.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 16.2.x | Full-stack React framework (SSR + API routes) | Largest React ecosystem, excellent PWA support via Serwist, zero-config Vercel deployment. Well-documented Razorpay and Supabase integration patterns. | HIGH |
| TypeScript | 5.x | Type safety across entire stack | Non-negotiable for production. Compile-time bug catching. Auto-generated Supabase types. | HIGH |
| Serwist | 9.5.x | Service worker / PWA support | Maintained successor to next-pwa. Wraps Workbox with Next.js-native config. Handles caching, offline shell, install prompts. | HIGH |
| pnpm | Latest | Package manager | Faster installs, strict dependency resolution, disk-efficient via content-addressable storage. Drop-in npm replacement. | HIGH |

### Backend-as-a-Service

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Supabase | 2.99.x (JS SDK) | Database, Auth, Realtime, Edge Functions | Single platform covers PostgreSQL, phone OTP auth, realtime broadcast (chat), and edge functions. Relational model is critical for match/payment/user/chat data. Free tier: 500MB DB, 200 concurrent realtime connections, 50K MAUs. Pro at $25/mo scales predictably. Open-source, no vendor lock-in. | HIGH |

### Why Supabase over Firebase

| Criterion | Supabase | Firebase |
|-----------|----------|---------|
| Data model | Relational (PostgreSQL) -- joins for match/payment/user data | NoSQL (Firestore) -- awkward for relational dating data |
| Phone auth | Built-in, pluggable SMS providers via Send SMS Hook | Built-in, but $0.01/verification after 10K free/month |
| Realtime | Broadcast (low-latency P2P) + Postgres Changes | Firestore listeners (heavier, document-level) |
| Pricing | Predictable $25/mo Pro. No surprise bills | Pay-per-use, unpredictable at scale |
| SQL access | Full PostgreSQL with extensions (pgvector for matching) | No SQL, limited query flexibility |
| RLS | Row Level Security built into Postgres | Firestore rules (different paradigm) |
| Self-host | Yes, if needed later | No |

### Why NOT Socket.io for Chat

Socket.io requires a separate Node.js server process, Redis for scaling, and custom auth/authorization. Supabase Realtime Broadcast provides low-latency messaging with built-in auth integration and RLS, all included in the Supabase SDK. For 1-2 day time-gated chat windows, Supabase Realtime is sufficient and dramatically simpler.

### Database

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| PostgreSQL | 15 (Supabase-managed) | Primary database | Relational model for users, matches, payments, chat messages. Supports pgvector for compatibility scoring. RLS for row-level security. Full SQL for complex matching queries. | HIGH |

---

## SMS OTP Provider: Deep Dive

### The DLT Situation in India

TRAI (Telecom Regulatory Authority of India) mandates DLT (Distributed Ledger Technology) registration for ALL Application-to-Person (A2P) SMS in India. Without DLT compliance, SMS messages are blocked by telecom operators. DLT registration costs ~Rs 5,900 per operator and requires approved sender IDs and message templates.

**However, developers do not need their own DLT registration** if using a provider that has pre-registered DLT templates. These providers use their own registered sender IDs and templates, so you send via their API and they handle DLT compliance.

### Provider Comparison (No DLT Registration Required from Developer)

| Provider | Per OTP Cost | DLT Handled By | Free Credits | Delivery SLA | API Quality | Best For |
|----------|-------------|----------------|-------------|-------------|-------------|----------|
| **Fast2SMS** (Bulk SMS Service route) | Rs 0.25/SMS (at Rs 100-3999 plan), down to Rs 0.11 at high volume | Provider (pre-registered templates) | Rs 50 free testing credits | No formal SLA | Simple REST API, Node.js examples | **MVP / cheapest start** |
| **2Factor.in** | Rs 0.25/SMS (low vol), Rs 0.18 (high vol) | Provider (DLT registered) | Demo account available | **15-second delivery SLA, pay only if delivered in time** | REST API, Node.js SDK | **Best SLA guarantee** |
| **MSG91** | Rs 0.25/SMS, Rs 0.18 at 30K+ | Provider (DLT registered) | Wallet-based, low entry | No formal delivery SLA | OTP Widget SDK, REST API | **Most documented Supabase integration** |
| **MessageCentral VerifyNow** | Rs 0.27 ($0.0033/OTP) | Provider (no DLT needed) | $10 free test credits | 4-second delivery, WhatsApp fallback | REST API | **Auto WhatsApp fallback** |
| **Firebase Phone Auth** | $0.01/verification (~Rs 0.85) after 10K free/mo | Google (handles DLT internally) | 10K free verifications/month | No SLA, some delivery issues reported in India | Firebase SDK (not REST) | **Simplest integration if already on Firebase** |

### Recommendation: Fast2SMS for MVP

**Use Fast2SMS** because:
1. **Cheapest entry**: Rs 0.25/SMS at minimum plan (Rs 100 to start). Rs 50 free testing credits.
2. **No DLT registration from you**: Bulk SMS (Service) route has pre-registered templates for OTP delivery. Uses random numeric sender ID.
3. **Simple REST API**: POST request with API key, phone number, OTP. Node.js integration is straightforward.
4. **Works without DLT portal access**: You sign up, get API key, start sending. No template approval wait.
5. **Scales down to Rs 0.11/SMS** at Rs 6L+ volume (future growth).

**Tradeoff**: No formal delivery SLA (unlike 2Factor's 15-second guarantee). Random numeric sender ID (not branded). Acceptable for MVP.

**Migration path**: If delivery reliability becomes an issue, switch to 2Factor.in (guaranteed 15-second delivery, refund if failed) or MSG91 (more Supabase documentation). The Supabase Send SMS Hook abstracts the provider -- changing requires only updating the Edge Function endpoint.

### Fast2SMS Integration with Supabase Auth

Supabase Auth supports custom SMS providers via the Send SMS Hook. This is a Supabase Edge Function that intercepts OTP generation and sends the SMS via your chosen provider:

```
Supabase Auth generates OTP -> Send SMS Hook fires -> Edge Function calls Fast2SMS API -> SMS delivered
```

The developer writes one Edge Function that receives the OTP and phone number from Supabase, then calls Fast2SMS REST API. Documented pattern exists for MSG91; same pattern applies to any REST-based SMS provider.

### Fallback Strategy

If Fast2SMS delivery is unreliable:
1. **Immediate fallback**: Switch to 2Factor.in (15-second SLA, pay-per-delivered-OTP)
2. **Scale fallback**: MSG91 at Rs 0.18/SMS for 30K+ volume
3. **Zero-effort fallback**: Firebase Phone Auth ($0.01/verification, Google handles everything including DLT)

---

## Authentication

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Supabase Auth | (included in SDK) | Phone OTP authentication | Built-in phone auth with pluggable SMS providers. Session management, JWT tokens, refresh tokens. Integrates with RLS. | HIGH |
| Fast2SMS | REST API | SMS OTP delivery (India) | Rs 0.25/SMS, no DLT registration needed, Rs 50 free testing. Connects via Supabase Send SMS Hook. | MEDIUM |

---

## Payments

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Razorpay | 2.9.x (Node SDK) | Payment processing (Rs 99/match) | Project requirement. 2% per transaction, no setup fee. Native UPI support. UPI and RuPay debit = 0% MDR. Standard Checkout embeds as JS widget. | HIGH |

**Cost math:** Rs 99/match. UPI payments (most common for college students) = 0% MDR. Card payments = 2% = Rs 1.98. At 100 matches/day = Rs 9,900 revenue.

---

## Notification System (Match Alerts)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Fast2SMS | REST API | SMS match alerts to men | Already integrated for OTP. Reuse for match notifications. Same Rs 0.25/SMS. | MEDIUM |
| Zoho ZeptoMail | API | Email match alerts to men | Zoho's transactional email service. 10,000 free emails, then pay-as-you-go. Node.js SDK. Purpose-built for transactional emails. | HIGH |

**Important: Why Zoho for email but NOT for SMS?**

Zoho does not have a standalone transactional SMS API. Zoho Campaigns SMS is marketing/promotional only -- explicitly does not support transactional messages like OTPs. Zoho's SMS within CRM/Creator requires third-party SMS gateway plugins. For transactional SMS (OTP + match alerts), a dedicated SMS provider is required.

ZeptoMail (Zoho's transactional email service) is excellent: 10K free emails, simple API, built for exactly this use case.

**Match alert flow:** Algorithm finds compatibility -> Supabase Edge Function sends SMS (Fast2SMS) + email (ZeptoMail) to compatible men -> First man to open webapp and pay Rs 99 locks the match -> Chat opens.

---

## Real-time Chat

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Supabase Realtime Broadcast | (included in SDK) | Low-latency chat messaging | No separate server. Messages broadcast between paired clients. Persist via onMessage callback. Auth integration. 200 concurrent connections free (only active chat pairs connect). | HIGH |
| Supabase Postgres | - | Chat persistence | Messages table with RLS. History loads on reconnect. | HIGH |

---

## AI Chat Moderation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Google Gemini 2.5 Flash-Lite | Latest stable | AI-powered identity blocking + toxicity filtering | $0.10/1M input, $0.40/1M output tokens. Google explicitly recommends Flash-Lite for content moderation and safety filtering. Custom prompt detects names, phone numbers, social handles. ~65 tokens/message, 1000 msgs/day = ~$0.003/day. | HIGH |

### Why Gemini 2.5 Flash-Lite over GPT-4o-mini

| Criterion | Gemini 2.5 Flash-Lite | GPT-4o-mini |
|-----------|----------------------|-------------|
| Input cost | $0.10/1M tokens | $0.15/1M tokens |
| Output cost | $0.40/1M tokens | $0.60/1M tokens |
| Savings | **33-50% cheaper** | - |
| Moderation docs | Google has official "Gemini for safety filtering and content moderation" guide | No specific moderation guide. Separate free Moderation API for toxicity only |
| Recommended config | temperature=0, JSON output, safety filters off for moderation | Generic usage |
| Identity detection | Custom system prompt (same capability) | Custom system prompt (same capability) |
| Toxicity detection | In same call via system prompt | Separate free Moderation API (extra call) |

Gemini 2.5 Flash-Lite handles BOTH identity detection AND toxicity in a single call, with Google-documented configuration for moderation use cases.

**Moderation architecture:** Every outgoing chat message hits a Supabase Edge Function:
1. Gemini 2.5 Flash-Lite (temperature=0, JSON output) -- detects identity-revealing info AND toxic content in one call
2. If flagged -> message blocked, user warned
3. If clean -> message broadcast via Supabase Realtime + persisted to Postgres

---

## GPS/Geolocation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Web Geolocation API | Browser native | GPS coordinate capture | Standard browser API. ~10m GPS accuracy, ~30m WiFi. Requires HTTPS (Vercel provides). No library needed. | HIGH |
| Haversine formula | Custom utility (~10 lines) | Distance calculation | Calculate distance between lat/lng points. Check if both users within venue radius (50m). | HIGH |

**Verification flow:** Both users tap "I'm here" -> Geolocation API -> coordinates to Edge Function -> Haversine vs venue coords -> both within radius -> photo reveal unlocks.

---

## Image Storage

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Cloudflare R2 | - | Profile photo storage | 10GB free (vs Supabase 1GB). Zero egress fees. S3-compatible API. Presigned URLs for secure upload/download. No tech debt -- standard S3 API, portable to any S3-compatible storage. | HIGH |
| @aws-sdk/client-s3 | 3.x | R2 client library | S3-compatible SDK. R2 uses same API as AWS S3. | HIGH |
| @aws-sdk/s3-request-presigner | 3.x | Presigned URL generation | Time-limited upload/download URLs. Server Action creates presigned URL -> client uploads directly -> no file touches server. | HIGH |

### Why Cloudflare R2 over Supabase Storage

| Criterion | Cloudflare R2 | Supabase Storage |
|-----------|---------------|------------------|
| Free storage | **10GB** | 1GB |
| Egress fees | **$0 (zero)** | Included but limited |
| Presigned URLs | Yes (S3 standard) | Yes (Supabase SDK) |
| Image transforms | Via Cloudflare Images (separate, paid) | Built-in (free on plan) |
| API | **S3-compatible (industry standard, portable)** | Supabase-specific |
| Tech debt | **None** -- can migrate to any S3-compatible storage | Supabase-locked |
| Setup complexity | Separate Cloudflare account + env vars | Already in Supabase |

10x more free storage, zero egress, zero tech debt. The only cost is a few extra environment variables and a Cloudflare account.

---

## Meetup Reminder Notifications

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Web Push API + VAPID | Browser native | Push notifications (24h, 1h, 15min reminders) | Standard web push. Chrome, Firefox, Edge. iOS 16.4+ for home-screen PWAs. No third-party service needed. | MEDIUM |
| Supabase pg_cron + Edge Functions | Supabase-managed | Scheduled reminder triggers | pg_cron schedules checks. Edge Function sends push. No separate cron server. | MEDIUM |

**iOS note:** Web Push on iOS requires PWA added to home screen (iOS 16.4+). BIT Bangalore students are primarily Android (India market). Acceptable for MVP.

---

## UI and Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | 4.2.x | Utility-first styling | Industry standard. Mobile-first. Tiny production bundles. | HIGH |
| Google Stitch HTML | - | Pre-built UI designs | User-created HTML files. Convert to React/Next.js components with Tailwind classes. | HIGH |
| shadcn/ui | Latest (selective use) | Accessible interactive components | Dialogs, toasts, form inputs, dropdowns -- things needing accessibility beyond static HTML. Use selectively, not as primary UI. | MEDIUM |
| Framer Motion | 11.x | Animations | Page transitions, countdown timers, photo reveal. | MEDIUM |

**Conversion workflow:** Google Stitch HTML -> extract layout/styling -> React components -> Tailwind utilities -> add interactivity.

---

## State Management and Data Fetching

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Zustand | 5.0.x | Client-side state | Tiny (~1KB), simple API. Chat state, match state, UI state. | HIGH |
| TanStack Query | 5.x | Server state / data fetching | Caching, background refetch, optimistic updates with Supabase. | HIGH |

## Form Handling and Validation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Zod | 4.3.x | Schema validation | Type-safe validation for quiz, payment, profile data. | HIGH |
| React Hook Form | 7.x | Form state management | Performant forms with Zod resolver. Onboarding quiz, profile. | HIGH |

## Matching Algorithm

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| PostgreSQL functions + pgvector | Supabase-managed | Compatibility scoring | Quiz responses as vectors. Cosine similarity via pgvector. Hard filters in SQL. No external ML service for v1. | MEDIUM |

**Algorithm for v1:**
1. Hard filters: age range, dating intent alignment, gender preference
2. Soft scoring: cosine similarity on quiz vectors (personality, lifestyle, boundaries)
3. Proximity: Haversine from campus center (BIT Bangalore geofence)
4. Rank by composite score, return top N
5. Trigger SMS + email to compatible men

All in PostgreSQL function + Edge Function. No ML pipeline.

---

## Deployment and Infrastructure

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vercel | - | Next.js hosting + CDN | Zero-config. Free Hobby: 100GB BW, 150K function invocations. HTTPS. Edge network. | HIGH |
| Supabase Cloud | - | Database + Auth + Realtime + Edge Functions | Managed everything. Free for MVP, $25/mo Pro. | HIGH |
| Cloudflare R2 | - | Image storage | 10GB free, zero egress. | HIGH |

## Dev Tools

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| pnpm | Latest | Package manager | Faster, stricter, disk-efficient | HIGH |
| ESLint | 9.x | Linting | Code quality | HIGH |
| Prettier | 3.x | Formatting | Consistent style | HIGH |
| Supabase CLI | Latest | Local dev | Local instance, migrations, type gen | HIGH |
| Vitest | 3.x | Testing | Fast, TypeScript-first | HIGH |
| Playwright | 1.x | E2E testing | Cross-browser PWA testing | MEDIUM |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js | SvelteKit | Smaller ecosystem, fewer integration examples |
| BaaS | Supabase | Firebase | NoSQL wrong for relational data. Unpredictable pricing |
| Chat | Supabase Realtime | Socket.io | Separate server, Redis, custom auth |
| SMS OTP | Fast2SMS | Zoho SMS | **Zoho has no transactional SMS API. Marketing only** |
| SMS OTP | Fast2SMS | MSG91 | MSG91 works but Fast2SMS is cheaper at low volume |
| SMS OTP | Fast2SMS | Firebase Phone Auth | $0.01/verification (Rs 0.85) is 3.4x more expensive than Fast2SMS. Locks into Firebase ecosystem |
| SMS OTP | Fast2SMS | Twilio | 2.5x more expensive for India |
| Email | Zoho ZeptoMail | Resend | ZeptoMail: 10K free, user preference for Zoho |
| Payments | Razorpay | Stripe | Razorpay has better UPI, project requirement |
| AI Moderation | Gemini Flash-Lite | GPT-4o-mini | Gemini is 33-50% cheaper. Google recommends for moderation |
| Image storage | Cloudflare R2 | Supabase Storage | 10x more free storage, zero egress, S3 standard |
| State | Zustand | Redux | Overkill for this app |
| Pkg manager | pnpm | npm | pnpm is faster, stricter |

---

## Full Stack Diagram

```
[Mobile Browser (PWA)]
    |
    |-- Next.js 16 (Vercel)
    |     |-- App Router (SSR + API routes)
    |     |-- Serwist (service worker / offline)
    |     |-- Google Stitch HTML -> React + Tailwind
    |     |-- Zustand (client state)
    |     |-- TanStack Query (server state)
    |
    |-- Supabase Cloud
    |     |-- PostgreSQL 15
    |     |     |-- pgvector (matching algorithm)
    |     |     |-- pg_cron (scheduled reminders)
    |     |-- Supabase Auth (phone OTP via Fast2SMS)
    |     |-- Supabase Realtime Broadcast (chat)
    |     |-- Supabase Edge Functions (Deno)
    |           |-- Chat moderation (Gemini 2.5 Flash-Lite)
    |           |-- GPS verification (Haversine)
    |           |-- Razorpay order + webhook
    |           |-- Match notifications (Fast2SMS + ZeptoMail)
    |
    |-- Cloudflare R2
    |     |-- Profile photos (presigned URLs)
    |     |-- @aws-sdk/client-s3
    |
    |-- External APIs
          |-- Fast2SMS (SMS: OTP + match alerts)
          |-- Zoho ZeptoMail (email: match alerts)
          |-- Razorpay (payments, Rs 99/match)
          |-- Google Gemini API (chat moderation)
          |-- Web Push API (meetup reminders)
```

---

## Installation

```bash
# Initialize Next.js project
pnpm dlx create-next-app@latest showup --typescript --tailwind --eslint --app --src-dir

# Core dependencies
pnpm add @supabase/supabase-js @supabase/ssr razorpay zod zustand @tanstack/react-query

# Image storage (Cloudflare R2 via S3 API)
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

# Email notifications (Zoho ZeptoMail)
pnpm add zeptomail

# UI
pnpm dlx shadcn@latest init
pnpm add framer-motion

# PWA
pnpm add -D @serwist/next serwist

# Forms
pnpm add react-hook-form @hookform/resolvers

# Dev tools
pnpm add -D vitest @playwright/test supabase prettier eslint-config-prettier

# Gemini AI (for Edge Functions -- imported via Deno in Edge Functions, not pnpm)
# import { GoogleGenerativeAI } from "npm:@google/generative-ai" in Edge Functions
```

---

## Cost Estimate (MVP / First 500 Users)

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|----------------------|
| Vercel (Hobby) | 100GB BW, 150K invocations | $0 |
| Supabase (Free -> Pro) | 500MB DB, 200 realtime, 50K MAUs | $0 -> $25 at scale |
| Cloudflare R2 | 10GB storage, zero egress | $0 |
| Fast2SMS (OTP + match alerts) | Rs 50 free test credits | ~Rs 750/mo ($9) at 3000 SMS |
| Zoho ZeptoMail | 10,000 free emails | $0 |
| Razorpay | No monthly fee | 0-2% per transaction (from revenue) |
| Gemini 2.5 Flash-Lite | - | ~$0.50-2/mo at campus scale |
| Web Push API | Free (browser native) | $0 |
| **Total MVP** | | **~$9-36/mo** |

---

## Tech Debt Assessment

| Decision | Risk | Assessment |
|----------|------|------------|
| Cloudflare R2 (separate from Supabase) | LOW | S3-compatible API. Portable to any S3 storage. Only added complexity: separate account + env vars. |
| Gemini for moderation | LOW | Standard LLM API call. Swap to GPT-4o-mini with prompt change only. No Gemini-specific features. |
| Fast2SMS for SMS | LOW | Supabase Send SMS Hook abstracts provider. Swap to 2Factor/MSG91 by changing Edge Function. |
| Zoho ZeptoMail | LOW | Standard transactional email API. Swap to Resend/SendGrid trivially. |
| Supabase Realtime for chat | LOW-MEDIUM | Sufficient for 1:1 time-gated chat. If needs grow (group chat, reactions), may need dedicated chat service. Fine for v1. |
| pnpm | NONE | Standard package manager. No ecosystem issues. |
| Google Stitch HTML conversion | LOW | One-time conversion effort. Once in React components, no dependency on Stitch. |

---

## Sources

- [Supabase Pricing](https://supabase.com/pricing) - Free tier limits, Pro plan
- [Supabase Realtime Limits](https://supabase.com/docs/guides/realtime/limits) - 200 concurrent connections free
- [Supabase Phone Login](https://supabase.com/docs/guides/auth/phone-login) - Phone OTP auth
- [Supabase Send SMS Hook](https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook) - Custom SMS provider
- [Fast2SMS OTP without DLT](https://www.fast2sms.com/OTP-SMS-via-API-without-DLT-Registration) - Bulk SMS Service route
- [Fast2SMS Pricing](https://www.fast2sms.com/bulk-sms-pricing) - Rs 0.25/SMS at entry
- [2Factor.in Pricing](https://2factor.in/v3/bulk-sms-pricing) - 15-second delivery SLA
- [MSG91 OTP Pricing](https://msg91.com/in/pricing/otp) - Rs 0.25/SMS
- [MessageCentral VerifyNow Pricing](https://www.messagecentral.com/en-in/product/verify-now/pricing) - $0.0033/OTP, no DLT
- [Firebase Phone Auth Pricing](https://firebase.google.com/docs/phone-number-verification/pricing) - $0.01/verification India
- [Zoho ZeptoMail Pricing](https://www.zoho.com/zeptomail/pricing.html) - 10K free emails
- [Zoho Campaigns SMS](https://www.zoho.com/campaigns/sms-pricing.html) - Marketing only, NOT transactional
- [Razorpay Integrations](https://razorpay.com/integrations/) - Standard Checkout
- [Cloudflare R2 Pricing](https://developers.cloudflare.com/r2/pricing/) - 10GB free, zero egress
- [Cloudflare R2 Presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- [Next.js + R2 Upload](https://www.buildwithmatija.com/blog/how-to-upload-files-to-cloudflare-r2-nextjs)
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing) - Flash-Lite $0.10/$0.40
- [Gemini for Content Moderation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/gemini-for-filtering-and-moderation)
- [Serwist Getting Started](https://serwist.pages.dev/docs/next/getting-started)
- [Vercel Pricing](https://vercel.com/pricing) - Hobby plan limits
- [TRAI DLT Registration](https://www.smsgatewayhub.com/dlt-registration) - DLT requirements in India
- [PWA Push Notifications](https://appinstitute.com/ultimate-guide-to-pwa-push-notifications/)
- [Geolocation API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/accuracy)
