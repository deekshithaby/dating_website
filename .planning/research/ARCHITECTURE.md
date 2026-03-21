# Architecture Patterns

**Domain:** Dating PWA with real-time moderated chat and GPS meetup verification
**Project:** ShowUp
**Researched:** 2026-03-21

## Recommended Architecture

ShowUp uses a **Supabase-centric serverless architecture** -- Next.js on Vercel as the frontend + API layer, Supabase as the backend (database, auth, realtime, edge functions), with Cloudflare R2 for image storage and external APIs for SMS, email, payments, and AI moderation. This is NOT a microservices architecture and NOT a custom Node.js backend -- that would be premature for a campus-scoped MVP.

```
+-------------------------------------------------------------------+
|                    PWA CLIENT (App Shell)                          |
|  +----------+  +----------+  +----------+  +----------+          |
|  |  Auth    |  | Match    |  |   Chat   |  |  Meetup  |          |
|  |  Flow    |  | Alert    |  | (Realtime|  |  GPS     |          |
|  |          |  | Payment  |  |  Bcst)   |  |  Verify  |          |
|  +----------+  +----------+  +----------+  +----------+          |
|  +-------------------+  +-------------------+                     |
|  | Service Worker     |  | Push Subscription |                     |
|  | (Serwist/Workbox)  |  | (VAPID)           |                     |
|  +-------------------+  +-------------------+                     |
+-------------------------------------------------------------------+
              |  HTTPS / WSS              |
              v                           v
+-------------------------------------------------------------------+
|              NEXT.JS APP ROUTER (Vercel)                          |
|   +------------+  +----------------+  +----------------+          |
|   | API Routes |  | Server Actions |  | Server         |          |
|   | (webhooks) |  | (forms, R2)    |  | Components     |          |
|   +------------+  +----------------+  +----------------+          |
+-------------------------------------------------------------------+
              |                           |
              v                           v
+-------------------------------------------------------------------+
|                     SUPABASE CLOUD                                |
|  +------------+  +----------+  +----------+  +-------------+     |
|  | PostgreSQL |  | Supabase |  | Realtime |  | Edge        |     |
|  | 15         |  | Auth     |  | Broadcast|  | Functions   |     |
|  | + pgvector |  | (OTP)    |  | (chat)   |  | (Deno)      |     |
|  | + pg_cron  |  |          |  |          |  |             |     |
|  +------------+  +----------+  +----------+  +-------------+     |
+-------------------------------------------------------------------+
              |
              v
+-------------------------------------------------------------------+
|                    EXTERNAL SERVICES                              |
|  +----------+  +----------+  +----------+  +----------+          |
|  | Razorpay |  | Fast2SMS |  | Gemini   |  | Cloudflare|          |
|  | (pay)    |  | (SMS)    |  | Flash-   |  | R2 (photos|          |
|  |          |  |          |  | Lite     |  | + S3 API) |          |
|  +----------+  +----------+  +----------+  +----------+          |
|  +----------+  +----------+                                       |
|  | ZeptoMail|  | Web Push |                                       |
|  | (email)  |  | (VAPID)  |                                       |
|  +----------+  +----------+                                       |
+-------------------------------------------------------------------+
```

**Confidence:** HIGH -- Supabase + Vercel is the dominant pattern for serverless full-stack apps in 2025-2026. Matches the scale (single campus, hundreds of users) and team size.

### Component Boundaries

| Component | Responsibility | Communicates With | Protocol |
|-----------|---------------|-------------------|----------|
| **PWA Client** | UI rendering, service worker, push subscription, GPS collection | Next.js App Router | HTTPS, WSS |
| **Next.js App Router** | Server rendering, API routes (Razorpay webhooks), Server Actions (R2 uploads) | Supabase SDK, Cloudflare R2 | HTTPS |
| **Supabase Auth** | Phone OTP login, JWT issuance, session management | Fast2SMS (via Send SMS Hook) | REST |
| **Supabase PostgreSQL** | Users, matches, payments, messages, venues, quiz data, credits | All backend logic | SQL |
| **Supabase Realtime** | WebSocket connections, chat message broadcast between matched pairs | PWA Client (WSS) | WebSocket |
| **Supabase Edge Functions** | Chat moderation, GPS verification, match notifications, Razorpay order creation | Gemini API, Fast2SMS, ZeptoMail, Razorpay | REST |
| **Cloudflare R2** | Photo storage, presigned URL generation for upload/download | Next.js Server Actions, Edge Functions | S3 API |

