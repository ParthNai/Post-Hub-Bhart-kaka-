import { RequestLogsView } from "@/components/admin/ai-generation/logs/RequestLogsView";

export const metadata = {
  title: "AI Generation Request Logs & API Activity Monitor | Post Hub Admin",
  description: "Monitor generation requests, backend API activity, response status, latency and request-level errors.",
};

export default function RequestLogsAliasPage() {
  return <RequestLogsView />;
}
