/**
 * Tests for date utility functions
 */

import { startOfDay, endOfDay, addDays, diffInLocalCalendarDays } from '../date-utils';

describe('startOfDay', () => {
  it('should set time to 00:00:00.000', () => {
    const date = new Date('2024-01-15T14:30:45.123Z');
    const result = startOfDay(date);
    
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('should preserve the date part', () => {
    const date = new Date('2024-01-15T14:30:45.123Z');
    const result = startOfDay(date);
    
    expect(result.getFullYear()).toBe(date.getFullYear());
    expect(result.getMonth()).toBe(date.getMonth());
    expect(result.getDate()).toBe(date.getDate());
  });

  it('should not modify the original date', () => {
    const originalDate = new Date('2024-01-15T14:30:45.123Z');
    const originalTime = originalDate.getTime();
    startOfDay(originalDate);
    
    expect(originalDate.getTime()).toBe(originalTime);
  });

  it('should handle edge cases', () => {
    // Test leap year
    const leapYearDate = new Date('2024-02-29T23:59:59.999Z');
    const result = startOfDay(leapYearDate);
    expect(result.getDate()).toBe(29);
    expect(result.getMonth()).toBe(1); // February (0-indexed)
    expect(result.getFullYear()).toBe(2024);
    expect(result.getHours()).toBe(0);

    // Test end of year
    const endOfYear = new Date('2023-12-31T23:59:59.999Z');
    const result2 = startOfDay(endOfYear);
    expect(result2.getDate()).toBe(31);
    expect(result2.getMonth()).toBe(11); // December
    expect(result2.getFullYear()).toBe(2023);
  });
});

describe('endOfDay', () => {
  it('should set time to 23:59:59.999', () => {
    const date = new Date('2024-01-15T14:30:45.123Z');
    const result = endOfDay(date);
    
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });

  it('should preserve the date part', () => {
    const date = new Date('2024-01-15T14:30:45.123Z');
    const result = endOfDay(date);
    
    expect(result.getFullYear()).toBe(date.getFullYear());
    expect(result.getMonth()).toBe(date.getMonth());
    expect(result.getDate()).toBe(date.getDate());
  });

  it('should not modify the original date', () => {
    const originalDate = new Date('2024-01-15T14:30:45.123Z');
    const originalTime = originalDate.getTime();
    endOfDay(originalDate);
    
    expect(originalDate.getTime()).toBe(originalTime);
  });

  it('should handle edge cases', () => {
    // Test start of day
    const startOfDayDate = new Date('2024-01-15T00:00:00.000Z');
    const result = endOfDay(startOfDayDate);
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });
});

describe('addDays', () => {
  it('should add positive days correctly', () => {
    const date = new Date('2024-01-15T14:30:45.123Z');
    const result = addDays(date, 5);
    
    expect(result.getDate()).toBe(20);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getFullYear()).toBe(2024);
    expect(result.getHours()).toBe(date.getHours());
    expect(result.getMinutes()).toBe(date.getMinutes());
  });

  it('should subtract days with negative numbers', () => {
    const date = new Date('2024-01-15T14:30:45.123Z');
    const result = addDays(date, -5);
    
    expect(result.getDate()).toBe(10);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getFullYear()).toBe(2024);
  });

  it('should handle month transitions', () => {
    const date = new Date('2024-01-30T14:30:45.123Z');
    const result = addDays(date, 5);
    
    expect(result.getDate()).toBe(4);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getFullYear()).toBe(2024);
  });

  it('should handle year transitions', () => {
    const date = new Date('2023-12-30T14:30:45.123Z');
    const result = addDays(date, 5);
    
    expect(result.getDate()).toBe(4);
    expect(result.getMonth()).toBe(0); // January
    expect(result.getFullYear()).toBe(2024);
  });

  it('should handle leap year February', () => {
    const date = new Date('2024-02-28T14:30:45.123Z');
    const result = addDays(date, 1);
    
    expect(result.getDate()).toBe(29);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getFullYear()).toBe(2024);
  });

  it('should not modify the original date', () => {
    const originalDate = new Date('2024-01-15T14:30:45.123Z');
    const originalTime = originalDate.getTime();
    addDays(originalDate, 5);
    
    expect(originalDate.getTime()).toBe(originalTime);
  });

  it('should handle zero days', () => {
    const date = new Date('2024-01-15T14:30:45.123Z');
    const result = addDays(date, 0);
    
    expect(result.getTime()).toBe(date.getTime());
    expect(result).not.toBe(date); // Should be a new instance
  });
});

