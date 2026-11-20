import { QueuePriorityView } from "@/components/admin/ai-generation/queue-priority/QueuePriorityView";

export const metadata = {
  title: "AI Generation Queue Priority & Scheduling | Post Hub Admin",
  description: "Manage AI generation request priorities, processing capacity and scheduling policies.",
};

export default function QueuePriorityPage() {
  return <QueuePriorityView />;
}
