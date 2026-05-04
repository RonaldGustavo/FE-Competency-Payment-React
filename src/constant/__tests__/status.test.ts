import { describe, it, expect } from 'vitest';
import { getStatusColor } from '../status';
import Colors from '../color';

describe('getStatusColor', () => {
  it('handles lowercase status', () => {
    expect(getStatusColor('pending')).toBe(Colors.warning);
    expect(getStatusColor('approved')).toBe(Colors.success);
    expect(getStatusColor('rejected')).toBe(Colors.danger);
    expect(getStatusColor('paid')).toBe(Colors.success);
    expect(getStatusColor('failed')).toBe(Colors.danger);
    expect(getStatusColor('expired')).toBe(Colors.danger);
    expect(getStatusColor('refund')).toBe(Colors.secondary);
    expect(getStatusColor('requested')).toBe(Colors.warning);
    expect(getStatusColor('completed')).toBe(Colors.success);
    expect(getStatusColor('success')).toBe(Colors.success);
  });

  it('handles UPPERCASE status', () => {
    expect(getStatusColor('PENDING')).toBe(Colors.warning);
    expect(getStatusColor('APPROVED')).toBe(Colors.success);
    expect(getStatusColor('REJECTED')).toBe(Colors.danger);
    expect(getStatusColor('PAID')).toBe(Colors.success);
    expect(getStatusColor('FAILED')).toBe(Colors.danger);
  });

  it('handles PascalCase status', () => {
    expect(getStatusColor('Pending')).toBe(Colors.warning);
    expect(getStatusColor('Approved')).toBe(Colors.success);
    expect(getStatusColor('Paid')).toBe(Colors.success);
  });

  it('returns textMuted for unknown status', () => {
    expect(getStatusColor('unknown')).toBe(Colors.textMuted);
    expect(getStatusColor('INVALID')).toBe(Colors.textMuted);
    expect(getStatusColor('')).toBe(Colors.textMuted);
  });
});
