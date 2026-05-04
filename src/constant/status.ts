import Colors from "./color";

const statusColorMap: Record<string, string> = {
  pending: Colors.warning,
  requested: Colors.warning,
  approved: Colors.success,
  completed: Colors.success,
  paid: Colors.success,
  success: Colors.success,
  rejected: Colors.danger,
  failed: Colors.danger,
  expired: Colors.danger,
  refund: Colors.secondary,
};

export const getStatusColor = (status: string): string => {
  return statusColorMap[status.toLowerCase()] ?? Colors.textMuted;
};
