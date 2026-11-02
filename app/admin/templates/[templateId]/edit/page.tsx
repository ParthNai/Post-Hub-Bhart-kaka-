import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getTemplateById } from "@/lib/templates-storage";
import { TemplateEditorView } from "@/components/admin/templates/editor/TemplateEditorView";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);

  return {
    title: template
      ? `${template.name} — Editor | Post Hub Admin`
      : "Template Editor | Post Hub Admin",
    description: "Review and edit template properties, formats, and poster assets.",
  };
}

export default async function AdminTemplateEditPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/admin/login");
  }

  const { templateId } = await params;
  const template = getTemplateById(templateId);

  // If template does not exist, display honest not found state
  if (!template) {
    return (
      <div
        style={{
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            backgroundColor: "#FEF2F2",
            color: "#DC2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text, #24213A)",
            margin: "0 0 8px 0",
          }}
        >
          Template Not Found
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted, #777184)",
            maxWidth: "460px",
            margin: "0 0 24px 0",
            lineHeight: "1.5",
          }}
        >
          We couldn&apos;t find a template with the ID <strong>&quot;{templateId}&quot;</strong>. It may have been deleted,
          moved, or the URL might be incorrect.
        </p>

        <Link
          href="/admin/templates"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--primary, #7956C9)",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: "13.5px",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 2px 6px rgba(121, 86, 201, 0.25)",
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Templates</span>
        </Link>
      </div>
    );
  }

  return <TemplateEditorView initialTemplate={template} />;
}
