# Requirements: ShowUp

**Defined:** 2026-03-21
**Core Value:** Real-world accountability — you only see each other after you both physically show up. No catfishing, no ghosting.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can sign up with phone number and receive OTP via SMS
- [ ] **AUTH-02**: User can verify OTP and create account
- [ ] **AUTH-03**: User can log in with existing phone number via OTP
- [ ] **AUTH-04**: User session persists across browser refresh

### Onboarding

- [ ] **ONBR-01**: User can upload a clear face photo during onboarding
- [ ] **ONBR-02**: User's photo is stored in R2 and hidden from all other users until GPS verification
- [ ] **ONBR-03**: User can set basic profile info (age, gender, short bio)
- [ ] **ONBR-04**: User can complete compatibility quiz (personality type, lifestyle, dating intent, boundaries)
- [ ] **ONBR-05**: User sees animated "Finding your matches" state after quiz completion
- [ ] **ONBR-06**: User must accept terms of service and privacy policy before account creation

### Matching

- [ ] **MTCH-01**: System matches users based on age range, proximity, and dating intent alignment
- [ ] **MTCH-02**: System scores compatibility using quiz response similarity (pgvector cosine similarity)
- [ ] **MTCH-03**: Woman's profile is sent to multiple compatible men simultaneously
- [ ] **MTCH-04**: Compatible men receive SMS and email notification about available match
- [ ] **MTCH-05**: Men see match opportunity with compatibility score, age, and dating intent (no photo, no name)
- [ ] **MTCH-06**: Match opportunity stays open for a time window (2-4 hours) before selection
- [ ] **MTCH-07**: After time window, system selects from interested men by highest compatibility score
- [ ] **MTCH-08**: Woman receives match notification and can approve or decline the selected match
- [ ] **MTCH-09**: Match is confirmed only after woman approves

### Payment

- [ ] **PAY-01**: Man can pay ₹99 via Razorpay to express interest in a match
- [ ] **PAY-02**: Payment is processed securely via Razorpay Standard Checkout (UPI-first)
- [ ] **PAY-03**: Razorpay webhook confirms payment server-side (HMAC-SHA256 signature verification)
- [ ] **PAY-04**: Failed/declined payments do not lock the match
- [ ] **PAY-05**: User can see their match credit balance
- [ ] **PAY-06**: User can use a free credit instead of paying (if they have one)

### Chat

- [ ] **CHAT-01**: Real-time 1:1 text chat opens between matched pair after match confirmation
- [ ] **CHAT-02**: AI moderation filters messages to block identity-revealing information (names, phone numbers, social handles)
- [ ] **CHAT-03**: Blocked messages are replaced with a warning to the sender
- [ ] **CHAT-04**: Chat messages persist and load on reconnection

### Meetup

- [ ] **MEET-01**: App assigns a curated venue from campus locations for the meetup
- [ ] **MEET-02**: Match screen shows meeting location, date, time, and countdown timer
- [ ] **MEET-03**: User receives SMS reminder notifications at 24h, 1h, and 15min before meetup
- [ ] **MEET-04**: User is instructed to keep GPS on when arriving at venue

### Verification

- [ ] **VRFY-01**: App checks GPS of both users at meetup time
- [ ] **VRFY-02**: Both users must be within ~50m of designated venue for verification to pass
- [ ] **VRFY-03**: If both users verified at venue, photo and name/nickname are revealed to both
- [ ] **VRFY-04**: Photo reveal uses R2 presigned download URLs generated only after GPS verification
- [ ] **VRFY-05**: If one or both users don't show, match is voided with no reveal
- [ ] **VRFY-06**: If woman doesn't show, man receives 1 free match credit as compensation

### Landing

- [ ] **LAND-01**: Landing page with bold tagline and single "Get Started" CTA
- [ ] **LAND-02**: Landing page is minimal — no feature lists, pure hook

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Safety

- **SAFE-01**: User can block another user with one tap from chat
- **SAFE-02**: User can report another user with categorized reasons (harassment, fake profile, inappropriate)
- **SAFE-03**: Blocked users are permanently mutually excluded from matching

### Chat Enhancements

- **CHTE-01**: Chat window auto-expires after 1-2 days, forcing meetup decision
- **CHTE-02**: Countdown timer visible in chat showing time remaining

### Post-Meetup

- **POST-01**: User can rate match quality after meetup (improves algorithm)
- **POST-02**: User can view match history

### Growth

- **GRTH-01**: User can refer a friend and receive a free match credit
- **GRTH-02**: Multi-campus expansion to other Bangalore colleges
- **GRTH-03**: Notification preferences (frequency, channels)

### Advanced

- **ADVN-01**: ID/selfie verification for enhanced trust
- **ADVN-02**: AI-suggested conversation starters in chat
- **ADVN-03**: Profile prompts (Hinge-style) to enrich quiz data
- **ADVN-04**: Women's choice mechanic (women pick from compatible men)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Swiping / browsing profiles | Contradicts hidden-profile USP, causes the exact fatigue ShowUp cures |
| Photo visibility before meetup | Destroys core value proposition — no catfishing prevention |
| Free messaging for everyone | Removes commitment signal, leads to mass low-effort messages |
| User-chosen venues | Decision friction, unsafe locations, anxiety |
| Real-time video chat | Reveals identity before GPS verification, high WebRTC complexity |
| Social media integration / OAuth | Links dating to social identity, enables pre-meetup stalking |
| Unlimited matches / subscription | Per-match payment is core mechanic, subscriptions incentivize volume |
| Read receipts | Creates anxiety and pressure during brief chat window |
| Super likes / boosts | Pay-to-win undermines algorithmic fairness |
| Stories / posts / social feed | Turns dating app into social media, distracts from core loop |
| Native mobile apps | Web-first PWA, native only if PWA limitations block growth |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| *(populated by roadmapper)* | | |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 0
- Unmapped: 30

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after initial definition*
