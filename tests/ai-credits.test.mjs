import test from "node:test";
import assert from "node:assert/strict";
import {
  getCreditDataset,
  allocateUserCredits,
  createCreditPlan,
  updateCreditPlan,
  duplicateCreditPlan,
  archiveCreditPlan,
  togglePlanStatus,
  getCreditSettings,
  updateCreditSettings,
  queryUsers,
  queryTransactions,
  resetCreditData,
} from "../lib/ai-credits-storage.ts";
import {
  formatCredits,
  generateTransactionsCsv,
  generateUserCreditsCsv,
} from "../lib/ai-credits.ts";

test("Screen 25 — AI Generation Credit Plans & User Allocation Test Suite", async (t) => {
  // Always reset to canonical reference state before tests
  resetCreditData();

  await t.test("1. Initializes canonical credit summary metrics matching Screen 25 reference specifications", () => {
    const data = getCreditDataset();

    assert.equal(data.summary.activeCreditPlans, 4, "Active credit plans must be 4");
    assert.equal(data.summary.activePlansChange, "+1");
    assert.equal(data.summary.totalCreditsIssued, 125000, "Total credits issued must be 125,000");
    assert.equal(data.summary.totalCreditsChange, "+12.5%");
    assert.equal(data.summary.creditsConsumed, 98750, "Credits consumed must be 98,750");
    assert.equal(data.summary.creditsConsumedChange, "+11.2%");
    assert.equal(data.summary.creditsRemaining, 26250, "Credits remaining must be 26,250");
    assert.equal(data.summary.creditsRemainingChange, "+8.7%");

    // Mathematical reconciliation check
    assert.equal(
      data.summary.totalCreditsIssued - data.summary.creditsConsumed,
      data.summary.creditsRemaining,
      "Issued minus consumed must exactly equal remaining"
    );

    // Number formatting helper
    assert.equal(formatCredits(125000, true), "1,25,000", "Indian format check for 125000");
    assert.equal(formatCredits(98750), "98,750");
  });

  await t.test("2. Verifies canonical credit plans matching reference table", () => {
    const data = getCreditDataset();
    assert.equal(data.plans.length, 4, "Must contain exactly 4 canonical plans");

    const starter = data.plans.find((p) => p.name === "Starter");
    assert.ok(starter, "Starter plan must exist");
    assert.equal(starter.creditQuantity, 500);
    assert.equal(starter.validityDays, 30);
    assert.equal(starter.planType, "One-time");
    assert.equal(starter.status, "Active");
    assert.equal(starter.updatedAt, "Oct 28, 2025");

    const creator = data.plans.find((p) => p.name === "Creator");
    assert.ok(creator, "Creator plan must exist");
    assert.equal(creator.creditQuantity, 1500);
    assert.equal(creator.validityDays, 90);
    assert.equal(creator.planType, "One-time");
    assert.equal(creator.status, "Active");
    assert.equal(creator.updatedAt, "Oct 25, 2025");

    const pro = data.plans.find((p) => p.name === "Professional");
    assert.ok(pro, "Professional plan must exist");
    assert.equal(pro.creditQuantity, 5000);
    assert.equal(pro.validityDays, 180);
    assert.equal(pro.planType, "One-time");
    assert.equal(pro.status, "Draft");
    assert.equal(pro.updatedAt, "Oct 20, 2025");

    const business = data.plans.find((p) => p.name === "Business");
    assert.ok(business, "Business plan must exist");
    assert.equal(business.creditQuantity, 12000);
    assert.equal(business.validityDays, 365);
    assert.equal(business.planType, "Recurring");
    assert.equal(business.status, "Archived");
    assert.equal(business.updatedAt, "Sep 15, 2025");
  });

  await t.test("3. Verifies canonical user credit accounts and source balances", () => {
    const data = getCreditDataset();
    assert.equal(data.users.length, 4, "Must contain 4 users");

    const priya = data.users.find((u) => u.name === "Priya Shah");
    assert.ok(priya);
    assert.equal(priya.email, "priya.shah@email.com");
    assert.equal(priya.avatarInitials, "PK");
    assert.equal(priya.purchasedCredits, 10000);
    assert.equal(priya.promotionalCredits, 1000);
    assert.equal(priya.adminGrantedCredits, 500);
    assert.equal(priya.creditsUsed, 7250);
    assert.equal(priya.availableBalance, 3250);

    const rohit = data.users.find((u) => u.name === "Rohit Sharma");
    assert.ok(rohit);
    assert.equal(rohit.email, "rohit@mail.com");
    assert.equal(rohit.avatarInitials, "RS");
    assert.equal(rohit.purchasedCredits, 5000);
    assert.equal(rohit.promotionalCredits, 0);
    assert.equal(rohit.adminGrantedCredits, 500);
    assert.equal(rohit.creditsUsed, 3200);
    assert.equal(rohit.availableBalance, 2300);
    assert.equal(
      rohit.purchasedCredits + rohit.promotionalCredits + rohit.adminGrantedCredits - rohit.creditsUsed,
      rohit.availableBalance,
      "Rohit Sharma balance math must match"
    );

    const dhruv = data.users.find((u) => u.name === "Dhruv Mehta");
    assert.ok(dhruv);
    assert.equal(dhruv.availableBalance, 1400);

    const anita = data.users.find((u) => u.name === "Anita Singh");
    assert.ok(anita);
    assert.equal(anita.availableBalance, 200);
  });

  await t.test("4. Verifies recent transactions matching reference table", () => {
    const data = getCreditDataset();
    assert.equal(data.transactions.length, 4);

    const txn1 = data.transactions[0];
    assert.equal(txn1.id, "TXN-20251031-001");
    assert.equal(txn1.userName, "Priya Shah");
    assert.equal(txn1.transactionType, "Credit Purchase");
    assert.equal(txn1.creditChange, 5000);
    assert.equal(txn1.source, "Razorpay");
    assert.equal(txn1.date, "Oct 31, 2025, 2:45 PM");
    assert.equal(txn1.status, "Completed");

    const txn2 = data.transactions[1];
    assert.equal(txn2.id, "TXN-20251030-002");
    assert.equal(txn2.userName, "Rohit Sharma");
    assert.equal(txn2.transactionType, "Usage");
    assert.equal(txn2.creditChange, -1200);
    assert.equal(txn2.source, "AI Generation");
    assert.equal(txn2.status, "Success");

    const txn3 = data.transactions[2];
    assert.equal(txn3.id, "TXN-20251028-003");
    assert.equal(txn3.transactionType, "Promotional Grant");
    assert.equal(txn3.creditChange, 500);
    assert.equal(txn3.source, "Campaign");

    const txn4 = data.transactions[3];
    assert.equal(txn4.id, "TXN-20251027-004");
    assert.equal(txn4.transactionType, "Refund");
    assert.equal(txn4.creditChange, 1000);
    assert.equal(txn4.source, "Support");
  });

  await t.test("5. Performs atomic credit allocation with ledger transaction and balance updates", () => {
    const initialData = getCreditDataset();
    const initialIssued = initialData.summary.totalCreditsIssued;
    const initialRemaining = initialData.summary.creditsRemaining;

    // Allocate 500 promotional credits to Rohit Sharma
    const result = allocateUserCredits({
      userId: "usr-rohit",
      source: "Promotional Credits",
      amount: 500,
      reason: "Special campaign for active users.",
      adminName: "JD Admin",
      idempotencyKey: "test-alloc-rohit-001",
    });

    assert.equal(result.success, true);
    assert.equal(result.user.promotionalCredits, 500, "Promotional credits must increase to 500");
    assert.equal(result.user.availableBalance, 2800, "Balance must increase by 500 (2300 + 500 = 2800)");
    assert.equal(result.transaction.creditChange, 500);
    assert.equal(result.transaction.transactionType, "Promotional Grant");
    assert.equal(result.transaction.source, "Campaign");
    assert.equal(result.transaction.reason, "Special campaign for active users.");

    // Summary metrics check
    assert.equal(result.summary.totalCreditsIssued, initialIssued + 500);
    assert.equal(result.summary.creditsRemaining, initialRemaining + 500);

    // Idempotency test: duplicate call with same idempotencyKey should return existing transaction
    const dupResult = allocateUserCredits({
      userId: "usr-rohit",
      source: "Promotional Credits",
      amount: 500,
      reason: "Special campaign for active users.",
      adminName: "JD Admin",
      idempotencyKey: "test-alloc-rohit-001",
    });
    assert.equal(dupResult.transaction.id, result.transaction.id, "Idempotent allocation must not duplicate");
    assert.equal(dupResult.user.availableBalance, 2800, "Balance must remain 2800 without double counting");

    // Allocate 300 admin granted credits to Anita Singh
    const anitaResult = allocateUserCredits({
      userId: "usr-anita",
      source: "Admin Granted",
      amount: 300,
      reason: "Manual compensation for support resolution.",
      adminName: "JD Admin",
    });
    assert.equal(anitaResult.user.adminGrantedCredits, 300);
    assert.equal(anitaResult.user.availableBalance, 500, "Anita balance must become 200 + 300 = 500");
    assert.equal(anitaResult.transaction.transactionType, "Admin Adjustment");
    assert.equal(anitaResult.transaction.source, "Admin");

    // Validation checks
    assert.throws(() => {
      allocateUserCredits({
        userId: "non-existent-user",
        source: "Promotional Credits",
        amount: 100,
        reason: "Test",
      });
    }, /not found/);

    assert.throws(() => {
      allocateUserCredits({
        userId: "usr-rohit",
        source: "Promotional Credits",
        amount: -50,
        reason: "Negative amount",
      });
    }, /positive/);

    assert.throws(() => {
      allocateUserCredits({
        userId: "usr-rohit",
        source: "Promotional Credits",
        amount: 100,
        reason: " ",
      });
    }, /mandatory/);

    // Reset back to clean canonical state
    resetCreditData();
  });

  await t.test("6. Performs credit plan management operations (create, update, duplicate, toggle, archive)", () => {
    // 1. Create Plan
    const newPlan = createCreditPlan({
      name: "Enterprise Custom",
      description: "Tailored enterprise credit allocation.",
      creditQuantity: 25000,
      validityDays: 365,
      planType: "Recurring",
      status: "Active",
      visibility: "Private",
      price: 299.99,
      currency: "USD",
    });

    assert.ok(newPlan.id);
    assert.equal(newPlan.name, "Enterprise Custom");
    assert.equal(newPlan.creditQuantity, 25000);

    // 2. Duplicate Plan
    const duplicate = duplicateCreditPlan(newPlan.id);
    assert.ok(duplicate.id);
    assert.equal(duplicate.name, "Enterprise Custom (Copy)");
    assert.equal(duplicate.status, "Draft");

    // 3. Update Plan
    const updated = updateCreditPlan(newPlan.id, {
      description: "Updated enterprise allocation with priority SLA.",
      price: 349.99,
    });
    assert.equal(updated.price, 349.99);

    // 4. Toggle Status
    const toggled = togglePlanStatus(newPlan.id);
    assert.equal(toggled.status, "Draft");

    // 5. Archive Plan
    const archived = archiveCreditPlan(newPlan.id);
    assert.equal(archived.status, "Archived");

    // Reset back
    resetCreditData();
  });

  await t.test("7. Retrieves and updates credit system configuration settings", () => {
    const settings = getCreditSettings();
    assert.equal(settings.defaultCostPerImage, 1);
    assert.equal(settings.promotionalExpiryDays, 90);
    assert.equal(settings.refundOnFailure, true);

    const updated = updateCreditSettings({
      defaultCostPerImage: 2,
      promotionalExpiryDays: 60,
    });
    assert.equal(updated.defaultCostPerImage, 2);
    assert.equal(updated.promotionalExpiryDays, 60);

    resetCreditData();
  });

  await t.test("8. Generates valid CSV exports for transactions and user accounts and verifies queries", () => {
    const data = getCreditDataset();

    // Query test
    const queriedUsers = queryUsers("Priya");
    assert.equal(queriedUsers.length, 1);
    assert.equal(queriedUsers[0].name, "Priya Shah");

    const queriedTx = queryTransactions("Razorpay");
    assert.equal(queriedTx.length, 1);
    assert.equal(queriedTx[0].source, "Razorpay");

    const txCsv = generateTransactionsCsv(data.transactions);
    assert.ok(txCsv.includes("Transaction ID,User,Account / Email"));
    assert.ok(txCsv.includes("TXN-20251031-001"));
    assert.ok(txCsv.includes("Priya Shah"));
    assert.ok(txCsv.includes("Razorpay"));

    const userCsv = generateUserCreditsCsv(data.users);
    assert.ok(userCsv.includes("User ID,User,Account / Email"));
    assert.ok(userCsv.includes("Rohit Sharma"));
    assert.ok(userCsv.includes("rohit@mail.com"));
    assert.ok(userCsv.includes("2300"));
  });
});
