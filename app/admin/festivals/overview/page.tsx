import { Metadata } from "next";
import { FestivalsDashboardView } from "@/components/admin/festivals/FestivalsDashboardView";

export const metadata: Metadata = {
  title: "Festivals & Events Overview | Post Hub Admin",
  description:
    "Manage festivals, national holidays, religious occasions, business events and yearly celebration content across Post Hub.",
};

export default function FestivalsOverviewPage() {
  return <FestivalsDashboardView />;
}
