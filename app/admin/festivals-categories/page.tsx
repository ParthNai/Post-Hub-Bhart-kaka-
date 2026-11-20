import { Metadata } from "next";
import { FestivalCategoriesDashboardView } from "@/components/admin/festivals/categories/FestivalCategoriesDashboardView";

export const metadata: Metadata = {
  title: "Festival & Event Categories | Post Hub Admin",
  description:
    "Organize, customize and manage festival categories, event classifications, icons and regional content groups.",
};

export default function FestivalsCategoriesAliasPage() {
  return <FestivalCategoriesDashboardView />;
}
