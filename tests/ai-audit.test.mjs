import test from "node:test";
import assert from "node:assert/strict";
import {
  getAuditDataset,
  getTransactionById,
  queryAuditTransactions,
  queryAuditEvents,
  recordAuditEvent,
  resetAuditData,
} from "../lib/ai-audit-storage.ts";
import { generateAuditReportCsv } from "../lib/ai-audit.ts";

test("Screen 26 — AI Generation Credit Transaction Details & Audit Trail Test Suite", async (t) => {
  // Always reset to canonical reference state before tests
  resetAuditData();

  await t.test("1. Initializes canonical audit summary metrics matching Screen 26 reference specifications", () => {
    const data = getAuditDataset();

    assert.equal(data.summary.totalTransactions, 12480, "Total transactions must be 12,480");
    assert.equal(data.summary.successfulTransactions, 11962, "Successful transactions must be 11,962");
    assert.equal(data.summary.reversedTransactions, 148, "Reversed transactions must be 148");
    assert.equal(data.summary.pendingTransactions, 27, "Pending transactions must be 27");
    assert.equal(data.summary.reportingPeriod, "Last 30 Days");
  });

  await t.test("2. Verifies canonical transaction ledger records and exact balance math", () => {
    const data = getAuditDataset();
    assert.equal(data.transactions.length, 6, "Must contain exactly 6 canonical ledger transactions");

    // TXN-8F21: Ananya Shah
    const tx21 = data.transactions[0];
    assert.equal(tx21.id, "TXN-8F21");
    assert.equal(tx21.userName, "Ananya Shah");
    assert.equal(tx21.transactionType, "Credit Purchase");
    assert.equal(tx21.creditChange, 500);
    assert.equal(tx21.previousBalance, 120);
    assert.equal(tx21.resultingBalance, 620);
    assert.equal(tx21.previousBalance + tx21.creditChange, tx21.resultingBalance, "120 + 500 = 620");
    assert.equal(tx21.source, "Razorpay");
    assert.equal(tx21.date, "19 Nov 10:42");
    assert.equal(tx21.status, "Successful");

    // TXN-8F20: Rahul Mehta
    const tx20 = data.transactions[1];
    assert.equal(tx20.id, "TXN-8F20");
    assert.equal(tx20.userName, "Rahul Mehta");
    assert.equal(tx20.transactionType, "AI Generation Usage");
    assert.equal(tx20.creditChange, -25);
    assert.equal(tx20.previousBalance, 620);
    assert.equal(tx20.resultingBalance, 595);
    assert.equal(tx20.previousBalance + tx20.creditChange, tx20.resultingBalance, "620 - 25 = 595");
    assert.equal(tx20.source, "Generation");
    assert.equal(tx20.status, "Successful");

    // TXN-8F19: Neha Patel
    const tx19 = data.transactions[2];
    assert.equal(tx19.id, "TXN-8F19");
    assert.equal(tx19.previousBalance + tx19.creditChange, tx19.resultingBalance, "520 + 100 = 620");

    // TXN-8F18: Dev Joshi
    const tx18 = data.transactions[3];
    assert.equal(tx18.id, "TXN-8F18");
    assert.equal(tx18.previousBalance + tx18.creditChange, tx18.resultingBalance, "320 + 200 = 520");

    // TXN-8F17: Ananya Shah (Reversal)
    const tx17 = data.transactions[4];
    assert.equal(tx17.id, "TXN-8F17");
    assert.equal(tx17.status, "Reversed");
    assert.equal(tx17.previousBalance + tx17.creditChange, tx17.resultingBalance, "95 + 25 = 120");

    // TXN-8F16: Rahul Mehta (Expiry)
    const tx16 = data.transactions[5];
    assert.equal(tx16.id, "TXN-8F16");
    assert.equal(tx16.creditChange, -10);
    assert.equal(tx16.previousBalance + tx16.creditChange, tx16.resultingBalance, "210 - 10 = 200");
  });

  await t.test("3. Verifies transaction detail view and credit movement timeline for TXN-8F20", () => {
    const tx = getTransactionById("TXN-8F20");
    assert.ok(tx, "TXN-8F20 must exist");
    assert.equal(tx.userName, "Rahul Mehta");
    assert.equal(tx.userId, "usr_20481");
    assert.equal(tx.transactionType, "AI Generation Usage");
    assert.equal(tx.creditChange, -25);
    assert.equal(tx.previousBalance, 620);
    assert.equal(tx.resultingBalance, 595);
    assert.equal(tx.fullDateTime, "19 Nov 2026 10:38:24 AM");
    assert.equal(tx.status, "Successful");
    assert.equal(tx.relatedRequest, "GEN-7C91");
    assert.equal(tx.note, "Credits deducted after successful image generation.");

    // Verify 5 timeline steps
    assert.equal(tx.timeline.length, 5, "Timeline must contain 5 steps");
    assert.equal(tx.timeline[0].title, "Transaction Initiated");
    assert.equal(tx.timeline[0].timestamp, "19 Nov 10:38:20 AM");
    assert.equal(tx.timeline[1].title, "Validation Completed");
    assert.equal(tx.timeline[2].title, "Ledger Entry Recorded");
    assert.equal(tx.timeline[3].title, "Balance Updated");
    assert.equal(tx.timeline[4].title, "Final Status: Successful");
    assert.equal(tx.timeline[4].timestamp, "19 Nov 10:38:24 AM");
  });

  await t.test("4. Verifies administrative audit history records and recording new audit events", () => {
    const data = getAuditDataset();
    assert.ok(data.auditEvents.length >= 1, "Must contain audit events");

    const aud381 = data.auditEvents.find((e) => e.id === "AUD-00381");
    assert.ok(aud381, "AUD-00381 must exist");
    assert.equal(aud381.administrator, "admin.ops@posthub");
    assert.equal(aud381.actionPerformed, "Grant Credits");
    assert.equal(aud381.targetEntity, "usr_20481");
    assert.equal(aud381.previousValue, 100);
    assert.equal(aud381.newValue, 200);
    assert.equal(aud381.reason, "Customer support adjustment");
    assert.equal(aud381.timestamp, "19 Nov 10:32");

    // Record new audit action
    const newEvt = recordAuditEvent({
      administrator: "security.lead@posthub",
      actionPerformed: "Revoke API Key",
      targetEntity: "usr_20481",
      previousValue: "Active",
      newValue: "Revoked",
      reason: "Suspicious activity flagged",
    });

    assert.ok(newEvt.id.startsWith("AUD-"));
    assert.equal(newEvt.actionPerformed, "Revoke API Key");

    // Query audit events
    const queried = queryAuditEvents({ admin: "security.lead" });
    assert.ok(queried.length >= 1);

    resetAuditData();
  });

  await t.test("5. Queries and filters transactions across multiple dimensions", () => {
    // Search by ID
    const byId = queryAuditTransactions({ searchId: "8F20" });
    assert.equal(byId.length, 1);
    assert.equal(byId[0].id, "TXN-8F20");

    // Search by user
    const byUser = queryAuditTransactions({ searchUser: "Rahul" });
    assert.equal(byUser.length, 2);

    // Filter by type
    const byType = queryAuditTransactions({ type: "Credit Purchase" });
    assert.equal(byType.length, 1);
    assert.equal(byType[0].userName, "Ananya Shah");

    // Filter by status
    const byStatus = queryAuditTransactions({ status: "Reversed" });
    assert.equal(byStatus.length, 1);
    assert.equal(byStatus[0].id, "TXN-8F17");

    // Filter by source
    const bySource = queryAuditTransactions({ source: "Razorpay" });
    assert.equal(bySource.length, 1);
  });

  await t.test("6. Generates valid CSV export combining administrative audit and credit transactions", () => {
    const data = getAuditDataset();
    const csv = generateAuditReportCsv(data.auditEvents, data.transactions);

    assert.ok(csv.includes("Credit Transactions & Administrative Audit Report"));
    assert.ok(csv.includes("--- Administrative Audit Events ---"));
    assert.ok(csv.includes("AUD-00381"));
    assert.ok(csv.includes("admin.ops@posthub"));
    assert.ok(csv.includes("--- Credit Transactions Ledger ---"));
    assert.ok(csv.includes("TXN-8F20"));
    assert.ok(csv.includes("-25"));
    assert.ok(csv.includes("GEN-7C91"));
  });
});
