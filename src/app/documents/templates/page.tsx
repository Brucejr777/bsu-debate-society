"use client";

import { useState } from "react";

interface TemplateCardProps {
  title: string;
  reference: string;
  content: string;
}

function TemplateCard({ title, reference, content }: TemplateCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-xl shadow-black/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-sm italic text-neutral-500">{reference}</p>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4 text-emerald-400"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4"
              >
                <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
                <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
              </svg>
              Copy to Clipboard
            </>
          )}
        </button>
      </div>
      <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
        <pre className="font-mono text-sm leading-6 text-neutral-300 whitespace-pre">
          {content}
        </pre>
      </div>
    </article>
  );
}

export default function TemplatesPage() {
  const templates = [
    {
      title: "Annual Conflict of Interest Disclosure Form",
      reference: "Rules & Procedures, Annex C, Section 2",
      content: `ANNUAL CONFLICT OF INTEREST DISCLOSURE FORM

(For High Council and House Council Officers)

Legal Basis: Constitution Article 7, Section 3(1)(h)(i); Rules Article VIII, Section 7(1)(f)

A. Required Fields:

(1) Officer Information:
Full Name and House Affiliation: _______________________
Office/Position Held: ___________________________________
Term of Service (Semester/Academic Year): _______________
Date of Submission: ____________________________________

(2) Disclosure Categories (Check all that apply and provide details):

(a) Financial Interest: Do you, or an immediate family member, hold a financial interest in any vendor, supplier, or entity with which the Society or your House has conducted or may conduct business?
[ ] Yes  [ ] No
If Yes, describe nature, entity name, and estimated value:
___________________________________________________________

(b) Competitive Advantage: Are you currently involved in any external debate organization, tournament series, or competitive initiative that may create a perceived or actual advantage for your House in Society point calculations?
[ ] Yes  [ ] No
If Yes, describe nature and potential impact:
___________________________________________________________

(c) Personal Relationship: Do you have a close personal, familial, or professional relationship with any member, officer, or external party that may reasonably be perceived to impair your impartiality in deliberations, disciplinary proceedings, or resource allocations?
[ ] Yes  [ ] No
If Yes, describe relationship and relevant context:
___________________________________________________________

(d) Prior Consultation: Have you participated in unofficial consultations or negotiations regarding any matter pending before your Council that may compromise objective judgment?
[ ] Yes  [ ] No
If Yes, describe matter and nature of involvement:
___________________________________________________________

(3) Certification Statement:

"I certify that the information provided herein is true and complete to the best of my knowledge. I acknowledge my duty to recuse myself from any matter in which I have disclosed a conflict, and to update this disclosure should circumstances change during my term."

Signature: _______________________  Date: _______________

B. Submission Instructions:
• Submit annually within 14 days of assumption of office; update within 7 days of any material change.
• High Council officers → Executive Secretary and Director of Internal Affairs.
• House Council officers → House Secretariat Director and copy to Society OIA.
• Submit via secure digital platform in a sealed envelope marked "CONFIDENTIAL - CONFLICT DISCLOSURE."

C. Privacy Notice:
Disclosures are Restricted Records (Art. VIII, Sec. 2(2)). Access limited to Executive Secretary, OIA Director, and adjudicating bodies. Unauthorized disclosure = Major Violation (Art. VI, Sec. 2(2)(b)).`,
    },
    {
      title: "AI-Assisted Case & Research Disclosure Template",
      reference: "Rules & Procedures, Annex C, Section 3",
      content: `AI-ASSISTED CASE & RESEARCH DISCLOSURE TEMPLATE

(For Competition Submissions)

Legal Basis: Article 3, Section 11; Rules Article I, Section 3(1); Annex A, Section 5

A. Required Fields:

(1) Submission Metadata:
Case/Research Title and Topic: ____________________________
Competition/Tournament Name and Date: ____________________
Submitting Member(s) Name(s) and House Affiliation: _______
Role in Submission (Author, Researcher, Editor, etc.): ____

(2) AI Tool Disclosure:
List all artificial intelligence, machine learning, or automated research tools utilized in preparation:
___________________________________________________________
For each tool, specify purpose of use (e.g., literature review, argument generation, citation formatting, language editing):
___________________________________________________________
Indicate whether tool output was used verbatim, adapted, or used solely for ideation:
___________________________________________________________

(3) Human Verification Statement:

"I affirm that all substantive arguments, factual assertions, and analytical conclusions contained in this submission have been reviewed, verified, and approved by human author(s). AI-assisted content has been critically evaluated for accuracy, relevance, and ethical compliance. I accept full responsibility for the intellectual integrity of this work."

Signature(s): _______________________  Date: _______________

(4) Attribution Log (Optional but Recommended):

Source/Tool | Content Type | Extent of Use | Verification Method
------------------------------------------------------------
|            |              |               |                   |
|            |              |               |                   |

B. Submission Instructions:
• Accompany all case briefs, research packages, or position papers for Society-sanctioned competitions.
• File with tournament director, House Chancellor, or OIA as required.
• Failure to submit may result in provisional disqualification pending review (Art. I, Sec. 5(5)).

C. Privacy Notice:
Disclosures are Public Records (Art. VIII, Sec. 2(1)) when attached to public submissions. Proprietary methodology details may be redacted upon request.`,
    },
    {
      title: "Emergency Continuity Activation Checklist",
      reference: "Rules & Procedures, Annex C, Section 4",
      content: `EMERGENCY CONTINUITY ACTIVATION CHECKLIST

(For Force Majeure Scenarios)

Legal Basis: Constitution Article 8, Section 2(5)(b)-(c); Rules Article IV, Section 9(1)(e)

A. Required Fields:

(1) Activation Authority:
Declaring Officer (President/Vice President/House Chancellor): ________
Date and Time of Declaration: _____________________________________
Basis for Declaration (check one):
[ ] Institutional closure order
[ ] Public health emergency directive
[ ] Natural disaster or environmental hazard
[ ] Security threat or civil unrest
[ ] Other extraordinary circumstance: ___________________________

(2) Quorum Verification Protocol:
Virtual Platform Selected: _______________________________________
Authentication Method (e.g., email, two-factor verification): _____
Roll Call Completed: [ ] Yes  [ ] No
Verified Participants: _____ of _____ entitled members (minimum 50% + 1 required)

(3) Action Documentation Requirements:
Meeting minutes recorded via platform logging or designated scribe: [ ] Yes  [ ] No
Vote tallies captured with timestamp and participant verification: [ ] Yes  [ ] No
Emergency justification appended to official record: [ ] Yes  [ ] No

(4) Ratification Timeline:
Anticipated date of restored physical convening capacity: _________
Deadline for physical quorum ratification (14 calendar days from restoration): _________
Designated officer responsible for tracking ratification: _________

B. Submission Instructions:
• Complete contemporaneously with any emergency virtual meeting.
• Submit to Executive Secretary within 24 hours of adjournment for archival.
• Failure to complete documentation may render actions advisory only (Art. IV, Sec. 9(1)(e)).

C. Privacy Notice:
Checklists containing sensitive details are Restricted Records (Art. VIII, Sec. 2(2)). Summary reports published to Society Assembly with redaction of security-sensitive information.`,
    },
    {
      title: "Mentorship Pairing & Progress Ledger",
      reference: "Rules & Procedures, Annex C, Section 5",
      content: `MENTORSHIP PAIRING & PROGRESS LEDGER

(For Tracking Executive Intern Development)

Legal Basis: Constitution Article 5, Section 2(b); Rules Article VI, Section 4

A. Required Fields:

(1) Pairing Information:
Executive Intern Name, House, and Admission Date: _______________
Assigned Full Member Mentor Name, House, and Office Assignment: ______
Supervising High Council Secretary: _____________________________
Internship Period (Start Date - End Date): ______________________

(2) Competency Module Tracking:

Module Title                         | Completion Date | Verified By | Status
-------------------------------------|-----------------|-------------|--------
Parliamentary Procedure Fundamentals |                 |             | [ ] Complete
Debate Theory & Case Construction    |                 |             | [ ] Complete
Ethical Conduct and Society Values   |                 |             | [ ] Complete
Organizational Management Protocols  |                 |             | [ ] Complete
Operational Systems Training         |                 |             | [ ] Complete

(3) Milestone Evaluation:
Satisfactory completion of assigned operational tasks: [ ] Yes  [ ] No
Comments: _______________________________________________________
Mentor evaluation of professionalism, initiative, and growth:
Rating: [ ] Exceeds Expectations  [ ] Meets Expectations  [ ] Needs Improvement
Reflective portfolio submitted and reviewed: [ ] Yes  [ ] No
Date of Review: _______________

(4) Progression Determination:
"Based on the above evaluations, the Executive Intern is:
[ ] Recommended for elevation to Full Membership status
[ ] Recommended for extension of internship with specified remediation: _________
[ ] Not recommended for progression; reasons: ____________________"

Mentor Signature: _______________________  Date: _______________
Supervising Secretary Signature: _______________________  Date: _______________

B. Submission Instructions:
• Initiate upon assignment; update after each module and milestone.
• Final evaluation to OIA within 7 days of internship completion for Full Membership eligibility.
• Copies retained by intern, mentor, and supervising Secretary.

C. Privacy Notice:
Entries are member development records (Art. VIII, Sec. 2(2)(b)). Accessible only to intern, mentor, supervising officers, and OIA. Aggregate anonymized data may be used for program evaluation with High Council approval.`,
    },
    {
      title: "Whistleblower Confidential Intake Form",
      reference: "Rules & Procedures, Annex C, Section 6",
      content: `WHISTLEBLOWER CONFIDENTIAL INTAKE FORM

(For Secure Misconduct Reporting)

Legal Basis: Constitution Article 3, Section 14; Rules Article VI, Section 4(6)

A. Required Fields:

(1) Reporting Channel Selection:
Submission Method (check one):
[ ] Secure digital portal (Society OIA Platform)
[ ] Encrypted email to OIA Director
[ ] Sealed physical delivery to Chief Adviser
[ ] In-person confidential interview (by appointment)

(2) Discloser Preferences:
Do you wish to remain anonymous? [ ] Yes  [ ] No
If No, provide contact information for follow-up: ________________
Preferred method for status updates (if anonymous, updates via secure portal with case reference): _______________

(3) Disclosure Content:
Nature of Alleged Misconduct (check all that apply):
[ ] Constitutional violation
[ ] Financial irregularity or misappropriation
[ ] Ethical breach or code of conduct violation
[ ] Retaliation or intimidation
[ ] Threat to member safety or institutional integrity
[ ] Other: ___________________

Parties Involved (names, positions, Houses - provide only what is known):
___________________________________________________________
Factual Summary (include dates, locations, witnesses, and supporting evidence references):
___________________________________________________________
Supporting Documentation (attach or reference; do not submit original documents):
___________________________________________________________

(4) Good Faith Certification:

"I declare that this disclosure is made in good faith based on information reasonably believed to be true. I understand that knowingly false or malicious reports may constitute a Major Violation under Article VI, Section 2(2)(b), and that anonymity protections do not extend to disclosures made with intent to harm or deceive."

Anonymous Identifier (if applicable): _______________________
Date of Submission: _______________

B. Submission Instructions:
• Submit directly to Society OIA or Chief Adviser via secure channels above. Do not submit to House Councils unless they are the subject.
• Acknowledgment within 48 hours with confidential case reference number.
• Investigations commence within 7 business days; periodic status updates per discloser's preferences.

C. Privacy Notice:
All submissions are Confidential Records (Art. VIII, Sec. 2(3)). Identity of anonymous disclosers protected through redaction and limited access. Retaliation against good-faith disclosers strictly prohibited and constitutes a Major Violation (Art. VI, Sec. 4(6)(d)-(e)).`,
    },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950/95 p-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="space-y-10">
          {/* Go Back Navigation */}
          <div>
            <a
              href="/documents"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Documents
            </a>
          </div>

          {/* Header */}
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Annex C — Standardized Administrative Templates
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Operational Compliance Templates
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              This annex establishes the standardized administrative templates required by
              the Rules and Procedures of the BSU Debate Society. Use of these templates is
              mandatory where expressly required by governing provisions. Templates shall
              be maintained in digital format by the Office of the Executive Secretary,
              with updates subject to the amendment procedures under Article IX.
            </p>
            <p className="text-sm italic text-neutral-500">
              — Rules and Procedures, Annex C, Section 1
            </p>
          </article>

          {/* Templates Grid */}
          <div className="space-y-8">
            {templates.map((template, index) => (
              <TemplateCard
                key={index}
                title={template.title}
                reference={template.reference}
                content={template.content}
              />
            ))}
          </div>

          {/* Footer Note */}
          <article className="rounded-3xl border border-amber-900/40 bg-amber-950/20 p-6 text-center">
            <p className="text-sm leading-6 text-amber-300/80">
              <strong>Note:</strong> These templates are maintained by the Office of the
              Executive Secretary and are subject to periodic review and updates by the
              Council of House Chancellors. Always ensure you are using the most current
              version available on this page.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}