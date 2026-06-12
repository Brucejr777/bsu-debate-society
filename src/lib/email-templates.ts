export function getApprovalEmail(applicantName: string, houseName: string) {
  return {
    subject: "Welcome to the BSU Debate Society!",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; border: 2px solid #D4AF37; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #111111; padding: 30px; text-align: center; border-bottom: 2px solid #D4AF37;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">BSU Debate Society</h1>
          <p style="color: #ffffff; font-size: 14px; margin-top: 10px;">Official Membership Notification</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #D4AF37; font-size: 20px;">Welcome, ${applicantName}!</h2>
          <p style="line-height: 1.6; color: #e0e0e0;">We are pleased to inform you that your membership application has been <strong style="color: #ffffff;">approved</strong>.</p>
          <p style="line-height: 1.6; color: #e0e0e0;">You have been officially accepted into the <strong style="color: #D4AF37;">House of ${houseName}</strong>.</p>
          <div style="background-color: #1a1a1a; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #ffffff;"><strong>Next Steps:</strong></p>
            <ul style="margin: 10px 0 0 20px; padding: 0; font-size: 14px; color: #e0e0e0;">
              <li>Check the official website for the orientation schedule.</li>
              <li>Complete your Executive Internship deployment.</li>
              <li>Connect with your House Council for further instructions.</li>
            </ul>
          </div>
          <p style="line-height: 1.6; color: #e0e0e0;">Welcome to the legacy of <em>Veritas • Ratio • Impactus</em>.</p>
        </div>
        <div style="background-color: #111111; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #333333;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Benguet State University Debate Society</p>
        </div>
      </div>
    `,
  };
}

export function getRejectionEmail(applicantName: string) {
  return {
    subject: "Update on your BSU Debate Society Application",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; border: 2px solid #333333; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #111111; padding: 30px; text-align: center; border-bottom: 2px solid #333333;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">BSU Debate Society</h1>
          <p style="color: #aaaaaa; font-size: 14px; margin-top: 10px;">Official Membership Notification</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #ffffff; font-size: 20px;">Dear ${applicantName},</h2>
          <p style="line-height: 1.6; color: #e0e0e0;">Thank you for your interest in joining the BSU Debate Society and for taking the time to submit your application.</p>
          <p style="line-height: 1.6; color: #e0e0e0;">After careful review by the House Council, we regret to inform you that your application has <strong style="color: #ff6b6b;">not been approved</strong> for this recruitment cycle.</p>
          <p style="line-height: 1.6; color: #e0e0e0;">This decision does not reflect your potential. We encourage you to continue honing your skills and invite you to reapply during our next recruitment period.</p>
          <p style="line-height: 1.6; color: #e0e0e0;">We wish you the best in your academic and personal endeavors.</p>
        </div>
        <div style="background-color: #111111; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #333333;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Benguet State University Debate Society</p>
        </div>
      </div>
    `,
  };
}