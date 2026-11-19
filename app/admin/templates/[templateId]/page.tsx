import { redirect } from "next/navigation";

export default async function AdminTemplateDetailsRedirectPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  redirect(`/admin/templates/${templateId}/edit`);
}
