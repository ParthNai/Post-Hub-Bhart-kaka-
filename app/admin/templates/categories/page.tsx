import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCategoriesWithMetrics } from "@/lib/template-categories-storage";
import { CategoriesView } from "@/components/admin/templates/categories/CategoriesView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Template Categories | Post Hub Admin Panel",
  description: "Organize poster templates with consistent categories and clear ownership.",
};

export default async function TemplateCategoriesPage() {
  const session = await getSession({ allowDevBypass: true });

  if (!session || (session.role !== "admin" && session.role !== "superadmin")) {
    redirect("/");
  }

  const { categories, metrics } = getCategoriesWithMetrics();

  return (
    <CategoriesView
      initialCategories={categories}
      initialMetrics={metrics}
    />
  );
}

