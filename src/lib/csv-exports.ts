/**
 * Exports an array of objects to a CSV file and triggers a browser download.
 *
 * @param data - The array of objects to export.
 * @param filename - The desired filename for the downloaded CSV (e.g., "report.csv").
 */
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string): void {
  if (!data || data.length === 0) {
    console.warn("No data provided for CSV export.");
    return;
  }

  // Extract headers from the keys of the first object
  const headers = Object.keys(data[0]);

  // Helper function to escape CSV fields (wrap in quotes, escape internal quotes)
  const escapeCsvField = (value: any): string => {
    const stringValue = String(value ?? "");
    // Internal quotes must be escaped by doubling them
    const escaped = stringValue.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  // Build CSV rows
  const csvRows: string[] = [];
  
  // Add header row
  csvRows.push(headers.map(escapeCsvField).join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => escapeCsvField(row[header]));
    csvRows.push(values.join(","));
  }

  // Combine rows with newline characters
  const csvContent = csvRows.join("\n");

  // Create a Blob from the CSV content
  // \uFEFF is the Byte Order Mark (BOM) which ensures Excel opens the UTF-8 file correctly
  const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
  
  // Create a temporary link to trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}