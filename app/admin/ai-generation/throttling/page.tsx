import { RateLimitsView } from "@/components/admin/ai-generation/rate-limits/RateLimitsView";

export const metadata = {
  title: "AI Generation API Rate Limits & Throttling Configuration | Post Hub Admin",
  description: "Configure request limits, traffic throttling and usage protection across AI generation APIs.",
};

export default function ThrottlingAliasPage() {
  return <RateLimitsView />;
}
