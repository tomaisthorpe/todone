/**
 * Feature Limits Configuration
 *
 * This file defines the maximum number of resources a user can create.
 * These limits can be adjusted based on subscription tiers or other criteria.
 */

export const FEATURE_LIMITS = {
  // Maximum number of tasks a user can create
  // Set to Infinity for unlimited (current default)
  MAX_TASKS: Infinity,

  // Maximum number of contexts a user can create
  // Set to Infinity for unlimited (current default)
  MAX_CONTEXTS: Infinity,
} as const;

/**
 * Error messages for feature limit violations
 */
export const FEATURE_LIMIT_ERRORS = {
  MAX_TASKS: "You have reached the maximum number of tasks allowed.",
  MAX_CONTEXTS: "You have reached the maximum number of contexts allowed.",
} as const;
