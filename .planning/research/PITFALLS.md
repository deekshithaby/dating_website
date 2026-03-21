# Domain Pitfalls

**Domain:** Dating app with hidden profiles, GPS verification, payment-gated matching (PWA)
**Project:** ShowUp
**Researched:** 2026-03-21

---

## Critical Pitfalls

Mistakes that cause rewrites, security breaches, financial loss, or user safety incidents.

---

### Pitfall 1: GPS Spoofing Defeats the Core Product Mechanic

**What goes wrong:** The entire ShowUp value proposition rests on GPS verification. The browser Geolocation API is trivially spoofable. Chrome DevTools has a built-in Sensors panel for setting arbitrary coordinates. Browser extensions override navigator.geolocation without detectable flags. Unlike native Android apps (which can check `isMockLocationEnabled()`), PWAs have zero access to mock location detection.

**Why it happens:** PWAs access location through the W3C Geolocation API -- a high-level abstraction. No web standard for detecting mock locations, no raw GNSS data access, no way to check developer options. Fundamental PWA limitation.

**Consequences:** Users pay Rs 99, never show up, get photo reveals fraudulently. Women's photos leak. Trust evaporates. Campus word-of-mouth kills the product.

**Prevention:**
1. **Multi-signal verification:** Cross-reference GPS against IP-based geolocation (ipinfo.io/MaxMind). GPS says BIT campus but IP resolves to different city or VPN -- flag and reject. Catches lazy 90%.
2. **Temporal plausibility:** Require multiple GPS pings over 5-10 minutes. Real users show natural drift (1-20m). Spoofed coordinates are static at exact decimals.
3. **Mutual verification window:** Both must verify within 10 minutes of each other. Makes spoofing harder.
4. **Social accountability:** Post-meetup confirmation ("did you actually meet?"). Accounts with "verified" GPS but "no-show" reports get flagged.
5. **Accept imperfection for v1:** Rs 99 payment and campus social pressure are actually stronger anti-fraud mechanisms than GPS. Plan native app for v2 where mock location detection is possible.

**Detection:**
- Mathematically exact coordinates (12.940000, 77.560000)
- Impossible travel speed between venues
- Suspiciously high verification success rate (real no-show rate should be 15-30%)
- "I showed up but they weren't there" complaints despite both showing verified

---

### Pitfall 2: Payment Fraud and Chargeback Abuse

**What goes wrong:** College students may see chargebacks as "free matches." Digital dating services have high chargeback rates. Razorpay webhooks use at-least-once delivery, so payment status can be ambiguous if handlers crash.

**Consequences:** Razorpay increases risk classification at >1-2% chargeback rate. May freeze account, hold settlements, or terminate merchant account. Rs 500 chargeback fee on Rs 99 transaction = 5x the revenue lost.

**Prevention:**
1. **Webhook-first confirmation:** NEVER trust Razorpay Checkout.js frontend callback alone. Wait for server-side webhook. Validate signatures using RAW request body (not JSON-parsed -- encoding differences cause signature mismatches).
2. **Idempotent webhook handlers:** Store processed events table. A `payment.captured` arriving after `payment.failed` for same order must not mark as failed.
3. **Respond within 5 seconds:** Razorpay times out webhook delivery at 5s. Queue heavy processing, respond 200 immediately.
4. **UPI-first strategy:** UPI transactions have lower chargeback rates than cards. UPI disputes go through bank's internal process (less favorable to consumer). Nudge users toward UPI. UPI also has 0% MDR.
5. **Delivery evidence logging:** Log: payment captured, match locked, chat opened, GPS verified, photo revealed. This chain is critical for dispute defense.
6. **Clear no-refund terms:** Display before payment. DPDP Act allows refund claims, but clear disclosure strengthens defense.

---

### Pitfall 3: AI Chat Moderation is Bypassable

**What goes wrong:** Gemini moderation is supposed to block identity reveals. Users bypass it: "my insta is s.u.n.i.l.k" (dots), "call me at nine eight four five" (number words), "find me on the gram, same as my first name plus 99" (indirect), romanized Hindi ("mera number hai nau aath...").

