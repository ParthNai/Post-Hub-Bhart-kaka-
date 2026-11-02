import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getTemplateById, getTemplates } from "@/lib/templates-storage";
import { getCategories } from "@/lib/template-categories-storage";
import { runPrePublishValidation } from "@/lib/template-publishing";
import { PublishingView } from "@/components/admin/templates/publishing/PublishingView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Template Preview & Publishing | Post Hub Admin Panel",
  description: "Review pre-flight validation checklist and publishing readiness.",
};

export default async function TemplatePublishPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const { templateId } = await params;
  const template = getTemplateById(templateId);

  if (!template) {
    notFound();
  }

  const allTemplates = getTemplates();
  const categories = getCategories();
  const { checks, readiness } = runPrePublishValidation(template, categories);

  return (
    <PublishingView
      initialTemplate={template}
      allTemplates={allTemplates}
      initialChecks={checks}
      initialReadiness={readiness}
      revision="v1.2"
    />
  );
}
