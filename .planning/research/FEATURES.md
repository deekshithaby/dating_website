# Feature Research

**Domain:** Campus dating app with hidden profiles and GPS-verified meetups (India)
**Researched:** 2026-03-21
**Confidence:** MEDIUM-HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Phone OTP authentication | Standard in India; every app from Swiggy to Bumble uses it. Students won't create passwords | LOW | Supabase Auth + Fast2SMS via Send SMS Hook. Rate-limit to prevent SMS pumping |
| User profile with photo upload | Users need to represent themselves, even if photos are hidden initially. No profile = no product | LOW | Photo stored in Cloudflare R2, never exposed until GPS verification. Enforce single clear face photo |
| Basic profile info (age, gender, bio) | Users expect to share minimum identity markers. Matching without context feels random | LOW | Keep minimal: age, gender, short bio. Resist feature-creeping into full social profiles |
| Compatibility quiz / onboarding questionnaire | Users expect the app to know what it is matching on. Random matches erode trust fast | MEDIUM | Quiz feeds matching algorithm. 10-15 questions max (personality, lifestyle, intent, dealbreakers). Completion rate drops past 15 questions |
| Real-time text chat | Once matched, users expect to communicate. No chat = broken experience | MEDIUM | Supabase Realtime Broadcast + Postgres persistence. Chat is time-gated (1-2 days) |
| Push notifications | Users expect to be notified of matches, messages, and upcoming meetups | MEDIUM | PWA push via Web Push API. SMS (Fast2SMS) as primary channel for match alerts. ZeptoMail for email |
| Block and report | Non-negotiable safety feature. Without block/report, women will not use the app | LOW | One-tap block from chat. Report categories: harassment, fake profile, inappropriate content |
| Match notifications | Users need to know when they have a compatible match. Core engagement loop | LOW | SMS + email notifications to men via Fast2SMS + ZeptoMail |
| Loading/waiting states | Users expect feedback during async processes | LOW | Animated loaders, progress indicators, countdown timers |
| Privacy controls | Users expect control over their visibility and data, especially women in India | LOW-MEDIUM | Ability to pause profile. Hidden-profile mechanic is partially built-in |
| Terms of service and privacy policy | Legal requirement (DPDPA 2023). Users check these | LOW | Must exist at launch. Consent checkboxes at signup |

### Differentiators (Competitive Advantage)

Features that set ShowUp apart from Tinder/Bumble/Hinge.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Hidden profiles until GPS meetup verification | Core USP. Eliminates catfishing. Photos in R2 with signed URLs only generated after GPS verification passes | HIGH | Architectural -- not a single feature but a system design. Presigned URL generation is the enforcement mechanism |
| GPS-verified meetup check-in | Real-world accountability. Both users must be at venue for reveal | HIGH | Geolocation API + Haversine in Edge Function. ~50m radius. Must handle GPS accuracy limitations |
| Pay-to-lock match mechanic (first-to-pay wins) | Creates urgency and financial commitment. Rs 99 filters casual browsers | MEDIUM | Razorpay Standard Checkout. Race condition handling critical. Idempotent payment locking via database transaction |
| AI-moderated chat (blocks identity reveals) | Prevents premature identity reveals. Gemini 2.5 Flash-Lite in Edge Function | HIGH | Must detect names, phone numbers, social handles, creative circumvention. Accept imperfection, design around it |
| Notification-driven matching (no browsing) | No infinite scroll. No dopamine loop. Algorithmic matching pushed via SMS/email | LOW | Architecture decision. Men receive SMS + email when compatible match found. No feed/swipe UI exists |
| Curated venue selection | App picks venue. Ensures safe campus locations | LOW | Static venues table. Admin-managed. 10-15 BIT campus spots |
| Time-gated chat window (1-2 days) | Prevents endless chatting. Forces meetup. Best defense against moderation bypass | LOW | Chat auto-expires. Countdown timer visible |
| Free credit compensation (no-show protection) | Fairness mechanic. Guy gets free match if girl no-shows | LOW | Credit system. Simple balance check before payment |
| Match voiding on no-show | No reveal if either person doesn't show. Real stakes | LOW | GPS verification timeout. Match status = voided |

