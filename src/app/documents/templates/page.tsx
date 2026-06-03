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
      title: "House Point Transaction Form (Accomplishment Report)",
      reference: "Rules & Procedures, Article I, Section 5",
      content: `HOUSE POINT TRANSACTION FORM (Accomplishment Report)

[ ] Submitting House: _______________________
[ ] Activity Name: __________________________
[ ] Date of Activity: _______________________
[ ] Primary Purpose: ________________________
[ ] Point Category Claimed: _________________
[ ] Specific Point Amount: __________________
[ ] Reference to Applicable Subsection: _____
[ ] Supporting Documentation Attached: [ ] Yes  [ ] No

House Chancellor Certification:
I certify that the information provided is accurate and the activity complies with Society policies.

Name: _______________________
Signature: ____________________
Date: ________________________`,
    },
    {
      title: "Individual Debate Point Claim Form",
      reference: "Rules & Procedures, Annex A, Section 5",
      content: `INDIVIDUAL DEBATE POINT CLAIM FORM

CLAIMANT INFORMATION:
[ ] Full Name: __________________________
[ ] House: ______________________________
[ ] Membership Status: __________________

ACTIVITY DETAILS:
[ ] Date of Activity: ___________________
[ ] Activity Name: ______________________
[ ] Organizing Body: ____________________

CLAIM DETAILS:
[ ] Point Category: _____________________
[ ] Amount Claimed: _____________________
[ ] Annex Reference: ____________________

SUPPORTING DOCUMENTATION CHECKLIST:
[ ] Official Certificate / Results Sheet
[ ] Signed Attendance / Participation Proof
[ ] Other: ______________________________

GOOD FAITH DECLARATION:
I declare under penalty of disciplinary action that the information provided is true and accurate to the best of my knowledge. I understand that false claims may result in point forfeiture and disciplinary review.

Signature: ____________________ 
Date: _________`,
    },
    {
      title: "Annual Conflict of Interest Disclosure Form",
      reference: "Rules & Procedures, Annex B, Section 2",
      content: `ANNUAL CONFLICT OF INTEREST DISCLOSURE FORM

OFFICER INFORMATION:
[ ] Name: _______________________________
[ ] Office / Position: ____________________
[ ] House Affiliation: ____________________

DISCLOSURE CHECKLIST (Check all that apply to matters currently under your purview):
[ ] Financial Interest: I have a direct or indirect financial interest in the matter.
[ ] Competitive Advantage: I or my House stand to gain a competitive advantage.
[ ] Personal Relationship: I have a personal relationship that may impair objectivity.
[ ] Prior Consultation: I have previously consulted on this matter externally.

CERTIFICATION STATEMENT:
If any box is checked above, I commit to formally recusing myself from deliberation, discussion, and voting on the specified matter, and will notify the High Council / House Chancellor in writing.

Signature: ____________________ 
Date: _________`,
    },
    {
      title: "AI-Assisted Case & Research Disclosure Template",
      reference: "Rules & Procedures, Annex B, Section 3",
      content: `AI-ASSISTED CASE & RESEARCH DISCLOSURE TEMPLATE

SUBMISSION METADATA:
[ ] Case / Document Title: ________________
[ ] Date of Submission: ___________________
[ ] Preparing Member(s): __________________

AI TOOL DISCLOSURE:
[ ] AI Tool(s) Used: ______________________
[ ] Purpose of Use (e.g., brainstorming, formatting, research summarization): 
    _______________________________________
[ ] Extent of Use (e.g., <25%, 25-50%, >50% of draft): ___________

HUMAN VERIFICATION STATEMENT:
I certify that all AI-generated content has been thoroughly reviewed, fact-checked, and edited by human members to ensure accuracy, originality, and compliance with academic and Society standards.

ATTRIBUTION LOG:
[ ] Specific prompts or sections generated with AI assistance are documented in the appendix of this submission.

Signature: ____________________ 
Date: _________`,
    },
    {
      title: "Emergency Continuity Activation Checklist",
      reference: "Rules & Procedures, Annex B, Section 4",
      content: `EMERGENCY CONTINUITY ACTIVATION CHECKLIST

ACTIVATION AUTHORITY:
[ ] Activated By (Name/Title): ____________
[ ] Date & Time of Activation: ____________
[ ] Reason for Activation: ________________

QUORUM VERIFICATION PROTOCOL:
[ ] Minimum required officers notified: [ ] Yes
[ ] Alternative quorum mechanism invoked: [ ] Yes
[ ] Verification logged by Secretariat: [ ] Yes

ACTION DOCUMENTATION REQUIREMENTS:
[ ] All emergency decisions recorded in writing.
[ ] Rationale for deviation from standard procedure documented.
[ ] Affected parties notified within 24 hours.

RATIFICATION TIMELINE:
[ ] Emergency actions to be presented for formal ratification at the next valid Council meeting within ____ days.

Signature of Activating Authority: ___________ 
Date: _________`,
    },
    {
      title: "Mentorship Pairing & Progress Ledger",
      reference: "Rules & Procedures, Annex B, Section 5",
      content: `MENTORSHIP PAIRING & PROGRESS LEDGER

PAIRING INFORMATION:
[ ] Executive Intern Name: ________________
[ ] Designated Full Member Mentor: ________
[ ] Semester / Academic Year: _____________

COMPETENCY MODULE TRACKING:
[ ] Module 1: Parliamentary Procedure   [ ] Completed  [ ] In Progress
[ ] Module 2: Debate Theory             [ ] Completed  [ ] In Progress
[ ] Module 3: Ethical Conduct           [ ] Completed  [ ] In Progress
[ ] Module 4: Organizational Management [ ] Completed  [ ] In Progress
[ ] Module 5: Operational Protocols     [ ] Completed  [ ] In Progress

MILESTONE EVALUATION:
[ ] Mentor Feedback Summary: _________________________________________
[ ] Intern Self-Assessment: __________________________________________

PROGRESSION DETERMINATION:
[ ] Recommend Elevation to Full Membership: [ ] Yes  [ ] No
[ ] Recommend Extension of Provisional Status: [ ] Yes  [ ] No

Mentor Signature: ___________ 
Intern Signature: ___________ 
Date: _________`,
    },
    {
      title: "Whistleblower Confidential Intake Form",
      reference: "Rules & Procedures, Annex B, Section 6",
      content: `WHISTLEBLOWER CONFIDENTIAL INTAKE FORM

REPORTING CHANNEL SELECTION:
[ ] Submitted to: 
    [ ] Office of Internal Affairs  
    [ ] High Council President  
    [ ] External Auditor

DISCLOSER PREFERENCES:
[ ] Desired Level of Anonymity: 
    [ ] Fully Anonymous  
    [ ] Confidential (Name known only to investigator)  
    [ ] Open

DISCLOSURE CONTENT:
[ ] Nature of Misconduct (e.g., financial irregularity, ethical violation): 
    _________________________________________________________________
[ ] Parties Involved (Names/Roles, if known): ________________________
[ ] Factual Summary (Dates, locations, specific incidents): 
    _________________________________________________________________
    _________________________________________________________________

GOOD FAITH CERTIFICATION:
I certify that this disclosure is made in good faith, based on reasonable belief of misconduct, and not for malicious or retaliatory purposes. I understand the Society's non-retaliation policy protects me from adverse action.

Signature (Optional if Anonymous): ___________ 
Date: _________`,
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
              Operational Templates &amp; Forms
            </p>
            <h1 className="inline-block rounded-full bg-gradient-to-r from-[#ffde00] via-[#eecf02] to-[#efa706] px-5 py-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Standardized Templates
            </h1>
          </div>

          {/* Introduction */}
          <article className="mx-auto max-w-3xl space-y-4 text-center">
            <p className="text-base leading-7 text-neutral-300">
              The Office of the Executive Secretary maintains these mandatory
              standardized administrative templates required by the Rules &amp;
              Procedures. Officers and members may use the "Copy to Clipboard"
              button to easily extract, print, or adapt these forms for official
              Society business.
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
              <strong>Note:</strong> These templates are subject to periodic
              review and updates by the Council of House Chancellors. Always
              ensure you are using the most current version available on this
              page.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}