describe('diffInLocalCalendarDays', () => {
  it('should calculate positive difference for future dates', () => {
    const base = new Date('2024-01-15T14:30:45.123Z');
    const target = new Date('2024-01-20T10:15:30.456Z');
    
    const result = diffInLocalCalendarDays(target, base);
    expect(result).toBe(5);
  });

  it('should calculate negative difference for past dates', () => {
    const base = new Date('2024-01-15T14:30:45.123Z');
    const target = new Date('2024-01-10T10:15:30.456Z');
    
    const result = diffInLocalCalendarDays(target, base);
    expect(result).toBe(-5);
  });

  it('should return 0 for the same calendar day', () => {
    const base = new Date('2024-01-15T14:30:45.123Z');
    const target = new Date('2024-01-15T10:15:30.456Z');
    
    const result = diffInLocalCalendarDays(target, base);
    expect(result).toBe(0);
  });

  it('should use current date as default base', () => {
    const now = new Date();
    const tomorrow = addDays(now, 1);
    
    const result = diffInLocalCalendarDays(tomorrow);
    expect(result).toBe(1);
  });

  it('should handle month boundaries correctly', () => {
    const base = new Date('2024-01-31T23:59:59.999Z');
    const target = new Date('2024-02-01T00:00:00.000Z');
    
    const result = diffInLocalCalendarDays(target, base);
    expect(result).toBe(1);
  });

  it('should handle year boundaries correctly', () => {
    const base = new Date('2023-12-31T23:59:59.999Z');
    const target = new Date('2024-01-01T00:00:00.000Z');
    
    const result = diffInLocalCalendarDays(target, base);
    expect(result).toBe(1);
  });

  it('should handle leap year correctly', () => {
    const base = new Date('2024-02-28T12:00:00.000Z');
    const target = new Date('2024-03-01T12:00:00.000Z');
    
    const result = diffInLocalCalendarDays(target, base);
    expect(result).toBe(2); // Feb 29th exists in 2024
  });

  it('should handle non-leap year correctly', () => {
    const base = new Date('2023-02-28T12:00:00.000Z');
    const target = new Date('2023-03-01T12:00:00.000Z');
    
    const result = diffInLocalCalendarDays(target, base);
    expect(result).toBe(1); // Feb 29th doesn't exist in 2023
  });

  it('should handle large date differences', () => {
    const base = new Date('2024-01-01T00:00:00.000Z');
    const target = new Date('2024-12-31T23:59:59.999Z');
    
    const result = diffInLocalCalendarDays(target, base);
    expect(result).toBe(365); // 2024 is a leap year, so 366 - 1 = 365
  });

  it('should round results correctly', () => {
    // Test that partial days are rounded as expected
    const base = new Date('2024-01-15T00:00:00.000Z');
    const target = new Date('2024-01-15T23:59:59.999Z');
    
    const result = diffInLocalCalendarDays(target, base);
    expect(result).toBe(0); // Same calendar day
  });
});

describe('date-utils edge cases and integration', () => {
  it('startOfDay and endOfDay should create a full day span', () => {
    const date = new Date('2024-01-15T14:30:45.123Z');
    const start = startOfDay(date);
    const end = endOfDay(date);
    
    expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000 - 1); // Almost 24 hours
  });

  it('addDays and diffInLocalCalendarDays should be inverse operations', () => {
    const baseDate = new Date('2024-01-15T14:30:45.123Z');
    const daysToAdd = 10;
    
    const futureDate = addDays(baseDate, daysToAdd);
    const calculatedDiff = diffInLocalCalendarDays(futureDate, baseDate);
    
    expect(calculatedDiff).toBe(daysToAdd);
  });

  it('should handle daylight saving time transitions gracefully', () => {
    // This is tricky because DST changes vary by timezone
    // We'll test a known DST transition in US Eastern time
    const beforeDST = new Date('2024-03-09T12:00:00.000Z'); // Before DST
    const afterDST = addDays(beforeDST, 1);
    
    // The function should still work correctly regardless of DST
    expect(diffInLocalCalendarDays(afterDST, beforeDST)).toBe(1);
  });
});