### Data Flow

#### Flow 1: User Registration + Onboarding

```
User opens PWA
  -> Service worker (Serwist) caches app shell
  -> User enters phone number
  -> Supabase Auth triggers Send SMS Hook
  -> Edge Function calls Fast2SMS API to deliver OTP
  -> User enters OTP
  -> Supabase Auth verifies, creates user, issues JWT
  -> User completes compatibility quiz (React Hook Form + Zod)
  -> Server Action stores quiz responses + calculates personality vector (pgvector)
  -> User uploads photo:
     -> Server Action creates presigned upload URL via @aws-sdk/s3-request-presigner
     -> Client uploads directly to Cloudflare R2 (no file touches server)
  -> User enters matching pool (is_active = true)
```

#### Flow 2: Matching + Notification + Payment

```
Matching runs periodically (pg_cron or manual trigger):
  -> PostgreSQL function queries women in pool with open match slots
  -> For each woman, scores compatible men using:
     - Age range filter (SQL WHERE)
     - Geofence (Haversine distance from BIT campus center)
     - Quiz similarity (cosine similarity via pgvector)
     - Intent alignment (SQL filter)
  -> Generates ranked list of compatible men
  -> Edge Function sends notifications to top N men:
     - SMS via Fast2SMS: "Compatible match found! Open ShowUp: [link]"
     - Email via ZeptoMail: match alert with webapp link
  -> First man to open webapp and pay Rs 99:
     -> Next.js API route creates Razorpay order (server-side)
     -> Frontend opens Razorpay Standard Checkout (client-side modal)
     -> On payment success, frontend sends payment_id + signature to API route
     -> API route verifies HMAC-SHA256 signature against Razorpay secret
     -> Database transaction atomically locks match (SELECT FOR UPDATE)
     -> Match status -> 'locked'
     -> Both users notified (Web Push + in-app)
  -> Other men's match opportunity expires
  -> If payment fails for locked user, match unlocks (Razorpay webhook handler)
```

**Race condition handling:** The "first to pay" mechanic uses a database transaction with `SELECT ... FOR UPDATE` on the match row. Only the first successful payment + lock wins. Subsequent payment attempts see a locked match and are refunded via Razorpay Refunds API.

**Why not Redis SETNX?** With Supabase as the backend, there is no Redis instance. PostgreSQL's row-level locking (`SELECT FOR UPDATE`) provides the same atomicity guarantee without adding Redis infrastructure. At campus scale (concurrent payments measured in single digits, not thousands), PostgreSQL handles this trivially.

#### Flow 3: AI-Moderated Chat

```
Match confirmed, chat opens
  -> Both users connect to Supabase Realtime channel (match-specific channel ID)
  -> User A types message and sends
  -> Client calls Edge Function with message text (not broadcast directly)
  -> Edge Function runs moderation:
     Gemini 2.5 Flash-Lite (temperature=0, JSON output):
       - System prompt checks for identity reveals AND toxicity
       - Detects: phone numbers, names, @handles, URLs, coded references
       - Returns JSON: { blocked: boolean, reason: string }
       - Latency: ~200-500ms per message (acceptable for text chat)
  -> If blocked: sender receives "Message blocked - no identity reveals before meetup"
  -> If passed:
     -> Message broadcast to Realtime channel (both users receive)
     -> Message persisted to messages table in PostgreSQL
     -> Moderation metadata stored (for review/audit)
  -> Chat window auto-closes after 24-48 hours
```

**Why single-layer (Gemini only) instead of regex + LLM?**

Gemini 2.5 Flash-Lite at temperature=0 is fast enough (~200ms) and cheap enough ($0.10/1M input tokens) that a single LLM call replaces both regex and separate moderation API. The LLM catches regex patterns (phone numbers, URLs) AND semantic patterns ("my insta is the same as my first name") in one call. A regex pre-filter adds complexity for minimal benefit -- the LLM handles both. If latency becomes an issue at scale, add regex as a fast-path for obvious patterns only.

#### Flow 4: Meetup GPS Verification

