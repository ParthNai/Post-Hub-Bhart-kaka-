import { WorkerManagementView } from "@/components/admin/ai-generation/workers/WorkerManagementView";

export const metadata = {
  title: "AI Generation Queue Worker Management & Processing Controls | Post Hub Admin",
  description: "Monitor background workers, worker pools, processing capacity and runtime activity.",
};

export default function WorkersPage() {
  return <WorkerManagementView />;
}
