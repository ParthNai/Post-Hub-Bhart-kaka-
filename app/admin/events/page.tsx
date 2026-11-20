import { Metadata } from "next";
import { FestivalsDashboardView } from "@/components/admin/festivals/FestivalsDashboardView";

export const metadata: Metadata = {
  title: "Events Management | Post Hub Admin",
  description:
    "Manage festivals, national holidays, religious occasions, business events and yearly celebration content across Post Hub.",
};

export default function EventsPage() {
  return <FestivalsDashboardView />;
}
