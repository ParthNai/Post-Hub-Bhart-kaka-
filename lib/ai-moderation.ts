export type ModerationSeverity = "High" | "Medium" | "Low";

export type ModerationAction =
  | "Reject"
  | "Flag for Review"
  | "Allow"
  | "Escalate to Manual Review";

export type ModerationDetectionSource =
  | "Vision AI"
  | "Vision AI + NLP"
  | "NLP / Text Filter"
  | "Hash Match / Blocklist";

export type CategoryResultingAction = "Reject" | "Flag" | "Allow";

export interface ModerationCategory {
  id: string;
  name: string;
  description: string;
  iconType:
    | "unsafe"
    | "explicit"
    | "hate"
    | "violence"
    | "copyright"
    | "misleading"
    | "sensitive"
    | "other";
  enabled: boolean;
  reviewRequired: boolean;
  resultingAction: CategoryResultingAction;
  lastUpdated?: string;
}

export interface AutomaticModerationRule {
  id: string;
  name: string;
  triggerCondition: string;
  detectionSource: ModerationDetectionSource;
  severity: ModerationSeverity;
  resultingAction: ModerationAction;
  enabled: boolean;
  description?: string;
  order?: number;
}

export interface RejectionReason {
  id: string;
  category: string;
  description: string;
  status: "Active" | "Disabled";
  createdAt?: string;
  usageCount?: number;
}

export interface GlobalModerationSettings {
  enableModerationWorkflow: boolean;
  automaticModerationAvailability: boolean;
  manualReviewRequirement: boolean;
  defaultModerationBehavior:
    | "Flag for Review"
    | "Allow"
    | "Reject"
    | "Escalate to Manual Review";
  unknownResultHandling:
    | "Treat as Suspicious"
    | "Flag for Review"
    | "Reject"
    | "Allow with Warning";
  policyVersion: string;
  lastUpdated: string;
  status: "live" | "draft";
}

export interface ManualReviewConfiguration {
  reviewRequiredConditions:
    | "On Policy Violation or Uncertain Result"
    | "All Flagged Content"
    | "Random Sample 10%"
    | "Always";
  reviewerRole:
    | "Content Moderator"
    | "Senior Administrator"
    | "Compliance Officer";
  reviewPriority:
    | "High for Harmful Content"
    | "Standard FIFO"
    | "High for Enterprise Users";
  escalationRules:
    | "After 24 Hours"
    | "After 12 Hours"
    | "After 48 Hours"
    | "Immediate for Critical";
  reviewDecisionRequired: boolean;
}

export interface UnknownErrorHandling {
  serviceUnavailable:
    | "Allow with Warning"
    | "Flag for Review"
    | "Reject"
    | "Retry Then Reject";
  timeout: "Flag for Review" | "Reject" | "Allow with Warning";
  inconclusiveResult: "Flag for Review" | "Reject" | "Treat as Suspicious";
  unsupportedFormat: "Reject" | "Flag for Review" | "Allow";
  missingResponse: "Flag for Review" | "Reject" | "Allow with Warning";
}

export interface ModerationKpiMetrics {
  activePolicies: number;
  activePoliciesChange: string;
  enabledChecks: number;
  enabledChecksChange: string;
  pendingReviewRules: number;
  pendingReviewRulesChange: string;
  lastPolicyUpdate: string;
  policyStatusBadge: string;
}

export interface ModerationPolicyRevision {
  id: string;
  version: string;
  timestamp: string;
  updatedBy: string;
  summary: string;
  globals: GlobalModerationSettings;
  categories: ModerationCategory[];
  rules: AutomaticModerationRule[];
  reasons: RejectionReason[];
  manualReview: ManualReviewConfiguration;
  errorHandling: UnknownErrorHandling;
}

export interface ModerationPolicyConfiguration {
  globals: GlobalModerationSettings;
  categories: ModerationCategory[];
  rules: AutomaticModerationRule[];
  reasons: RejectionReason[];
  manualReview: ManualReviewConfiguration;
  errorHandling: UnknownErrorHandling;
  metrics: ModerationKpiMetrics;
  versionHistory: ModerationPolicyRevision[];
}

/**
 * Canonical 8 Categories matching Screen 23 reference photo
 */