```
Meetup time approaches:
  -> pg_cron triggers Edge Function at reminder intervals
  -> Edge Function sends reminders:
     - 24h before: SMS + email + Web Push
     - 1h before: SMS + Web Push
     - 15min before: Web Push
  -> At meetup time, both users open app and tap "I'm here"
  -> PWA requests GPS via navigator.geolocation.getCurrentPosition({
       enableHighAccuracy: true,
       timeout: 10000,
       maximumAge: 0
     })
  -> Client sends { lat, lon, accuracy } to Edge Function
  -> Edge Function calculates Haversine distance to venue coordinates
  -> If BOTH users within 50m radius of venue:
     -> Match status -> 'gps_verified'
     -> Edge Function generates presigned download URL for both users' photos from R2
     -> Photos + name/nickname revealed to both users
     -> Chat window extended or converted to unrestricted chat
  -> If meetup window expires (30 min) and one/both absent:
     -> Match status -> 'voided'
     -> If woman no-show: man gets 1 free match credit
     -> Both returned to matching pool
```

#### Flow 5: Notification Delivery

```
Match notification (to men):
  -> Edge Function calls Fast2SMS API (SMS) + ZeptoMail API (email)
  -> Man opens link, arrives at webapp

Meetup reminders:
  -> pg_cron runs every minute, checks for upcoming meetups
  -> Triggers Edge Function for each reminder
  -> Edge Function sends Web Push (via VAPID/web-push) + SMS (Fast2SMS)

Chat message notification (if recipient offline):
  -> Realtime Broadcast delivers if connected
  -> If offline: Edge Function sends Web Push notification
```

## Patterns to Follow

### Pattern 1: App Shell + Dynamic Content (Serwist)

Cache the application shell at install time via Serwist service worker. Dynamic content (matches, messages, profile) loads from Supabase over the network.

```
Service Worker:
  Cache: app shell HTML, CSS, JS, manifest, icons
  Network-first: API calls to Supabase
  Cache-first: static assets (images, fonts)
```

### Pattern 2: Database-Level Match Locking

Use PostgreSQL transactions instead of Redis for match locking.

```sql
-- Atomic match lock
BEGIN;
  SELECT id FROM matches WHERE id = $1 AND status = 'candidates_sent' FOR UPDATE;
  -- If row returned, we have exclusive lock
  UPDATE matches SET status = 'locked', male_user_id = $2, locked_at = NOW()
    WHERE id = $1 AND status = 'candidates_sent';
  -- If 0 rows updated, another user already locked it
COMMIT;
```

### Pattern 3: Edge Function Chat Moderation

All chat messages pass through a Supabase Edge Function before broadcast. The Edge Function calls Gemini 2.5 Flash-Lite for moderation.

```typescript
// Supabase Edge Function: moderate-message
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);

const MODERATION_PROMPT = `You are a chat moderator for a dating app where profiles are hidden until an in-person meetup.
Your job: detect if a message reveals personal identity or contains harmful content.

Identity reveals to block:
- Full names, nicknames that could identify someone
- Phone numbers (any format)
- Social media handles (@username, "my insta is...", "find me on...")
- Email addresses
- College department + year combinations that narrow identity
- Any coded attempt to share contact information

Also block: harassment, threats, explicit content, hate speech.

Respond with JSON: { "blocked": boolean, "reason": string | null }
If not blocked, reason should be null.`;

Deno.serve(async (req) => {
  const { message, matchId, senderId } = await req.json();

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: { temperature: 0, responseMimeType: "application/json" }
  });

  const result = await model.generateContent([MODERATION_PROMPT, message]);
  const moderation = JSON.parse(result.response.text());

  if (moderation.blocked) {
    return new Response(JSON.stringify({ blocked: true, reason: moderation.reason }));
  }

  // Message passed -- persist and broadcast
  // ... store in messages table, broadcast via Realtime
  return new Response(JSON.stringify({ blocked: false }));
});
```

### Pattern 4: Presigned URL Photo Flow (Cloudflare R2)

Photos never touch the Next.js server. Server Action creates presigned URL, client uploads directly to R2.

```typescript
// Next.js Server Action
"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function createUploadUrl(userId: string) {
  const key = `photos/${userId}/${crypto.randomUUID()}.jpg`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: "image/jpeg",
  });
  const url = await getSignedUrl(r2, command, { expiresIn: 300 }); // 5 min
  return { url, key };
}

// Download URL generated ONLY after GPS verification passes
export async function createDownloadUrl(photoKey: string) {
  // Verify caller has completed GPS verification before generating URL
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: photoKey,
  });
  return getSignedUrl(r2, command, { expiresIn: 600 }); // 10 min
}
```

### Pattern 5: Haversine Distance (Server-Side Only)

