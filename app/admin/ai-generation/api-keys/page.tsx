import { Metadata } from "next";
import { CredentialsView } from "@/components/admin/ai-generation/credentials/CredentialsView";

export const metadata: Metadata = {
  title: "API Keys Management | Post Hub Admin",
  description:
    "Securely manage AI provider credentials, key rotation, credential access and integration status.",
};

export default function ApiKeysPage() {
  return <CredentialsView />;
}
