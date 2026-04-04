"use server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function submitContactMessage(
  _prevState: { success: boolean; message: string } | null,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { success: false, message: "All fields are required." };
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name, email, subject, message }),
  });

  if (!res.ok) {
    console.error("Contact message insert error:", await res.text());
    return {
      success: false,
      message: "Failed to send. Please try again.",
    };
  }

  return {
    success: true,
    message: "Message sent successfully.",
  };
}
