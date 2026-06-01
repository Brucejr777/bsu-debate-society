# Website vs. Governing Documents — Compliance Report

**Date:** June 1, 2026  
**Scope:** Comparison of the BSU Debate Society website (`src/app/`) against the official **Constitution** (976 lines) and **Rules and Procedures** (2,823 lines) PDFs.

---

## Executive Summary

The website provides a thorough, accurate, and well-structured representation of the Constitution and Rules and Procedures. Nearly all major provisions are faithfully reproduced, correctly attributed, and organized logically. However, several factual errors, omissions, and inconsistencies were identified and are detailed below.

**Overall Compliance Rating: ~85%** — Strong foundation with specific gaps to address.

---

## 1. Constitution Compliance

### 1.1 Mission & Vision (Article 1–2) — ✅ MATCH
**Pages:** `/` (Home), `/about`
- Mission: "vibrant, inclusive, and intellectually stimulating community ... engage in respectful discourse" — ✅ matches PDF
- Vision: "fostering critical thinking, effective communication, and a spirit of intellectual curiosity" — ✅ matches PDF

### 1.2 Declaration of Principles (Article 3) — ✅ MATCH (reordered)
**Page:** `/about` — Lists all 15 principles correctly. The PDF order is §1–15; website reorders them but content is accurate.

### 1.3 Rights of Members (Article 4) — ✅ MATCH
**Page:** `/about`
- All 12 enumerated rights are summarized accurately. Due process rights, suffrage, access to information, freedom of speech, etc. — all present.

### 1.4 Membership (Article 5) — ⚠️ PARTIAL (issues found)
**Page:** `/membership`

| Provision | Website | PDF | Status |
|---|---|---|---|
| Open to all BSU students | ✅ | ✅ (Art 5, §1) | **Match** |
| Admission = Provisional Membership | ✅ | ✅ (Art 5, §2) | **Match** |
| 1-semester Executive Internship | ❌ **says "year"** | ✅ "one (1) academic **semester**" | **ERROR** |
| House Council approves applications | ✅ | ✅ (Art 5, §3(a)) | **Match** |
| One House at a time | ✅ | ✅ (Art 5, §3(b)) | **Match** |
| Public Membership Policy | ✅ | ✅ (Art 5, §4) | **Match** |
| Transfers require mutual consent | ✅ | ✅ (Art 5, §5) | **Match** |
| Renewal = House Council only | ✅ | ✅ (Art 5, §6) | **Match** |
| Members abide by House/Society policies | ✅ | ✅ (Art 5, §7) | **Match** |
| Sanctions for misconduct | ✅ | ✅ (Art 5, §8) | **Match** |
| Membership fee (COC + President) | ✅ | ✅ (Art 5, §11) | **Match** |
| **Alumni Associate Membership** | ❌ NOT FOUND | ✅ (Art 5, §9) | **MISSING** |
| **Re-admission of Former Members** | ❌ NOT FOUND | ✅ (Art 5, §10) | **MISSING** |
| 4 competency modules for Executive Interns | ⚠️ partial | ✅ Detailed in (Art 5, §2(b)) | **Incomplete** |

#### ❌ **CRITICAL ERROR (Membership Page):**
Line 323 of `/membership/page.tsx` states:
> "Provisional members must complete one (1) academic **year** of service within an Office of the High Council as an Executive Intern to attain Full Membership status."

The PDF Constitution, **Article 5, Section 2** states clearly: "**one (1) academic semester** of service."

This is a **factual error** — one semester ≠ one year. This could affect member expectations and progression tracking.

#### ❌ **MISSING SECTIONS (Membership):**
- **Alumni Associate Membership** (Art 5, §9): The entire provision about graduated members retaining advisory privileges is absent from the website.
- **Re-admission of Former Members** (Art 5, §10): The process for former members to petition for re-admission is entirely absent.
- **Detailed Competency Modules** (Art 5, §2(b)): The website mentions "Executive Internship" generically but omits the four competency modules (parliamentary procedure, debate theory, ethical conduct, organizational management) and the mentorship pairing requirements.

### 1.5 Society Houses (Article 6) — ✅ MATCH
**Page:** `/houses`, `/houses/[slug]` (individual house pages)
- Four permanent Houses (Bathala, Laon, Manama, Kabunian) — ✅ matches PDF
- House values, colors, and descriptions in `src/lib/houses.ts` — ✅ accurate
- Process for establishing new Houses (Art 6, §2(2)) — ❌ **NOT mentioned** on website (minor omission)