**Why it happens:** Text moderation is an adversarial game. LLMs are better than regex but still fail on creative encoding, transliteration, and multi-language code-switching.

**Prevention:**
1. **Single powerful LLM call:** Gemini 2.5 Flash-Lite at temperature=0 handles both pattern matching AND semantic understanding in one call. Catches "my insta is..." without needing separate regex.
2. **Accept imperfection, design around it:** Moderation doesn't need to be 100% effective. It needs to make most casual attempts fail. Determined users will always find a way -- acceptable if payment is already made.
3. **Short chat window is the best defense:** 1-2 day window = less time to engineer bypasses. Do not extend.
4. **Text-only chat for v1:** No image sharing. Eliminates handwritten-note bypass entirely.
5. **Transliteration handling:** BIT Bangalore students code-switch between English, Hindi, Kannada. System prompt must cover romanized Indic languages. Test with Hinglish bypass patterns.
6. **Report mechanism:** Users report identity-reveal attempts. Social accountability on a small campus matters more than AI perfection.

---

### Pitfall 4: Women's Safety Failures on a Small Campus

**What goes wrong:** Men receive match notifications without women having veto power. On a small campus (3,000-5,000 students), anonymity is thin. A man might recognize the woman from limited profile data. After photo reveal, a rejected match could harass on campus.

**Why it happens:** Research documents Indian women face catfishing, stalking, harassment on dating platforms (Nature 2024). On a closed campus, consequences are amplified -- you share cafeterias with your harasser.

**Consequences:** A single safety incident kills the product. Women warn each other, adoption collapses. Legal liability under IT Act and IPC.

**Prevention:**
1. **Women must have veto power:** Before match locks, give the woman a confirmation step. First-to-pay creates urgency for men, but women consent to the match.
2. **Minimize pre-reveal data:** Show only: compatibility score, age, dating intent. No department, year, or activity preferences that narrow identity.
3. **Venue safety:** Public, well-lit, populated campus locations only. No evening or off-campus venues for v1.
4. **Block with teeth:** One-tap block = permanent mutual exclusion from matching pool. Reports trigger suspension pending review, not just warning.
5. **Emergency contact:** Share meetup details with trusted friend. "Safety check" notification 30 min after meetup: "Are you safe?"
6. **No post-meetup persistence:** Chat closes after meetup. App is not a vector for continued unwanted contact.

---

### Pitfall 5: PWA Cannot Do Background Geolocation or Reliable Push on iOS

**What goes wrong:** iOS PWAs cannot run background geolocation. Push notifications only work on iOS 16.4+ and require manual home-screen installation + settings toggle. On Android, background geolocation is also restricted to foreground-only in browser.

**Consequences:** Users miss meetup reminders. GPS verification requires browser tab open and foregrounded. iOS users have meaningfully worse experience.

**Prevention:**
1. **Design for foreground-only GPS:** User arrives, opens ShowUp, taps "I'm here," app reads GPS. Manual check-in, not automatic detection.
2. **SMS as primary notification channel:** Do NOT rely on Web Push alone. Send meetup reminders via Fast2SMS. Cost: ~Rs 0.25 per SMS, 3-4 SMS per match. SMS delivery is near-universal.
3. **Email as secondary:** ZeptoMail for email reminders. Especially important for initial match alerts to men.
4. **Web Push as bonus:** Implement for browsers that support it, but treat as enhancement, not primary.
5. **Do NOT build background location tracking:** It will not work in a PWA. If critical for v2, that's when native apps get built.
6. **Generous geofence radius:** Indoor venues may fall back to WiFi positioning (50-100m accuracy). Set radius to 50m minimum, possibly 100m for indoor venues.

---

## Moderate Pitfalls

---

### Pitfall 6: Cold Start Death Spiral on Small Campus