Never trust client-side distance calculations. All GPS verification happens server-side.

```typescript
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isAtVenue(userLat: number, userLon: number, venue: { lat: number; lon: number }): boolean {
  return haversineDistance(userLat, userLon, venue.lat, venue.lon) <= 50; // 50m radius
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Adding Redis/BullMQ for This Scale

**What:** Adding Redis for caching, pub/sub, and job queues. Adding BullMQ for background jobs.
**Why bad:** Supabase does not include Redis. Adding Redis means another infrastructure service (Redis Cloud, Upstash, or self-hosted). At campus scale (hundreds of users), PostgreSQL + pg_cron + Supabase Edge Functions handle all the same jobs without additional infrastructure.
**Instead:** PostgreSQL for everything persistent. pg_cron for scheduled jobs. Supabase Realtime for pub/sub. Edge Functions for background processing.

### Anti-Pattern 2: Custom Node.js Backend

**What:** Building a separate Express.js or Fastify server for API routes, WebSocket handling, and background jobs.
**Why bad:** Doubles the infrastructure (Next.js + separate backend). Requires separate hosting, monitoring, deployment pipeline. Supabase provides database, auth, realtime, and edge functions -- the entire backend layer.
**Instead:** Next.js API routes for simple endpoints (Razorpay webhooks). Supabase Edge Functions for complex server-side logic. Supabase Realtime for WebSocket.

### Anti-Pattern 3: Client-Side GPS Verification

**What:** Having the PWA calculate whether the user is at the venue and send a boolean.
**Why bad:** Trivially spoofable. Users can fake GPS or just send `true`.
**Instead:** Client sends raw `{ lat, lon, accuracy }` to Edge Function. Server calculates distance.

### Anti-Pattern 4: Storing Photos in Supabase Storage Instead of R2

**What:** Using Supabase Storage for profile photos.
**Why bad:** 1GB free tier is limiting for an image-heavy app. Cloudflare R2 offers 10GB free with zero egress and S3-compatible API.
**Instead:** Cloudflare R2 with presigned URLs. S3-compatible means zero tech debt and easy migration.

### Anti-Pattern 5: Relying on Web Push as Primary Notification Channel

**What:** Using only Web Push API for match alerts and meetup reminders.
**Why bad:** iOS PWA push requires home-screen installation. Many users won't install. Android push works better but still unreliable on some devices. Match alerts are time-sensitive (first-to-pay).
**Instead:** SMS (Fast2SMS) as primary channel for match alerts. Email (ZeptoMail) as secondary. Web Push as bonus enhancement.

## Data Model

### Core Entities

```
+------------------+       +------------------+       +------------------+
|     users        |       |   quiz_responses |       |   user_photos    |
+------------------+       +------------------+       +------------------+
| id (PK, UUID)    |<---+  | id (PK)          |       | id (PK)          |
| phone            |    |  | user_id (FK)     |       | user_id (FK)     |
| nickname         |    |  | question_id      |       | r2_key           |
| gender           |    |  | answer_value     |       | is_primary       |
| date_of_birth    |    |  | created_at       |       | uploaded_at      |
| dating_intent    |    |  +------------------+       +------------------+
| personality_vec  |    |     (pgvector)
| is_active        |    |  +------------------+       +------------------+
| created_at       |    |  |    matches        |       |   payments       |
| last_active      |    |  +------------------+       +------------------+
+------------------+    +->| id (PK)          |------>| id (PK)          |
                           | female_user_id   |       | match_id (FK)    |
+------------------+       | male_user_id     |       | razorpay_order   |
|    venues        |       | compatibility_%  |       | razorpay_payment |
+------------------+       | status           |       | amount_paise     |
| id (PK)          |<------| venue_id (FK)    |       | status           |
| name             |       | meetup_time      |       | verified_at      |
| latitude         |       | chat_opens_at    |       +------------------+
| longitude        |       | chat_closes_at   |
| radius_meters    |       | gps_verified_at  |       +------------------+
| type             |       | created_at       |       | match_candidates |
| is_active        |       +------------------+       +------------------+
+------------------+                                  | id (PK)          |
                           +------------------+       | match_id (FK)    |
                           |    messages       |       | male_user_id     |
                           +------------------+       | compatibility_%  |
                           | id (PK)          |       | notified_at      |
                           | match_id (FK)    |       | notified_via     |
                           | sender_id (FK)   |       | status (pending/ |
                           | content          |       |   paid/expired)  |
                           | moderation_status|       | expires_at       |
                           | blocked_reason   |       +------------------+
                           | sent_at          |
                           +------------------+       +------------------+
                                                      | gps_checkins     |
