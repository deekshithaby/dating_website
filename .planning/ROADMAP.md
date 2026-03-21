# Roadmap: ShowUp

## Overview

ShowUp delivers a campus dating PWA where profiles stay hidden until both users physically show up. The roadmap follows the product's strict dependency chain: authenticated users with profiles feed the matching algorithm, matches unlock payment, payment unlocks chat, chat leads to scheduled meetups, and GPS verification at the venue triggers the photo reveal. Each phase delivers one complete, verifiable capability that the next phase builds on.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation + Auth + Onboarding** - PWA shell, landing page, phone OTP auth, profile creation, photo upload, compatibility quiz
- [ ] **Phase 2: Matching + Payment** - Algorithmic matching, match notifications, Razorpay payment, match locking, woman's approval flow
- [ ] **Phase 3: AI-Moderated Chat** - Real-time chat between matched pairs with AI filtering that blocks identity reveals
- [ ] **Phase 4: Meetup Scheduling** - Venue assignment, meetup scheduling with countdown, SMS reminder notifications
- [ ] **Phase 5: GPS Verification + Reveal** - GPS check-in at venue, photo and name reveal, no-show voiding, free credit compensation

## Phase Details

### Phase 1: Foundation + Auth + Onboarding
**Goal**: Users can discover the app, sign up with their phone, build their profile, upload a hidden photo, and complete the compatibility quiz -- ready to be matched
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, ONBR-01, ONBR-02, ONBR-03, ONBR-04, ONBR-05, ONBR-06, LAND-01, LAND-02
**Success Criteria** (what must be TRUE):
  1. User lands on a bold, minimal landing page with a clear CTA and can begin signup
  2. User can sign up and log in using phone OTP, and their session persists across browser refresh
  3. User can upload a face photo that is stored securely and remains invisible to all other users
  4. User can set profile info (age, gender, bio) and complete the compatibility quiz
  5. User sees a "Finding your matches" loading state after quiz completion, confirming onboarding is done
**Plans**: TBD

Plans:
- [ ] 01-01: TBD
- [ ] 01-02: TBD
- [ ] 01-03: TBD

### Phase 2: Matching + Payment
**Goal**: The system algorithmically matches compatible users, notifies men of match opportunities, accepts payment to express interest, and lets women approve the final match
**Depends on**: Phase 1
**Requirements**: MTCH-01, MTCH-02, MTCH-03, MTCH-04, MTCH-05, MTCH-06, MTCH-07, MTCH-08, MTCH-09, PAY-01, PAY-02, PAY-03, PAY-04, PAY-05, PAY-06
**Success Criteria** (what must be TRUE):
  1. System generates matches based on age, proximity, dating intent, and quiz similarity (pgvector cosine)
  2. Compatible men receive SMS/email notification and can view match opportunity (compatibility score, age, intent -- no photo, no name)
  3. Man can pay Rs 99 via Razorpay (or use a free credit) to express interest in a match, with failed payments not locking anything
  4. After time window closes, system selects the highest-compatibility interested man and woman receives notification to approve or decline
  5. Match is confirmed only after woman approves, completing the full matching flow
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD
- [ ] 02-03: TBD

### Phase 3: AI-Moderated Chat
**Goal**: Matched pairs can chat in real time with AI moderation ensuring no identity information leaks before the meetup
**Depends on**: Phase 2
**Requirements**: CHAT-01, CHAT-02, CHAT-03, CHAT-04
**Success Criteria** (what must be TRUE):
  1. Real-time 1:1 text chat opens between matched pair immediately after match confirmation
  2. Messages containing names, phone numbers, or social handles are blocked and sender receives a warning
  3. Chat messages persist and load correctly when user reconnects or refreshes
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Meetup Scheduling
**Goal**: The app assigns a curated campus venue, schedules the meetup with a visible countdown, and sends reminder notifications so both users show up
**Depends on**: Phase 3
**Requirements**: MEET-01, MEET-02, MEET-03, MEET-04
**Success Criteria** (what must be TRUE):
  1. App assigns a curated campus venue from a predefined list after match confirmation
  2. User sees the meeting location, date, time, and a live countdown timer on the match screen
  3. User receives SMS reminders at 24h, 1h, and 15min before the meetup
  4. User is prompted to enable GPS when approaching the venue
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

### Phase 5: GPS Verification + Reveal
**Goal**: Both users check in at the venue via GPS, and only then do hidden photos and names become visible -- completing the core product loop. No-shows are voided and compensated.
**Depends on**: Phase 4
**Requirements**: VRFY-01, VRFY-02, VRFY-03, VRFY-04, VRFY-05, VRFY-06
**Success Criteria** (what must be TRUE):
  1. App checks GPS of both users and verifies they are within ~50m of the designated venue
  2. When both users are GPS-verified, photo and name/nickname are revealed to both via secure R2 presigned URLs
  3. If one or both users fail to show, the match is voided with no reveal
  4. If the woman does not show, the man automatically receives 1 free match credit as compensation
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Auth + Onboarding | 0/? | Not started | - |
| 2. Matching + Payment | 0/? | Not started | - |
| 3. AI-Moderated Chat | 0/? | Not started | - |
| 4. Meetup Scheduling | 0/? | Not started | - |
| 5. GPS Verification + Reveal | 0/? | Not started | - |
