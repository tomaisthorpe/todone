/**
 * Feature Limits Configuration
 *
 * This file defines the maximum number of resources a user can create
 * based on their subscription plan tier.
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
 * Get feature limits for a specific plan
 */
export function getPlanLimits(plan: UserPlan) {
  return PLAN_LIMITS[plan];
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