### Anti-Features (Do NOT Build)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Swiping / browsing profiles | Users trained by Tinder/Bumble | Directly contradicts hidden-profile USP. Causes the exact fatigue ShowUp cures | Algorithmic matching, notification-driven |
| Photo visibility before meetup | Users want to see who they are meeting | Destroys core value proposition. No catfishing prevention | Quiz-based compatibility scoring |
| Free messaging for everyone | "Why pay to talk?" | Removes commitment signal. Leads to mass low-effort messages | Pay-to-lock creates genuine intent |
| User-chosen venues | "I want to pick where we meet" | Decision friction, unsafe locations, anxiety | App-curated vetted campus spots |
| Real-time video chat | Want calls before meeting | Reveals identity before GPS verification. High complexity (WebRTC) | In-person meetup IS the reveal |
| Social media integration / OAuth | "Let me sign in with Instagram" | Links dating to social identity. Privacy risk. Tempts pre-meetup social stalking | Phone OTP keeps identity isolated |
| Unlimited matches / subscription | "Let me match more" | Per-match payment is core mechanic. Subscriptions incentivize volume over quality | Rs 99 per match. No tiers |
| Read receipts | Want to know if messages read | Creates anxiety, pressure. "Seen but not replied" generates negativity | No read status during brief chat window |
| Super likes / boosts | Standard dating monetization | Pay-to-win dynamics undermine algorithmic fairness | Single flat price. No premium advantages |
| Stories / posts / social feed | Instagram-ification | Turns dating app into social media. Distracts from matching-to-meetup | No feed. One purpose: match, chat, meet |
| ID / selfie verification (v1) | Safety feature | High complexity. Campus community provides social verification for v1 | Phone OTP + campus trust. Add in v2 if needed |

## Feature Dependencies

```
Phone OTP Auth
    |
    +---> Profile Creation (photo, age, gender)
    |         |
    |         +---> Compatibility Quiz
    |                   |
    |                   +---> Matching Algorithm
    |                             |
    |                             +---> Match Notification (SMS + email to men)
    |                                       |
    |                                       +---> Pay-to-Lock Match (Razorpay Rs 99)
    |                                                 |
    |                                                 +---> AI-Moderated Chat
    |                                                 |         |
    |                                                 |         +---> Chat Expiry Timer
    |                                                 |
    |                                                 +---> Meetup Scheduling
    |                                                           |
    |                                                           +---> Venue Assignment
    |                                                           |
    |                                                           +---> Reminder Notifications
    |                                                           |
    |                                                           +---> GPS Verification
    |                                                                     |
    |                                                                     +---> Photo/Name Reveal
    |                                                                     |
    |                                                                     +---> No-Show Detection
    |                                                                               |
    |                                                                               +---> Free Credit Compensation

Block/Report ----enhances----> Chat, Profile Views (available throughout)

Push Notifications ----enhances----> Match Notifications, Chat, Meetup Reminders

Landing Page ----precedes----> Phone OTP Auth (entry point)
```

### Key Dependency Notes

- **Matching Algorithm requires Compatibility Quiz:** Without quiz data, matching is random
- **Match Notification (SMS + email) requires Matching Algorithm:** Must have matches to notify about
- **Pay-to-Lock requires Match Notification:** Men must know about the match to pay
- **AI-Moderated Chat requires Pay-to-Lock:** Chat only opens after confirmed payment
- **GPS Verification requires Meetup Scheduling:** Must know where and when
- **Photo Reveal requires GPS Verification:** This IS the core mechanic. Breaking this breaks the product
- **Free Credit requires No-Show Detection:** Must definitively determine who showed and who didn't

## MVP Definition

### Launch With (v1)