export const CANONICAL_CATEGORIES: ModerationCategory[] = [
  {
    id: "cat-unsafe",
    name: "Unsafe or Harmful Imagery",
    description: "Blocks dangerous content.",
    iconType: "unsafe",
    enabled: true,
    reviewRequired: true,
    resultingAction: "Reject",
    lastUpdated: "Nov 2, 2025 • 4:30 PM",
  },
  {
    id: "cat-explicit",
    name: "Explicit or Adult Content",
    description: "Restricts adult content.",
    iconType: "explicit",
    enabled: true,
    reviewRequired: true,
    resultingAction: "Reject",
    lastUpdated: "Nov 2, 2025 • 4:30 PM",
  },
  {
    id: "cat-hate",
    name: "Hate or Harassment",
    description: "Prevents hate content.",
    iconType: "hate",
    enabled: true,
    reviewRequired: true,
    resultingAction: "Flag",
    lastUpdated: "Nov 2, 2025 • 4:30 PM",
  },
  {
    id: "cat-violence",
    name: "Violent or Disturbing Imagery",
    description: "Blocks violent content.",
    iconType: "violence",
    enabled: true,
    reviewRequired: true,
    resultingAction: "Reject",
    lastUpdated: "Nov 2, 2025 • 4:30 PM",
  },
  {
    id: "cat-copyright",
    name: "Copyright & Brand Misuse",
    description: "Protects IP rights.",
    iconType: "copyright",
    enabled: true,
    reviewRequired: true,
    resultingAction: "Flag",
    lastUpdated: "Nov 2, 2025 • 4:30 PM",
  },
  {
    id: "cat-misleading",
    name: "Misleading or Fraudulent Content",
    description: "Prevents scams.",
    iconType: "misleading",
    enabled: true,
    reviewRequired: true,
    resultingAction: "Flag",
    lastUpdated: "Nov 2, 2025 • 4:30 PM",
  },
  {
    id: "cat-sensitive",
    name: "Sensitive Personal Information",
    description: "Protects personal data.",
    iconType: "sensitive",
    enabled: true,
    reviewRequired: true,
    resultingAction: "Reject",
    lastUpdated: "Nov 2, 2025 • 4:30 PM",
  },
  {
    id: "cat-other",
    name: "Other Policy Violations",
    description: "Covers other issues.",
    iconType: "other",
    enabled: true,
    reviewRequired: true,
    resultingAction: "Flag",
    lastUpdated: "Nov 2, 2025 • 4:30 PM",
  },
];

/**
 * Canonical 4 Automatic Rules matching Screen 23 reference photo
 */
export const CANONICAL_RULES: AutomaticModerationRule[] = [
  {
    id: "rule-explicit",
    name: "Explicit Content Rule",
    triggerCondition: "Adult content detected",
    detectionSource: "Vision AI",
    severity: "High",
    resultingAction: "Reject",
    enabled: true,
    description: "Instantly rejects content triggering adult/explicit vision detectors.",
    order: 1,
  },
  {
    id: "rule-violence",
    name: "Violence Detection",
    triggerCondition: "Violent imagery found",
    detectionSource: "Vision AI",
    severity: "High",
    resultingAction: "Flag for Review",
    enabled: true,
    description: "Flags violent or disturbing imagery for secondary human inspection.",
    order: 2,
  },
  {
    id: "rule-hate",
    name: "Hate Speech",
    triggerCondition: "Hate content detected",
    detectionSource: "Vision AI + NLP",
    severity: "Medium",
    resultingAction: "Reject",
    enabled: true,
    description: "Rejects hate symbols or derogatory textual overlays in posters.",
    order: 3,
  },
  {
    id: "rule-copyright",
    name: "Copyright Content",
    triggerCondition: "Copyright logo detected",
    detectionSource: "Vision AI",
    severity: "Low",
    resultingAction: "Flag for Review",
    enabled: true,
    description: "Flags trademarked logos or brand marks for compliance verification.",
    order: 4,
  },
];

/**
 * Canonical 6 Rejection Reasons matching Screen 23 reference photo
 */
export const CANONICAL_REJECTION_REASONS: RejectionReason[] = [
  {
    id: "rej-policy",
    category: "Policy Violation",
    description: "Violates content policy",
    status: "Active",
    usageCount: 28,
  },
  {
    id: "rej-copyright",
    category: "Copyright Concern",
    description: "Infringes copyright",
    status: "Active",
    usageCount: 14,
  },
  {
    id: "rej-inappropriate",
    category: "Inappropriate Content",
    description: "Inappropriate content",
    status: "Active",
    usageCount: 19,
  },
  {
    id: "rej-misleading",
    category: "Misleading Content",
    description: "False or misleading",
    status: "Active",
    usageCount: 8,
  },
  {
    id: "rej-quality",
    category: "Quality Issue",
    description: "Low quality or blurry",
    status: "Active",
    usageCount: 7,
  },
  {
    id: "rej-other",
    category: "Other",
    description: "Other reasons",
    status: "Active",
    usageCount: 3,
  },
];

