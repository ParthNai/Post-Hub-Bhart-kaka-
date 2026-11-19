import test from "node:test";
import assert from "node:assert/strict";
import { createAppSessionToken, verifyAppSessionToken } from "../lib/app-session.ts";
import { findUserByEmail } from "../lib/db.ts";

test("App authentication tokens are member-only and app-scoped", async (t) => {
  await t.test("active member token can be verified", async () => {
    const member = findUserByEmail("member@yourdomain.com");
    assert.ok(member);

    const token = await createAppSessionToken(member);
    const payload = await verifyAppSessionToken(token);

    assert.deepEqual(payload, {
      userId: member.id,
      email: member.email,
      name: member.name,
      role: "member",
    });
  });

  await t.test("admin cannot receive a mobile app token", async () => {
    const admin = findUserByEmail("admin@yourdomain.com");
    assert.ok(admin);

    await assert.rejects(createAppSessionToken(admin), /Only active members/);
  });

  await t.test("tampered tokens are rejected", async () => {
    const member = findUserByEmail("member@yourdomain.com");
    assert.ok(member);

    const token = await createAppSessionToken(member);
    const tamperedToken = `${token.slice(0, -1)}x`;

    assert.equal(await verifyAppSessionToken(tamperedToken), null);
  });
});