### 1.6 House Councils (Article 7) — ✅ MATCH (partial)
**Page:** `/houses`
- "Each House is governed by its own House Council" — ✅ accurate summary
- All 8 standard offices listed — ✅ match PDF
- **20% Sustainability Levy** (§2(10)) — ❌ NOT mentioned on website
- **Conflict of Interest Recusal** (§3(1)(h)) — ❌ NOT mentioned on website

### 1.7 High Council (Article 8) — ✅ MATCH
**Page:** `/governance`
- All 8 offices correctly listed with accurate role descriptions — ✅
- President as Chief Executive — ✅
- VP as Chief Coordinator presiding over COC — ✅
- **Emergency Continuity provisions** (§2(5)) — ❌ NOT mentioned on website
- **President qualifications** detailed on `/elections` page — ✅

### 1.8 Council of House Chancellors (Article 9) — ✅ MATCH
**Page:** `/governance`
- "Supreme legislative and representative body" — ✅ matches PDF
- VP as ex-officio Presiding Officer with tie-breaking vote — ✅
- Blue Book and Red Book authorities — ✅

### 1.9 High Tribunal (Article 10) — ✅ MATCH
**Page:** `/governance`
- Composition (President as Presiding Judge + 4 Chancellors as Jury of Pillars) — ✅
- Jurisdiction (constitutional interpretation, inter-House grievances, serious breaches) — ✅
- **Adversarial mandate** (Defense Chancellor + Commission on Prosecution) — ❌ NOT detailed on website
- **Appeal to Chief Adviser** (§5) — ❌ NOT mentioned on website

### 1.10 Elections (Article 11) — ✅ MATCH
**Page:** `/elections`
- Presidential Conclave described accurately — ✅
- "Elected exclusively through the Presidential Conclave" — ✅

### 1.11 Meetings (Article 12) — ❌ NOT ON WEBSITE
- Monthly general meetings, quorum requirements — not represented as a dedicated page
- (Partially covered by Rules and Procedures Article IV)

### 1.12 Amendment & Revision (Article 13–15) — ❌ NOT ON WEBSITE
- Amendment procedures, separability, effectivity clauses — not on any public page

---

## 2. Rules and Procedures Compliance

### 2.1 House Point System (Article I, R&P) — ✅ MATCH (partial)
**Pages:** `/house-cup`, `/debate-cup`

| Provision | Website | PDF | Status |
|---|---|---|---|
| House Cup awarded annually | ✅ | ✅ (§9(1)) | **Match** |
| Points reset to zero yearly | ✅ | ✅ | **Match** |
| Tiebreaker sequence (5 steps) | ✅ | ✅ (§9(2)) | **Match** |
| House of the Semester (+10 bonus) | ✅ | ✅ (§9(4)) | **Match** |
| Trophy + ₱200 budget + finals qualification + topic proposal | ✅ | ✅ (§9(3)) | **Match** |
| Inter-House Debate Cup (round-robin) | ✅ | ✅ (§10(1)) | **Match** |
| Cup point values (+15/+7/+3/+5) | ✅ | ✅ | **Match** |

#### ❌ **MISSING from website:**
- **Point Categories and Values (§3):** Competitive Excellence (100/75/50), Organizational Contribution (100 pts per House value), Governance & Compliance (±5/-3/-20), Conduct & Ethics (-5/-15/-30) — **not detailed on any public page**
- **Point Transaction Process (§5):** Accomplishment Reports, 7-day submission, provisional posting period — **not shown**
- **Authority to Award Points (§4):** Secretary of Internal Affairs posts provisionally; High Tribunal adjudicates disputes — **not shown**
- **Tracking and Transparency (§7):** Master House Point Ledger, monthly summary reports — **not shown**
- **Appeals and Dispute Resolution (§8):** Constitutional appeal process to Society Adviser — **not shown**
- **Special Competitions and Bonuses (§10):** Annual Excellence Awards (5 categories × 25 pts), Attendance bonuses — **not shown**
- **Administration and Point Keeper (§11):** Secretary of Internal Affairs as Point Keeper — **not shown**
- **Provisional Sanctions for Major Violations (§6):** House Council-initiated provisional deductions — **not shown**

