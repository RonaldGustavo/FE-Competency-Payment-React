import Colors from "./color";

export const statusColors: Record<string, string> = {
  Pending: Colors.warning,
  Approved: Colors.info,
  Rejected: Colors.danger,
  Completed: Colors.success,
  PENDING: Colors.warning,
  PAID: Colors.success,
  FAILED: Colors.danger,
  EXPIRED: Colors.textMuted,
  REFUND: Colors.secondary,
  SUCCESS: Colors.success,
  APPROVED: Colors.success,
  REJECTED: Colors.danger,
  Paid: Colors.success,
  Failed: Colors.danger,
  Expired: Colors.danger,
  Refund: Colors.secondary,
  REQUESTED: Colors.warning,
};
