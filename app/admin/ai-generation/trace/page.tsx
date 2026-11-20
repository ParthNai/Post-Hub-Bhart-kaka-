import { JobTraceView } from "@/components/admin/ai-generation/trace/JobTraceView";

export const metadata = {
  title: "AI Generation Queue Job Details & Execution Trace Viewer | Post Hub Admin",
  description: "Inspect individual AI generation jobs, processing stages, worker assignments and execution events.",
};

export default function JobTracePage() {
  return <JobTraceView />;
}