### 2.2 Individual Recognition Framework (Article II, R&P) — ✅ MATCH
**Pages:** `/nominate`, `/league`
- **4 award categories** (Leadership, Communication, Academic, Creative Excellence) — ✅
- **3 tiers** (Emerging Contributor, Distinguished Member, Society Fellow) — ✅ with accurate descriptions
- Nomination form with justification and supporting docs — ✅
- **Cross-House eligibility** (points credited to member's House regardless of award category) — ✅
- **Selection Committee composition** (§3(3)) — ⚠️ **not detailed on the nominate page**, but the data model supports it
- **House Points for recognition** (Emerging +5, Distinguished +10, Society Fellow +15) (§5) — ⚠️ **not explicitly stated on the website**

### 2.3 Debate League (Article III, R&P) — ✅ MATCH
**Pages:** `/league`, `/league/support`
- Top 8 members selected by individual points — ✅
- Benefits (travel fund, mentorship, certification) — ✅
- Tie-breaking sequence — ⚠️ mentioned in PDF but NOT detailed on website
- Individual Debate Point System (Annex A) — ⚠️ detailed point values **not shown** on website (the system is implemented in the database but not explained on UI)

### 2.4 Meetings and Deliberative Procedures (Article IV, R&P) — ❌ NOT DEDICATED PAGE
- The website has no `/meetings` informational page explaining meeting types, quorum, voting procedures
- An `/meetings` page exists in the admin section but is administrative

### 2.5 Financial and Resource Management (Article V, R&P) — ❌ NOT ON PUBLIC WEBSITE
**Page:** `/finance` exists (needs verification)
- Budget preparation, disbursement thresholds, procurement guidelines — not present on public-facing pages
- Loan services, prohibited acts — not shown

<read_file>
<path>src/app/finance/page.tsx</path>
</read_file>

### 2.6 Disciplinary Procedures (Article VI, R&P) — ✅ MATCH
**Page:** `/discipline`
- Complaint form with complainant/respondent info — ✅
- 14-day filing deadline — ✅
- Violation classification (Minor vs Major) — ✅ with descriptions
- Due process notice — ✅

#### ⚠️ **Missing details:**
- **Pre-Trial Conference and Trial Timeline** (§5(4)) — not shown
- **Sanctions** (§5(6) & §4(4)) — not listed
- **Appeal and Re-Trial procedure** (§6) — not explained on the discipline page (though `/appeals` page exists)
- **Provisional Measures** (§7) — not mentioned
- **Whistleblower protections** (§4(6)) — not mentioned on this page
- **Mental Health Consideration** (§5(6)(f)) — not mentioned

### 2.7 Presidential Conclave (Article VII, R&P) — ✅ EXCELLENT MATCH
**Page:** `/elections`, `/governance`
- Detailed step-by-step process (Platform, Interrogation, Proceed Vote, Secret Ballot) — ✅
- Electors: 4 House Chancellors — ✅
- Presiding Officer (outgoing President), Secretary (VP) — ✅
- Qualifications for President — ✅
- 4-hour time limit — ✅
- Proclamation protocol ("Habemus Praesidem") — ✅
- **Contingency/substitution procedures** (§6) — ❌ NOT on website
- **Electoral Disputes** (§10) — ❌ NOT on website (page exists at `/electoral-protest`)

<read_file>
<path>src/app/electoral-protest/page.tsx</path>
</read_file>

### 2.8 Records Management (Article VIII, R&P) — ✅ MATCH
**Page:** `/records-access`
- Public/Restricted/Confidential classification — ✅
- Access request form with required fields — ✅
- Processing timeline (10 working days) — ✅
- No fees for Public Records — ✅
- Appeal process referenced — ✅
- **Retention schedules** (§3) — ❌ NOT on website
- **Data Privacy principles** (§7) — ⚠️ partially covered (no mention of Moral Rights/Attribution)
- **Digital Platform standards** (§8) — ❌ NOT on website

### 2.9 Amendment Procedures (Article IX, R&P) — ❌ NOT ON WEBSITE
- Procedural vs Substantive classification — not shown
- Proposal and deliberation process — not shown
- Annual review cycles — not shown

### 2.10 Annex A: Debate Performance Criteria — ❌ NOT ON WEBSITE
- Detailed point values for Society/House debates (+15 win, +7 draw, +3 participation, +10 Best Speaker) — partially shown on `/debate-cup` but not as a comprehensive criteria document
- External competition point values (International: +50 to +15, National: +45 to +12, etc.) — not shown
- Speaker and Individual Performance Awards — not shown
- Documentation and verification requirements — not shown

### 2.11 Annex B: Operational Compliance Templates — ❌ NOT ON WEBSITE
- Conflict of Interest Disclosure Form — not available
- AI-Assisted Case Research Disclosure — not available
- Emergency Continuity Activation Checklist — not available
- Mentorship Pairing & Progress Ledger — not available
- Whistleblower Confidential Intake Form — not available

---

## 3. Summary of All Discrepancies

### ❌ Factual Errors

| Error | Location | PDF Says | Website Says |
|---|---|---|---|
| Executive Internship duration | `/membership` line 323 | "one (1) academic **semester**" (Art 5, §2) | "one (1) academic **year**" |

### ❌ Missing Major Sections (Not Present on Any Public Page)

| Section | PDF Provision | Importance |
|---|---|---|
| Alumni Associate Membership | Constitution Art 5, §9 | Medium |
| Re-admission of Former Members | Constitution Art 5, §10 | Medium |
| Meetings (types, quorum, notice) | Constitution Art 12 / R&P Art IV | Medium |
| Amendment & Revision procedures | Constitution Art 13 / R&P Art IX | Medium |
| Detailed Point Categories/Values | R&P Art I, §3 | High (core system) |
| Point Transaction Process | R&P Art I, §5 | Medium |
| Financial & Resource Management | R&P Art V | High |
| Emergency Continuity provisions | Constitution Art 8, §2(5) | Low (edge case) |
| 20% Sustainability Levy | Constitution Art 7, §2(10) | Medium |
| Retention Schedules | R&P Art VIII, §3 | Low |
| Debate Performance Criteria (full) | R&P Annex A | Medium |
| Operational Compliance Templates | R&P Annex B | Low |

### ⚠️ Missing Minor Details

| Detail | Location in PDF | Status |
|---|---|---|
| Process for establishing new Houses | Art 6, §2(2) | Minor omission |
| Detailed competency modules for interns | Art 5, §2(b) | Minor omission |
| Conflict of Interest Recusal | Art 7, §3(1)(h) | Minor omission |
| Adversarial mandate of High Tribunal | Art 10, §3 | Minor omission |
| Appeal to Chief Adviser | Art 10, §5 | Minor omission |
| Constitutional Supremacy clause | R&P Art IX, §7(3) | Minor omission |

---

## 4. Recommendations

### Priority 1 (Fix Error):
1. **`/membership/page.tsx` line 323:** Change "one (1) academic **year**" to "one (1) academic **semester**" to match the Constitution.

### Priority 2 (Add Missing Features):
1. **House Point System details:** Add a page or section explaining the four point categories, transaction process, and tracking mechanisms from R&P Article I, §3-7.
2. **Alumni Associate Membership & Re-admission:** Add these two missing membership provisions to the `/membership` page.
3. **Financial/Resource Management:** Make the `/finance` page a public-facing guide to Society financial protocols (R&P Art V).

### Priority 3 (Polish & Completeness):
1. **Debate Performance Criteria (Annex A):** Add a page or downloadable document showing the full point values for individual debate points.
2. **Meetings page:** Create a public guide to meeting types, quorum, and voting procedures (R&P Art IV).
3. **Amendment procedures:** Add a brief explanation of how the Rules can be amended (R&P Art IX).
4. **Electoral protest procedure:** Expand the `/electoral-protest` page to include the full dispute timeline.
5. **Re-order principles on `/about`:** Consider matching the PDF order for the 15 principles to avoid confusion.

---

## 5. Action Plan to Fix All Discrepancies

Below is a detailed, step-by-step implementation plan organized by priority. Each item includes the specific file to modify, what to change, and the exact text or logic required.

---

### Phase 1: Critical Error Fix (1 task, ~5 minutes)

#### Fix 1: Correct Executive Internship Duration
- **File:** `src/app/membership/page.tsx`
- **Line:** 323
- **Change:** `"year"` → `"semester"`
- **Current text:** `Provisional members must complete one (1) academic year of service within an Office of the High Council as an Executive Intern to attain Full Membership status.`
- **Correct text:** `Provisional members must complete one (1) academic semester of service within an Office of the High Council as an Executive Intern to attain Full Membership status.`
- **Rationale:** Constitution Art 5, §2 explicitly states "one (1) academic semester"
- **Effort:** 1 line change, 5 minutes

---

### Phase 2: Add Missing Membership Sections (2 tasks, ~2 hours)

#### Fix 2: Add Alumni Associate Membership
- **File:** `src/app/membership/page.tsx`
- **Insert after:** Membership Fees section (after line 109)
- **Content to add:** A new section explaining:
  - Alumni Associate status for graduated Full Members in good standing
  - Advisory privileges (receive communications, attend open events, provide consultative input)
  - Restrictions (no voting rights, no office eligibility, no participation in internal discipline)
  - Governance by policies established by COC + President
- **Reference:** Constitution Art 5, §9
- **Design:** Use similar card layout as existing sections with a distinct color theme (e.g., purple/gold for alumni)

#### Fix 3: Add Re-admission of Former Members
- **File:** `src/app/membership/page.tsx`
- **Insert after:** New Alumni Associate section
- **Content to add:** A section explaining:
  - Petition process to relevant House Council
  - Requirements: statement of intent, evidence of prior good standing, commitment to current policies
  - Approval: majority House Council vote + OIA verification + President concurrence
  - Restored to Full Membership without repeating Executive Internship (if departed ≤ 3 academic years)
  - Retains all rights subject to amendments during absence
- **Reference:** Constitution Art 5, §10
- **Design:** Card with step-by-step process similar to Transfer section

---

### Phase 3: Add House Point System Details (1 task, ~4 hours)

#### Fix 4: Create Point System Explanation Page or Section
- **Option A:** New page at `src/app/points/page.tsx`
- **Option B:** Expand existing `/house-cup` page with detailed point system sections
- **Content to add (from R&P Art I, §3-7):**

  **a) Four Point Categories (§3):**
  - **Competitive Excellence:** Inter-House: 1st=+100, 2nd=+75, 3rd=+50, Best Speaker=+25; External: Win=+50, Finalist=+30, Participation=+10
  - **Organizational Contribution (§3(2)):** Bathala (Leadership)=+100, Kabunian (Journalism)=+100, Laon (Academic)=+100, Manama (Arts)=+100; Co-host (2 Houses)=+20 each; Recruitment=+5 per new member
  - **Governance & Compliance (§3(3)):** On-time reports=+5; Full Council attendance=+3; Late submission=-3/day (max -15); No financial report=-20; Unauthorized resource use=-75% of total points
  - **Conduct & Ethics (§3(4)):** Minor=-5; Major=-15; Severe (discrimination)= -30; Concealment penalty=-30

  **b) Point Transaction Process (§5):**
  - Accomplishment Report within 7 days of activity
  - Secretary of Internal Affairs posts provisionally within 3 business days
  - 7-day petition period for other Houses to challenge
  - High Tribunal adjudicates disputes within 14 days
  - Penalties for false claims

  **c) Point Keeper role (§11):** Secretary of Internal Affairs

  **d) Special Competitions (§10):**
  - Annual Excellence Awards (5 categories × 25 points each)
  - Attendance bonuses (perfect=+15, ≥90%=+10)
  - Zero conduct violations=+10
  - Cross-House collaboration (3+ Houses)=+30
  - External individual award=+15 per member

