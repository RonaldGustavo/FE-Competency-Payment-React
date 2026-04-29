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
  SUCCESS: Colors.success,
  APPROVED: Colors.success,
  REJECTED: Colors.danger,
};