- [ ] Landing page with bold CTA
- [ ] Phone OTP authentication (Supabase Auth + Fast2SMS)
- [ ] Profile creation (photo to R2, age, gender, short bio)
- [ ] Compatibility quiz (10-15 questions)
- [ ] Matching algorithm (PostgreSQL + pgvector)
- [ ] Match notifications (SMS via Fast2SMS + email via ZeptoMail)
- [ ] Pay-to-lock match via Razorpay (Rs 99)
- [ ] AI-moderated chat with identity blocking (Gemini 2.5 Flash-Lite)
- [ ] Chat expiry timer (1-2 days)
- [ ] Curated venue assignment (10-15 campus spots)
- [ ] Meetup scheduling with countdown
- [ ] Push notification reminders (Web Push + SMS fallback)
- [ ] GPS verification at venue (Geolocation API + Haversine)
- [ ] Photo and name/nickname reveal (R2 signed URL generated on verification)
- [ ] No-show voiding and free credit compensation
- [ ] Block and report

### Add After Validation (v1.x)

- [ ] Match quality feedback (post-meetup rating to improve algorithm)
- [ ] Venue ratings and expansion
- [ ] Profile prompts (Hinge-style to enrich quiz data)
- [ ] Chat conversation starters (AI-suggested icebreakers)
- [ ] Notification preferences
- [ ] Match history
- [ ] Referral program ("Invite a friend, get a free match")

### Future (v2+)

- [ ] Multi-campus expansion (other Bangalore colleges, then other cities)
- [ ] ID / selfie verification
- [ ] Group meetups
- [ ] Events integration
- [ ] Advanced AI matching (behavioral signals, chat analysis)
- [ ] Native mobile apps (if PWA limitations block growth)
- [ ] Women's choice mechanic (let women pick from compatible men instead of first-to-pay)

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Phone OTP auth | HIGH | LOW | P1 |
| Profile creation + photo upload | HIGH | LOW | P1 |
| Compatibility quiz | HIGH | MEDIUM | P1 |
| Matching algorithm | HIGH | MEDIUM | P1 |
| Match notifications (SMS + email) | HIGH | MEDIUM | P1 |
| Pay-to-lock (Razorpay) | HIGH | MEDIUM | P1 |
| AI-moderated chat | HIGH | HIGH | P1 |
| Chat expiry timer | MEDIUM | LOW | P1 |
| Curated venue assignment | HIGH | LOW | P1 |
| Meetup scheduling + countdown | HIGH | LOW | P1 |
| GPS verification | HIGH | HIGH | P1 |
| Photo/name reveal | HIGH | MEDIUM | P1 |
| Push notifications (reminders) | HIGH | MEDIUM | P1 |
| No-show voiding | MEDIUM | LOW | P1 |
| Free credit compensation | MEDIUM | LOW | P1 |
| Block and report | HIGH | LOW | P1 |
| Landing page | MEDIUM | LOW | P1 |
| Match quality feedback | MEDIUM | LOW | P2 |
| Profile prompts | MEDIUM | LOW | P2 |
| Chat conversation starters | LOW | MEDIUM | P2 |
| Notification preferences | LOW | LOW | P2 |
| Match history | LOW | LOW | P2 |
| Referral program | MEDIUM | MEDIUM | P2 |
| Multi-campus expansion | HIGH | HIGH | P3 |
| ID/selfie verification | MEDIUM | HIGH | P3 |
| Native mobile apps | MEDIUM | HIGH | P3 |

## Sources

- [Dating App Features 2026](https://apptechies.com/dating-app-features/) -- feature landscape
- [Build a Dating App Like Tinder 2026](https://www.groovyweb.co/blog/how-to-build-dating-app-like-tinder-2026) -- tech stack and features
- [Georgetown students create Cerca](https://georgetownvoice.com/2025/04/06/georgetown-students-create-cerca-a-new-dating-app-that-swipes-right-on-safety/) -- campus dating safety
- [Date Drop (TechCrunch)](https://techcrunch.com/2026/02/13/a-stanford-grad-student-created-an-algorithm-to-help-his-classmates-find-love-now-date-drop-is-the-basis-of-his-new-startup/) -- campus dating competitor
- [Dating App Matching Algorithms](https://medium.com/@abdulhaseeb9809/the-data-science-of-dating-apps-the-matching-algorithms-41874c88142a)
- [Harassment of Indian Women on Dating Apps (Nature)](https://www.nature.com/articles/s41599-024-04286-6) -- safety context
