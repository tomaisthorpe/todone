/**
 * Feature Limits Configuration
 *
 * This file defines the maximum number of resources a user can create
 * based on their subscription plan tier.
 *
 * For self-hosted instances, set SELF_HOSTED=true to provide unlimited
 * resources to all users regardless of their plan.
 */

export type UserPlan = "FREE" | "PRO";

/**
 * Plan-specific feature limits
 */
export const PLAN_LIMITS: Record<
  UserPlan,
  {
    MAX_TASKS: number;
    MAX_CONTEXTS: number;
  }
> = {
  FREE: {
    MAX_TASKS: Infinity,
    MAX_CONTEXTS: 3,
  },
  PRO: {
    MAX_TASKS: Infinity,
    MAX_CONTEXTS: Infinity,
  },
} as const;

/**
 * Unlimited limits for self-hosted instances
 */
const UNLIMITED_LIMITS = {
  MAX_TASKS: Infinity,
  MAX_CONTEXTS: Infinity,
} as const;

/**
 * Check if the instance is self-hosted
 */
export function isSelfHosted(): boolean {
  return process.env.SELF_HOSTED === "true";
}

/**
 * Get feature limits for a specific plan
 * For self-hosted instances, always returns unlimited limits
 */
export function getPlanLimits(plan: UserPlan) {
  if (isSelfHosted()) {
    return UNLIMITED_LIMITS;
  }
  return PLAN_LIMITS[plan];
}

/**
 * Get the display name for a user's plan
 * For self-hosted instances, returns "Unlimited"
 */
export function getPlanDisplayName(plan: UserPlan): string {
  if (isSelfHosted()) {
    return "Unlimited";
  }
  return plan.charAt(0) + plan.slice(1).toLowerCase();
}

/**
 * Error messages for feature limit violations
 */
export const FEATURE_LIMIT_ERRORS = {
  MAX_TASKS: "You have reached the maximum number of tasks allowed for your plan.",
  MAX_CONTEXTS: "You have reached the maximum number of contexts allowed for your plan.",
} as const;

/**
 * Legacy export for backward compatibility
 * @deprecated Use getPlanLimits() instead
 */
export const FEATURE_LIMITS = PLAN_LIMITS.FREE;