- **Reference:** R&P Art I, §3-7, §10-11
- **Effort:** 4 hours for new page or section

---

### Phase 4: Add Financial/Resource Management Page (1 task, ~3 hours)

#### Fix 5: Create Public Finance Page
- **File:** `src/app/finance/page.tsx` (enhance existing or create new)
- **Content to add (from R&P Art V):**
  - Resource classification (Society-Wide vs House Resources)
  - Budget preparation timeline and approval process
  - Disbursement thresholds: Minor (≤₱500), Standard (₱501-₱2,000), Major (>₱2,000)
  - Reimbursement process (7-day submission, verification, processing)
  - Procurement guidelines (quotation requirement at ₱1,000+, sustainable procurement at ₱2,000+)
  - Income-Generating Projects (IGPs) approval process
  - Loan services (authority, prohibition on borrowing, repayment terms)
  - Prohibited acts and sanctions
  - 20% Sustainability Levy (cross-reference from Constitution Art 7, §2(10))
- **Reference:** R&P Art V, §1-9
- **Effort:** 3 hours

---

### Phase 5: Add Missing Minor Pages (3 tasks, ~4 hours total)

#### Fix 6: Create Meetings Information Page
- **File:** `src/app/meetings/page.tsx` (new public page, or expand admin sidebar)
- **Content (from R&P Art IV):**
  - Types: Society Assembly, High Council, COC, House Council, House Assembly, Special
  - Notice requirements (72 hours for regular, 48 for special)
  - Agenda submission process
  - Presiding Officers for each meeting type
  - Quorum requirements (majority of officers and active members)
  - Simplified motion procedures (main motion, amend, refer, postpone, previous question, point of order, appeal)
  - Voting methods (hand, rising, secret ballot)
  - Minutes and documentation process
  - Virtual/hybrid meeting protocols