**What goes wrong:** Launch with 50 signups. Gender ratio 70/30 (typical Indian engineering college). 35 men, 15 women. After quiz filtering, each woman has 5-8 compatible matches. Pool exhausts in 2-3 weeks. App feels "dead."

**Prevention:**
1. **Batch launch event:** Organize campus event. Target 200+ signups day one.
2. **Pre-registration gate:** Collect signups for 2-4 weeks. Activate matching only at threshold (e.g., 150+ users with min 40% each gender).
3. **Control match cadence:** Drip-feed 1-2 matches/week. Pool feels larger.
4. **Cross-gender incentives:** Women = free access. Men = first-match-free credit.
5. **Consider nearby colleges:** If BIT alone is too small, include 1-2 nearby colleges for matching pool.

---

### Pitfall 7: SMS Pumping Drains Budget

**What goes wrong:** Attacker scripts requests to OTP endpoint with random phone numbers. Each SMS = Rs 0.25. At 100 req/s = Rs 25/second. Weekend attack = lakhs in SMS costs.

**Prevention:**
1. **Rate limiting:** Per phone (3 OTPs/5min), per IP (10/5min), per device fingerprint (5/hour), global (100/min with alert).
2. **CAPTCHA on retry:** Invisible CAPTCHA (Cloudflare Turnstile) triggers on 2nd attempt.
3. **+91 only:** Block all non-Indian country codes.
4. **Budget cap:** Set Rs 500/day hard limit with Fast2SMS. Stop sending and alert team if hit.
5. **Progressive cooldown:** 1st attempt: instant. 2nd within 60s: 60s cooldown. 3rd: CAPTCHA. 4th: 15min block.

---

### Pitfall 8: Matching Algorithm Creates Unfair Outcomes

**What goes wrong:** "First to pay" = speed-over-compatibility. Men who happen to be online win. Wealthy students monopolize. Some men never match (starvation).

**Prevention:**
1. **Time-window instead of first-come:** Send match to men with 2-4 hour window. After window, select by compatibility score, not speed. **(Strongly recommended over pure first-to-pay.)**
2. **Match rate limits:** Cap 2 active matches per user per week. Prevents whale monopolization.
3. **Cooldown after match:** 48h cooldown after completing a match.
4. **Equitable exposure:** Track how many times each woman's profile has been sent. Ensure roughly equal exposure.

---

### Pitfall 9: Supabase Realtime Chat Reliability in PWA

**What goes wrong:** WebSocket connections in mobile browsers drop when user switches tabs, locks phone, or has brief network interruptions. On Indian mobile networks (Jio, Airtel), drops are common inside buildings.

**Prevention:**
1. **Server-side persistence first:** Every message stored in PostgreSQL BEFORE broadcast. If recipient offline, messages queue and deliver on reconnect.
2. **Supabase Realtime handles reconnection:** Built-in reconnection with backoff. Client re-subscribes to channel on reconnect.
3. **Load history on reconnect:** Query messages table for any missed messages since last seen timestamp.
4. **Connection state indicator:** Show "Connecting..." or "Offline" banner when disconnected.
5. **Optimistic UI:** Show message in sender's UI immediately. Update with delivery status.

---

## Minor Pitfalls

---

### Pitfall 10: Razorpay Webhook Signature Mismatch

**Prevention:** Always use raw request body bytes for HMAC-SHA256 verification. In Next.js API routes, disable body parsing for webhook endpoint. Test with real Razorpay test-mode webhooks.

### Pitfall 11: Photo Storage Leak

**Prevention:** Photos in R2 with randomized non-guessable keys. Presigned download URLs with 10-minute expiry generated ONLY after GPS verification. `Cache-Control: no-store` headers. Delete actual R2 objects on account deletion.

### Pitfall 12: Quiz Data Fingerprinting

**Prevention:** Never share raw quiz answers with matches. Show only aggregate compatibility score. Quiz is algorithm input, not a profile feature.

### Pitfall 13: No-Show Compensation Abuse

