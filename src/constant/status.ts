import Colors from "./color";

export const statusColors: Record<
  'Pending' | 'Approved' | 'Rejected' | 'Completed',
  string
> = {
  Pending: Colors.warning,
  Approved: Colors.info,
  Rejected: Colors.danger,
  Completed: Colors.success,
};