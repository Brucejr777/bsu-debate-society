export interface MeetingData {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationHours?: number; // Default: 2 hours
  venue?: string | null;
  virtualLink?: string | null;
  agenda?: string | null;
}

/**
 * Formats a JavaScript Date object to iCalendar local time format: YYYYMMDDTHHMMSS
 */
function formatIcsDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

/**
 * Escapes special characters in iCalendar text fields as per RFC 5545
 */
function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generates a standard .ics calendar string from meeting data
 */
export function generateIcs(meeting: MeetingData): string {
  const startDate = new Date(`${meeting.date}T${meeting.time}`);
  const durationMs = (meeting.durationHours ?? 2) * 60 * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationMs);

  const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@bsu-debate-society.org`;
  const dtstamp = formatIcsDate(new Date());
  const dtstart = formatIcsDate(startDate);
  const dtend = formatIcsDate(endDate);

  // Combine venue and virtual link for the location field
  let location = meeting.venue || "";
  if (meeting.virtualLink) {
    location = location ? `${location} | ${meeting.virtualLink}` : meeting.virtualLink;
    location = `Virtual/Hybrid: ${location}`;
  }

  // Build description with agenda and virtual link fallback
  let description = meeting.agenda || "No agenda provided for this meeting.";
  if (meeting.virtualLink) {
    description += `\n\nJoin via Virtual Link: ${meeting.virtualLink}`;
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BSU Debate Society//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeText(meeting.title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return icsContent;
}

/**
 * Triggers a browser download of the generated .ics file
 */
export function downloadIcs(meeting: MeetingData, filename?: string) {
  const icsContent = generateIcs(meeting);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename || `bsu-meeting-${meeting.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the object URL
  URL.revokeObjectURL(url);
}