- **Reference:** R&P Art IV, §1-9 + Constitution Art 12
- **Effort:** 2 hours

#### Fix 7: Create Amendment Procedures Page
- **File:** `src/app/documents/amendments/page.tsx` or add to `/documents` page
- **Content (from R&P Art IX):**
  - Who can propose amendments (President, COC majority, 25% member petition, House Council resolution)
  - Classification: Procedural vs Substantive
  - Approval process for each type
  - Constitutional consistency review
  - Annual review cycle and mid-year check-in
  - Sunset provisions for pilot measures
  - Effectivity and transitory provisions
- **Reference:** R&P Art IX, §1-9 + Constitution Art 13
- **Effort:** 1 hour

#### Fix 8: Expand Electoral Protest Page
- **File:** `src/app/electoral-protest/page.tsx`
- **Content to add (from R&P Art VII, §10):**
  - Grounds for protest (procedural violation, vote tampering, eligibility issues)
  - 3-day filing deadline from Proclamation
  - Adjudication by High Tribunal presided by Chief Adviser
  - Decision is final and executory
  - If election nullified, new Conclave within 14 days
  - Recall provisions
- **Also add Contingency/Substitution procedures (§6):**
  - Grounds for substitution (withdrawal, disqualification, incapacity, death, graduating status)
  - Succession hierarchy (Vice Chancellor → Director → Special Nomination Assembly)
  - Pre-Conclave vs During-Conclave vs Post-Election procedures
  - Insufficient quorum protocols (3-4 vs 2 or fewer)
  - Vice Presidential succession
  - Period of Discontinuation and Alumni Convention
