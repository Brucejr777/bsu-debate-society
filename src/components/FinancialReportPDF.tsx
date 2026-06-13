"use client";

import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

export interface FinancialRecord {
  id: number;
  created_at: string;
  record_type: string;
  period_start: string;
  period_end: string;
  opening_balance: number;
  income_total: number;
  expenses_total: number;
  closing_balance: number;
  income_breakdown: string | null;
  expense_breakdown: string | null;
  notable_transactions: string | null;
  notes: string | null;
  published: boolean;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  header: { marginBottom: 20, borderBottom: "1px solid #000", paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 5, color: "#111" },
  subtitle: { fontSize: 12, color: "#555" },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 10, backgroundColor: "#f0f0f0", padding: 5 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5, fontSize: 10 },
  label: { fontWeight: "bold", color: "#333" },
  value: { color: "#000" },
  text: { fontSize: 10, color: "#333", lineHeight: 1.5 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", fontSize: 8, color: "#888", borderTop: "1px solid #ccc", paddingTop: 10 },
});

const FinancialReportDocument = ({ records }: { records: FinancialRecord[] }) => {
  const sortedRecords = [...records].sort((a, b) => new Date(a.period_start).getTime() - new Date(b.period_start).getTime());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>BSU Debate Society</Text>
          <Text style={styles.subtitle}>Semester Financial Report</Text>
          <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()}</Text>
        </View>

        {sortedRecords.map((record) => (
          <View key={record.id} style={styles.section} wrap={false}>
            <View style={styles.sectionTitle}>
              <Text>
                {record.record_type === "report" ? "Semester Report" : "Monthly Snapshot"}:{" "}
                {new Date(record.period_start).toLocaleDateString()} - {new Date(record.period_end).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>Opening Balance:</Text>
              <Text style={styles.value}>₱{record.opening_balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Income:</Text>
              <Text style={styles.value}>₱{record.income_total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total Expenses:</Text>
              <Text style={styles.value}>₱{record.expenses_total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Closing Balance:</Text>
              <Text style={styles.value}>₱{record.closing_balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</Text>
            </View>

            {record.income_breakdown && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>Income Breakdown:</Text>
                <Text style={styles.text}>{record.income_breakdown}</Text>
              </View>
            )}

            {record.expense_breakdown && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>Expense Breakdown:</Text>
                <Text style={styles.text}>{record.expense_breakdown}</Text>
              </View>
            )}

            {record.notable_transactions && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>Notable Transactions:</Text>
                <Text style={styles.text}>{record.notable_transactions}</Text>
              </View>
            )}
          </View>
        ))}

        <Text style={styles.footer}>
          BSU Debate Society • Official Financial Record • Confidential
        </Text>
      </Page>
    </Document>
  );
};

export async function downloadFinancialReportPDF(records: FinancialRecord[]) {
  if (records.length === 0) return;
  const blob = await pdf(<FinancialReportDocument records={records} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `BSU_Debate_Society_Financial_Report_${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}