+------------------+       +------------------+       +------------------+
| push_subs        |       | match_credits    |       | id (PK)          |
+------------------+       +------------------+       | match_id (FK)    |
| id (PK)          |       | id (PK)          |       | user_id (FK)     |
| user_id (FK)     |       | user_id (FK)     |       | latitude         |
| endpoint         |       | credits_remaining|       | longitude        |
| p256dh_key       |       | reason           |       | accuracy_meters  |
| auth_key         |       | granted_at       |       | checked_at       |
| created_at       |       | used_at          |       | within_radius    |
+------------------+       +------------------+       +------------------+
```

### Match Status State Machine

```
POOL -> CANDIDATES_NOTIFIED -> PAYMENT_PENDING -> LOCKED -> CHAT_ACTIVE
  -> CHAT_CLOSED -> MEETUP_PENDING -> GPS_VERIFIED -> REVEALED
                                   -> NO_SHOW -> VOIDED
```

| Status | Meaning |
|--------|---------|
| `pool` | Woman in matching pool, algorithm generating candidates |
| `candidates_notified` | Compatible men notified via SMS + email |
| `payment_pending` | A man has initiated payment (Razorpay order created) |
| `locked` | Payment verified, match confirmed |
| `chat_active` | Chat window open, both can message |
| `chat_closed` | Chat expired, awaiting meetup |
| `meetup_pending` | Meetup time approaching, reminders being sent |
| `gps_verified` | Both users confirmed at venue |
| `revealed` | Photos and names visible to both |
| `no_show` | One or both did not arrive |
| `voided` | Match cancelled |

## Scalability Considerations

| Concern | At 100 users (launch) | At 5K users (campus-wide) | At 50K users (multi-campus) |
|---------|----------------------|--------------------------|----------------------------|
| **Database** | Single Supabase free instance | Supabase Pro ($25/mo), connection pooling | Consider dedicated Supabase instance |
| **Realtime** | 200 free concurrent connections (plenty) | Upgrade to Pro (500+ connections) | May need dedicated realtime infrastructure |
| **Matching** | Edge Function on demand | pg_cron scheduled, every few minutes | Dedicated background processing |
| **Chat moderation** | Sequential Gemini API calls | Parallel calls, cache repeat patterns | Rate-limit per user |
| **GPS verification** | Inline in Edge Function | Same -- low frequency | Same -- scales linearly |
| **Payments** | Direct Razorpay API calls | Same + reconciliation cron | Same + webhook retry handling |
| **Notifications** | Direct Fast2SMS + Web Push calls | Same, batch sending | Queue-based sending |
| **Photo storage** | R2 free tier (10GB) | R2 paid (pennies/GB) | Same, no egress costs |

## Build Order

```
Phase 1: Foundation
  [Landing Page] + [Auth (Supabase + Fast2SMS)] + [DB Schema]
  [Photo Upload to R2] + [Profile Creation]
  Must build first: everything depends on authenticated users.

Phase 2: Core Mechanic
  [Quiz System] + [Compatibility Scoring (pgvector)]
  [Matching Algorithm (PostgreSQL function)]
  [Match Notifications (Fast2SMS + ZeptoMail)]
  [Payment (Razorpay)] + [Match Locking]

Phase 3: Communication
  [Realtime Chat (Supabase Broadcast)]
  [AI Moderation (Gemini 2.5 Flash-Lite)]
  [Chat Expiry Timer]

Phase 4: Verification
  [Venue Management]
  [Meetup Scheduling + Reminders (pg_cron + Web Push + SMS)]
  [GPS Verification + Haversine]
  [Photo Reveal (R2 Presigned Download URLs)]
  [No-Show + Credit System]
```

**Critical path:** Auth -> Quiz -> Matching -> Notifications -> Payment -> Chat -> Meetup -> GPS -> Reveal.

**Can be built in parallel:** Landing page, venue data entry, notification system setup.

## Sources

- [Razorpay Payment Flow](https://razorpay.com/docs/payments/payment-gateway/how-it-works/)
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Cloudflare R2 Presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- [Gemini for Content Moderation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/gemini-for-filtering-and-moderation)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Geolocation API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/accuracy)
