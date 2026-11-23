import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMobileUsers } from "@/lib/mobile-users";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getSession({ allowDevBypass: true });
  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const users = getMobileUsers().sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <main style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "18px" }}>
        <h1 style={{ margin: 0, fontSize: "22px", color: "var(--text)" }}>Mobile App Users</h1>
        <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
          Registered users and their 4-digit login PINs.
        </p>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "12px 14px" }}>Name</th>
              <th style={{ padding: "12px 14px" }}>Mobile</th>
              <th style={{ padding: "12px 14px" }}>PIN</th>
              <th style={{ padding: "12px 14px" }}>Occupation</th>
              <th style={{ padding: "12px 14px" }}>Location</th>
              <th style={{ padding: "12px 14px" }}>Status</th>
              <th style={{ padding: "12px 14px" }}>Registered</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 14px", fontWeight: 700 }}>{user.name}</td>
                <td style={{ padding: "12px 14px" }}>{user.mobile}</td>
                <td style={{ padding: "12px 14px" }}>
                  <code
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: "#FFF7ED",
                      color: "#C2410C",
                      letterSpacing: "3px",
                      fontWeight: 800,
                    }}
                  >
                    {user.pin}
                  </code>
                </td>
                <td style={{ padding: "12px 14px" }}>{user.occupation}</td>
                <td style={{ padding: "12px 14px" }}>
                  {[user.village, user.taluka, user.district].filter(Boolean).join(", ") || "-"}
                </td>
                <td style={{ padding: "12px 14px" }}>{user.status}</td>
                <td style={{ padding: "12px 14px" }}>
                  {new Date(user.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "28px 14px", textAlign: "center", color: "var(--text-muted)" }}>
                  No mobile app users registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