/**
 * Canonical Global Settings matching Screen 23 reference photo
 */
export const CANONICAL_GLOBAL_SETTINGS: GlobalModerationSettings = {
  enableModerationWorkflow: true,
  automaticModerationAvailability: true,
  manualReviewRequirement: true,
  defaultModerationBehavior: "Flag for Review",
  unknownResultHandling: "Treat as Suspicious",
  policyVersion: "v2.1.0",
  lastUpdated: "Nov 2, 2025 • 4:30 PM",
  status: "live",
};

/**
 * Canonical Manual Review Configuration matching Screen 23 reference photo
 */
export const CANONICAL_MANUAL_REVIEW: ManualReviewConfiguration = {
  reviewRequiredConditions: "On Policy Violation or Uncertain Result",
  reviewerRole: "Content Moderator",
  reviewPriority: "High for Harmful Content",
  escalationRules: "After 24 Hours",
  reviewDecisionRequired: true,
};

/**
 * Canonical Unknown & Error Handling matching Screen 23 reference photo
 */
export const CANONICAL_ERROR_HANDLING: UnknownErrorHandling = {
  serviceUnavailable: "Allow with Warning",
  timeout: "Flag for Review",
  inconclusiveResult: "Flag for Review",
  unsupportedFormat: "Reject",
  missingResponse: "Flag for Review",
};

/**
 * Evaluate prompt text or image attributes against active rules
 */
export function evaluatePolicyRules(
  prompt: string,
  categories: ModerationCategory[],
  rules: AutomaticModerationRule[]
): {
  decision: "Approved" | "Manual Review" | "Rejected";
  matchedRules: AutomaticModerationRule[];
  matchedCategories: ModerationCategory[];
  reasons: string[];
} {
  const p = prompt.toLowerCase();
  const matchedRules: AutomaticModerationRule[] = [];
  const matchedCategories: ModerationCategory[] = [];
  const reasons: string[] = [];

  const activeRules = rules.filter((r) => r.enabled);

  // Check explicit content rule
  if (
    activeRules.some((r) => r.id === "rule-explicit") &&
    (p.includes("nsfw") || p.includes("nude") || p.includes("adult") || p.includes("explicit"))
  ) {
    const r = activeRules.find((rule) => rule.id === "rule-explicit")!;
    matchedRules.push(r);
    reasons.push("Explicit content trigger detected (Adult content detected)");
    const cat = categories.find((c) => c.id === "cat-explicit");
    if (cat) matchedCategories.push(cat);
  }

  // Check violence detection rule
  if (
    activeRules.some((r) => r.id === "rule-violence") &&
    (p.includes("violence") || p.includes("blood") || p.includes("weapon") || p.includes("gore"))
  ) {
    const r = activeRules.find((rule) => rule.id === "rule-violence")!;
    matchedRules.push(r);
    reasons.push("Violence detection trigger detected (Violent imagery found)");
    const cat = categories.find((c) => c.id === "cat-violence");
    if (cat) matchedCategories.push(cat);
  }

  // Check hate speech rule
  if (
    activeRules.some((r) => r.id === "rule-hate") &&
    (p.includes("hate") || p.includes("slur") || p.includes("harassment") || p.includes("nazi"))
  ) {
    const r = activeRules.find((rule) => rule.id === "rule-hate")!;
    matchedRules.push(r);
    reasons.push("Hate speech trigger detected (Hate content detected)");
    const cat = categories.find((c) => c.id === "cat-hate");
    if (cat) matchedCategories.push(cat);
  }

  // Check copyright content rule
  if (
    activeRules.some((r) => r.id === "rule-copyright") &&
    (p.includes("nike") || p.includes("coca-cola") || p.includes("disney") || p.includes("marvel") || p.includes("apple logo"))
  ) {
    const r = activeRules.find((rule) => rule.id === "rule-copyright")!;
    matchedRules.push(r);
    reasons.push("Copyright rule triggered (Copyright logo detected)");
    const cat = categories.find((c) => c.id === "cat-copyright");
    if (cat) matchedCategories.push(cat);
  }

  // Determine overall decision
  let decision: "Approved" | "Manual Review" | "Rejected" = "Approved";

  if (matchedRules.some((r) => r.resultingAction === "Reject")) {
    decision = "Rejected";
  } else if (
    matchedRules.some((r) => r.resultingAction === "Flag for Review" || r.resultingAction === "Escalate to Manual Review")
  ) {
    decision = "Manual Review";
  }

  return {
    decision,
    matchedRules,
    matchedCategories,
    reasons,
  };
}
