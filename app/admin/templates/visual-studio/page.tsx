import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTemplateById } from "@/lib/templates-storage";
import { VisualTemplateStudio } from "@/components/admin/templates/visual-studio/VisualTemplateStudio";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Visual Slot Studio | Post Hub Admin",
  description:
    "Upload custom AI festival & branding backgrounds, drag-and-drop to place photo slots and dynamic text zones with live real user preview.",
};

export default async function VisualStudioPage({
  searchParams,
}: {
  searchParams?: Promise<{ templateId?: string }>;
}) {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/admin/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const initialTemplate = resolvedParams.templateId
    ? getTemplateById(resolvedParams.templateId) || undefined
    : undefined;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0B0F17",
        color: "#F8FAFC",
      }}
    >
      <VisualTemplateStudio initialTemplate={initialTemplate} />
    </div>
  );
}
