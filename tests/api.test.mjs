import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://localhost:3000";

test("API Endpoints & Authentication States Verification", async (t) => {
  await t.test("State 1: Empty-field validation", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "", password: "" }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
    assert.equal(data.field, "email");
  });

  await t.test("State 2: Invalid email format", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid-email-address", password: "SomePassword123!" }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.match(data.error, /valid email/i);
  });

  await t.test("State 3: Missing password", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@yourdomain.com", password: "" }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.field, "password");
  });

  await t.test("State 4: Incorrect credentials returns generic message", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@yourdomain.com", password: "IncorrectPassword123!" }),
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.error, "Invalid email or password.");
  });

  await t.test("State 5: Account disabled returns deactivated message", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "disabled@yourdomain.com", password: "AdminPassword123!" }),
    });
    assert.equal(res.status, 403);
    const data = await res.json();
    assert.equal(data.code, "ACCOUNT_DISABLED");
  });

  await t.test("State 6: Non-admin member denied entry", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "member@yourdomain.com", password: "MemberPassword123!" }),
    });
    assert.equal(res.status, 403);
    const data = await res.json();
    assert.equal(data.code, "FORBIDDEN");
  });

  await t.test("State 7: Successful admin authentication & cookie assignment", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@yourdomain.com",
        password: "AdminPassword123!",
        rememberMe: true,
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.redirectUrl, "/admin/dashboard");
    assert.equal(data.user.email, "admin@yourdomain.com");
    assert.equal(data.user.role, "admin");

    const setCookie = res.headers.get("set-cookie");
    assert.ok(setCookie, "Session cookie must be set");
    assert.match(setCookie, /posthub_admin_session/);
    assert.match(setCookie, /HttpOnly/i);
  });

  await t.test("State 8: Forgot password flow generates secure recovery token", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@yourdomain.com" }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.message);
  });

  await t.test("State 9: System setup and diagnostics endpoint responds", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/setup-status`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.configured, true);
    assert.ok(data.demoAccounts.length >= 3);
  });
});