**Prevention:** 1 free credit per user lifetime. Verify genuine no-show (woman didn't open app during meetup window). Suspend serial no-shows (3+).

### Pitfall 14: Indian Regulatory Compliance

**Prevention:** DPDPA 2023 compliance. Privacy policy at launch. Explicit consent. Data deletion mechanism. Minimize location data retention.

### Pitfall 15: DLT Compliance for SMS

**Prevention:** Use Fast2SMS Bulk SMS Service route which has pre-registered DLT templates. Developer does NOT need own DLT registration. However, if switching SMS providers later, ensure the new provider also handles DLT compliance on their end. Custom sender IDs require DLT registration (Rs 5,900 per telecom operator).

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Authentication (OTP) | SMS pumping drains budget | Rate limit, CAPTCHA, +91 only, daily budget cap on Fast2SMS |
| Authentication (OTP) | DLT compliance for SMS delivery | Use provider with pre-registered DLT templates (Fast2SMS Service route) |
| Onboarding (Quiz) | Quiz answers fingerprint users | Never expose raw quiz data, show only aggregate scores |
| Photo Upload | Predictable URLs leak hidden photos | R2 presigned URLs, randomized keys, short expiry, no-store cache |
| Matching Algorithm | First-to-pay = speed-based, unfair | Time-window bidding (2-4h), rate limits, cooldowns |
| Payment (Razorpay) | Webhook signature mismatch | Raw body for HMAC verification, test with real webhooks |
| Payment (Chargebacks) | Rs 500 fee on Rs 99 transaction | Evidence chain logging, UPI-first, clear no-refund terms |
| AI Chat Moderation | Bypassed via transliteration, creative encoding | Single Gemini call for both identity + toxicity, text-only chat, short window |
| Notifications | iOS push unreliable, users miss reminders | SMS (Fast2SMS) as primary, email (ZeptoMail) as secondary, Web Push as bonus |
| GPS Verification | Browser Geolocation trivially spoofable | Multi-signal (GPS + IP), temporal plausibility, generous radius |
| Meetup Safety | Women matched without consent | Women must approve match before lock, public venues, emergency contacts |
| Cold Start | Small pool exhausted in weeks | Batch launch event, pre-registration gate at 150+, drip-feed matches |
| Chat Reliability | WebSocket drops on mobile tab switch | Server-side persistence, Supabase Realtime reconnection, history on reconnect |
| No-Show Compensation | Free credit farming | 1 credit lifetime, verify genuine no-show, suspend serial offenders |
| Compliance | DPDPA 2023 for sensitive data | Privacy policy at launch, consent, data deletion, minimize retention |

---

## Sources

- [Guardsquare: Securing Location Trust](https://www.guardsquare.com/blog/securing-location-trust-to-prevent-geo-spoofing) -- GPS spoofing context
- [MDN: GeolocationCoordinates accuracy](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/accuracy)
- [Razorpay: Disputes](https://razorpay.com/docs/payments/disputes/) -- chargeback handling
- [Razorpay: Webhook FAQs](https://razorpay.com/docs/webhooks/faqs/) -- integration pitfalls
- [MagicBell: PWA iOS Limitations](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide)
- [SkaDate: Launching a Dating App 2026](https://www.skadate.com/how-to-launch-a-dating-app-in-2026-solving-the-cold-start-problem/) -- cold start
- [Founderli: Tinder's Campus Strategy](https://www.founderli.com/post/how-tinders-campus-strategy-sparked-a-global-phenomenon)
- [Nature: Harassment of Indian Women on Dating Apps](https://www.nature.com/articles/s41599-024-04286-6)
- [Sardine: SMS Pumping](https://www.sardine.ai/blog/sms-pumping) -- OTP abuse prevention
- [Gemini for Content Moderation](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/gemini-for-filtering-and-moderation)
- [TRAI DLT Registration](https://www.smsgatewayhub.com/dlt-registration) -- India SMS compliance
- [Fast2SMS OTP without DLT](https://www.fast2sms.com/OTP-SMS-via-API-without-DLT-Registration)