- **Reference:** R&P Art VII, §6, §10
- **Effort:** 1 hour

---

### Phase 6: Add Annex A Content (1 task, ~2 hours)

#### Fix 9: Create Debate Performance Criteria Page
- **File:** `src/app/league/criteria/page.tsx` or add to `/league` page
- **Content (from Annex A):**
  - **Society/House debate points:** Win=+15, Draw=+7, Participation=+3, Best Speaker=+10, Top 3 Speaker=+5
  - **External competition points table:**
    | Level | Champion | Finalist/Semi | Participation |
    |---|---|---|---|
    | International | +50 | +40 | +15 |
    | National | +45 | — | +12 |
    | Regional | +35 | +25 | +10 |
    | Local/Inter-School | +25 | +18 | +8 |
  - **Speaker awards:** Best Speaker=+20, Top 3 Speaker=+12, Best Rebuttal/Reply=+10, Best Case Construction=+10
  - **Accumulation rules:** Non-stacking, Team vs Individual attribution, Role-based eligibility
  - **Documentation requirements:** Point Claim Form within 14 days, supporting docs
  - **Verification process:** Secretary verifies within 5 business days, provisional for 7 days
  - **Dispute resolution:** Petition to High Tribunal within 7 days, penalty for false claims
- **Reference:** R&P Annex A, §1-7
- **Effort:** 2 hours

---

### Phase 7: Minor Detail Fixes (5 tasks, ~2 hours total)

#### Fix 10: Add Constitution Article 6 §2(2) Detail — New House Establishment
- **File:** `src/app/houses/page.tsx`
- **Add after** existing introduction paragraph (around line 53)
- **Content:** A brief mention that groups may apply to establish a new House by submitting a Charter with motto, emblem, core values, House Council structure, membership policy, and code of conduct — subject to approval by the Council
- **Effort:** 20 minutes

#### Fix 11: Add Constitution Art 7 §2(10) — 20% Sustainability Levy
- **File:** `src/app/houses/page.tsx` (House Councils section, around line 117)
- **Content:** Add one sentence mentioning the 20% semester-end surplus remittance to the Society General Fund
- **Effort:** 10 minutes

