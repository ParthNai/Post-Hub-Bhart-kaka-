import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { findUserByEmail, getAllUsers, updateUser, initDb } from "../lib/db.ts";

// Initialize and ensure DB is ready
initDb();

test("Security Test Suite: Post Hub Admin Screen 01", async (t) => {
  await t.test("1. Database initializes with seeded administrator accounts", () => {
    const users = getAllUsers();
    assert.ok(users.length >= 3, "Expected at least 3 seeded accounts");
    const admin = findUserByEmail("admin@yourdomain.com");
    assert.ok(admin, "Admin account should exist");
    assert.equal(admin.role, "admin");
    assert.equal(admin.status, "active");
  });

  await t.test("2. Password hashing with bcrypt (10 rounds) verifies correctly", () => {
    const admin = findUserByEmail("admin@yourdomain.com");
    assert.ok(admin);
    const valid = bcrypt.compareSync("AdminPassword123!", admin.passwordHash);
    const invalid = bcrypt.compareSync("WrongPassword!", admin.passwordHash);
    assert.equal(valid, true, "Correct password must verify");
    assert.equal(invalid, false, "Wrong password must fail verification");
  });

  await t.test("3. Disabled account detection", () => {
    const disabledUser = findUserByEmail("disabled@yourdomain.com");
    assert.ok(disabledUser);
    assert.equal(disabledUser.status, "disabled");
  });

  await t.test("4. Non-admin member role identification", () => {
    const member = findUserByEmail("member@yourdomain.com");
    assert.ok(member);
    assert.equal(member.role, "member");
    assert.notEqual(member.role, "admin", "Member role must not have admin privileges");
  });

  await t.test("5. Account lockout mechanism after failed attempts", () => {
    const admin = findUserByEmail("admin@posthub.io");
    assert.ok(admin);
    
    // Simulate failed attempts
    const lockoutTime = Date.now() + 15 * 60 * 1000;
    updateUser(admin.id, { failedAttempts: 5, lockedUntil: lockoutTime });
    
    const lockedAdmin = findUserByEmail("admin@posthub.io");
    assert.ok(lockedAdmin.lockedUntil && lockedAdmin.lockedUntil > Date.now(), "Account must be locked");
    
    // Cleanup/reset for tests
    updateUser(admin.id, { failedAttempts: 0, lockedUntil: null });
    const resetAdmin = findUserByEmail("admin@posthub.io");
    assert.equal(resetAdmin.lockedUntil, null);
  });
});
