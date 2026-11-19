import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = "http://localhost:3000";

test("API Endpoints & Authentication States Verification", async (t) => {
  let appAccessToken;

  await t.test("App member login returns a bearer token", async () => {
    const res = await fetch(`${BASE_URL}/api/app/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "member@yourdomain.com",
        password: "MemberPassword123!",
      }),
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.tokenType, "Bearer");
    assert.equal(data.user.role, "member");
    assert.ok(data.token);
    appAccessToken = data.token;
  });

  await t.test("App bearer token authenticates only the app user endpoint", async () => {
    const appRes = await fetch(`${BASE_URL}/api/app/auth/me`, {
      headers: { Authorization: `Bearer ${appAccessToken}` },
    });
    assert.equal(appRes.status, 200);
    const appData = await appRes.json();
    assert.equal(appData.authenticated, true);
    assert.equal(appData.user.role, "member");

    const adminRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${appAccessToken}` },
    });
    assert.equal(adminRes.status, 401);
  });

  await t.test("App login rejects a non-object request body", async () => {
    const res = await fetch(`${BASE_URL}/api/app/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(null),
    });

    assert.equal(res.status, 400);
  });

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