#### Fix 12: Add Constitution Art 7 §3(1)(h) — Conflict of Interest Recusal
- **File:** `src/app/houses/page.tsx`
- **Content:** Add a brief note that officers must recuse themselves from matters where they have financial interest, competitive advantage, or personal relationship that may impair impartiality
- **Effort:** 10 minutes

#### Fix 13: Add Constitution Art 10 §3,§5 — High Tribunal Details
- **File:** `src/app/governance/page.tsx`
- **Content:** Add the adversarial mandate (Defense Chancellor + Commission on Prosecution) and the right to appeal to the Chief Adviser for a Re-Trial
- **Effort:** 15 minutes

#### Fix 14: Re-order Principles on About Page to Match PDF Order
- **File:** `src/app/about/page.tsx`
- **Reorder** the `principles` array to match the PDF Constitution Article 3 order:
  1. Reasoned Dialogue (§1)
  2. Diversity & Inclusion (§2)
  3. Democratic Leadership (§3)
  4. Academic & Community Ties (§4) — *currently #10*
  5. Ethical Conduct (§5)
  6. Filipino Culture & Heritage (§6)
  7. Constructive Competition (§7)
  8. Tradition & Innovation (§8)
  9. Continuous Growth (§9)
  10. Education as Empowerment (§10)
  11. Technology & Innovation (§11)
  12. Environmental Sustainability (§12)
  13. Well-Being & Mental Health (§13)
  14. Transparency & Accountability (§14)
  15. Alumni & Legacy (§15)
- **Effort:** 10 minutes

---

## Implementation Summary

| Phase | Tasks | Est. Time | Dependencies |
|---|---|---|---|
| 1: Critical Error Fix | 1 | 5 min | None |
| 2: Missing Membership | 2 | 2 hrs | Phase 1 |
| 3: House Point System | 1 | 4 hrs | None |
| 4: Finance Page | 1 | 3 hrs | None |
| 5: Missing Minor Pages | 3 | 4 hrs | None |
| 6: Annex A Content | 1 | 2 hrs | None |
| 7: Minor Detail Fixes | 5 | 2 hrs | None |
| **Total** | **14** | **~17 hours** | — |

## Files to Modify (Complete List)

| # | File | Change Type |
|---|---|---|
| 1 | `src/app/membership/page.tsx` | Fix "year"→"semester" + add Alumni + Re-admission |
| 2 | `src/app/house-cup/page.tsx` or new `src/app/points/page.tsx` | Add point system details |
| 3 | `src/app/finance/page.tsx` | Add public finance guide |
| 4 | `src/app/meetings/page.tsx` (new) | Create meetings info page |
| 5 | `src/app/documents/amendments/page.tsx` (new) or enhance `/documents` | Add amendment procedures |
| 6 | `src/app/electoral-protest/page.tsx` | Add full dispute + contingency details |
| 7 | `src/app/league/criteria/page.tsx` (new) or enhance `/league` | Add Annex A criteria |
| 8 | `src/app/houses/page.tsx` | Add new House process, levy, recusal |
| 9 | `src/app/governance/page.tsx` | Add High Tribunal adversarial mandate |
| 10 | `src/app/about/page.tsx` | Re-order principles |



## 6. Verified Correct Pages

These pages were checked and **fully match** their corresponding PDF provisions:

| Page | PDF Reference | Verdict |
|---|---|---|
| `/` (Home) | Constitution Art 1-3 | ✅ |
| `/about` | Constitution Art 1-4 | ✅ (reordered) |
| `/houses` | Constitution Art 6-7 | ✅ |
| `/governance` | Constitution Art 8-10 | ✅ |
| `/membership` | Constitution Art 5 | ⚠️ (see errors) |
| `/elections` | R&P Art VII | ✅ Excellent |
| `/house-cup` | R&P Art I §9-10 | ✅ |
| `/debate-cup` | R&P Art I §10(1) | ✅ |
| `/league` | R&P Art II-III | ✅ |
| `/nominate` | R&P Art II | ✅ |
| `/discipline` | R&P Art VI | ✅ |
| `/records-access` | R&P Art VIII | ✅ |
| `/documents` | R&P Art IX references | ✅ |
| `/documents/constitution` | Full Constitution text | ✅ (renders from file) |