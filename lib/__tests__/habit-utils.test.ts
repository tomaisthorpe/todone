/**
 * Tests for habit utility functions (non-database functions only)
 */

import {
  isHabitCompletionOnTime,
  calculateHabitStreak,
  calculateNextHabitDueDate,
  HabitTask,
} from '../habit-utils';
import { startOfDay, endOfDay, addDays } from '../date-utils';

describe('isHabitCompletionOnTime', () => {
  const baseTask: HabitTask = {
    id: 'test-id',
    dueDate: null,
    frequency: null,
    completedAt: null,
    streak: null,
    longestStreak: null,
  };

  describe('with due date', () => {
    it('should return true when completed on due date', () => {
      const dueDate = new Date('2024-01-15T00:00:00.000Z');
      const completionDate = new Date('2024-01-15T14:30:00.000Z');
      
      const task: HabitTask = {
        ...baseTask,
        dueDate,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(true);
    });

    it('should return true when completed before due date', () => {
      const dueDate = new Date('2024-01-15T00:00:00.000Z');
      const completionDate = new Date('2024-01-14T14:30:00.000Z');
      
      const task: HabitTask = {
        ...baseTask,
        dueDate,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(true);
    });

    it('should return true when completed at end of due date', () => {
      const dueDate = new Date('2024-01-15T00:00:00.000Z');
      const completionDate = endOfDay(dueDate);
      
      const task: HabitTask = {
        ...baseTask,
        dueDate,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(true);
    });

    it('should return false when completed after due date', () => {
      const dueDate = new Date('2024-01-15T00:00:00.000Z');
      const completionDate = new Date('2024-01-16T00:00:01.000Z');
      
      const task: HabitTask = {
        ...baseTask,
        dueDate,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(false);
    });

    it('should handle timezone edge cases', () => {
      const dueDate = new Date('2024-01-15T23:59:59.999Z');
      const completionDate = new Date('2024-01-15T23:59:59.000Z');
      
      const task: HabitTask = {
        ...baseTask,
        dueDate,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(true);
    });
  });

  describe('with frequency but no due date', () => {
    it('should return true for first completion with no prior completedAt', () => {
      const completionDate = new Date('2024-01-15T14:30:00.000Z');
      
      const task: HabitTask = {
        ...baseTask,
        frequency: 7, // Weekly
        completedAt: null,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(true);
    });

    it('should return true when completed within frequency window', () => {
      const lastCompletion = new Date('2024-01-15T14:30:00.000Z');
      const completionDate = new Date('2024-01-22T14:30:00.000Z'); // Exactly 7 days later
      
      const task: HabitTask = {
        ...baseTask,
        frequency: 7, // Weekly
        completedAt: lastCompletion,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(true);
    });

    it('should return true when completed before frequency window ends', () => {
      const lastCompletion = new Date('2024-01-15T14:30:00.000Z');
      const completionDate = new Date('2024-01-21T14:30:00.000Z'); // 6 days later
      
      const task: HabitTask = {
        ...baseTask,
        frequency: 7, // Weekly
        completedAt: lastCompletion,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(true);
    });

    it('should return true when completed at end of frequency window', () => {
      const lastCompletion = new Date('2024-01-15T00:00:00.000Z');
      const expectedDue = addDays(startOfDay(lastCompletion), 7);
      const completionDate = endOfDay(expectedDue);
      
      const task: HabitTask = {
        ...baseTask,
        frequency: 7, // Weekly
        completedAt: lastCompletion,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(true);
    });

    it('should return false when completed after frequency window', () => {
      const lastCompletion = new Date('2024-01-15T14:30:00.000Z');
      const completionDate = new Date('2024-01-23T00:00:01.000Z'); // 7 days + 1 second
      
      const task: HabitTask = {
        ...baseTask,
        frequency: 7, // Weekly
        completedAt: lastCompletion,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(false);
    });

    it('should handle different frequency values', () => {
      const lastCompletion = new Date('2024-01-15T14:30:00.000Z');
      
      // Daily habit
      const dailyTask: HabitTask = {
        ...baseTask,
        frequency: 1,
        completedAt: lastCompletion,
      };
      
      const nextDay = new Date('2024-01-16T14:30:00.000Z');
      expect(isHabitCompletionOnTime(dailyTask, nextDay)).toBe(true);
      
      const dayAfter = new Date('2024-01-17T00:00:01.000Z');
      expect(isHabitCompletionOnTime(dailyTask, dayAfter)).toBe(false);
      
      // Monthly habit
      const monthlyTask: HabitTask = {
        ...baseTask,
        frequency: 30,
        completedAt: lastCompletion,
      };
      
      const thirtyDaysLater = new Date('2024-02-14T14:30:00.000Z');
      expect(isHabitCompletionOnTime(monthlyTask, thirtyDaysLater)).toBe(true);
    });
  });

  describe('without due date or frequency', () => {
    it('should always return true', () => {
      const completionDate = new Date('2024-01-15T14:30:00.000Z');
      
      const task: HabitTask = {
        ...baseTask,
        dueDate: null,
        frequency: null,
      };

      const result = isHabitCompletionOnTime(task, completionDate);
      expect(result).toBe(true);
    });
  });
});

describe('calculateHabitStreak', () => {
  const baseTask: HabitTask = {
    id: 'test-id',
    dueDate: null,
    frequency: null,
    completedAt: null,
    streak: null,
    longestStreak: null,
  };

  it('should start streak at 1 for first completion', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    
    const task: HabitTask = {
      ...baseTask,
      streak: null,
      longestStreak: null,
    };

    const result = calculateHabitStreak(task, completionDate);
    expect(result.streak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it('should increment streak when on time', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    
    const task: HabitTask = {
      ...baseTask,
      dueDate: completionDate, // Due today, so on time
      streak: 3,
      longestStreak: 5,
    };

    const result = calculateHabitStreak(task, completionDate);
    expect(result.streak).toBe(4);
    expect(result.longestStreak).toBe(5); // Unchanged since 4 < 5
  });

  it('should reset streak to 1 when late', () => {
    const dueDate = new Date('2024-01-15T14:30:00.000Z');
    const completionDate = new Date('2024-01-16T14:30:00.000Z'); // Late
    
    const task: HabitTask = {
      ...baseTask,
      dueDate,
      streak: 3,
      longestStreak: 5,
    };

    const result = calculateHabitStreak(task, completionDate);
    expect(result.streak).toBe(1);
    expect(result.longestStreak).toBe(5); // Unchanged
  });

  it('should update longest streak when current streak exceeds it', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    
    const task: HabitTask = {
      ...baseTask,
      dueDate: completionDate, // On time
      streak: 5,
      longestStreak: 3,
    };

    const result = calculateHabitStreak(task, completionDate);
    expect(result.streak).toBe(6);
    expect(result.longestStreak).toBe(6); // Updated
  });

  it('should handle zero/null initial values', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    
    const task: HabitTask = {
      ...baseTask,
      dueDate: completionDate, // On time
      streak: 0,
      longestStreak: 0,
    };

    const result = calculateHabitStreak(task, completionDate);
    expect(result.streak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it('should work with frequency-based habits', () => {
    const lastCompletion = new Date('2024-01-15T14:30:00.000Z');
    const completionDate = new Date('2024-01-22T14:30:00.000Z'); // 7 days later, on time
    
    const task: HabitTask = {
      ...baseTask,
      frequency: 7,
      completedAt: lastCompletion,
      streak: 2,
      longestStreak: 4,
    };

    const result = calculateHabitStreak(task, completionDate);
    expect(result.streak).toBe(3);
    expect(result.longestStreak).toBe(4);
  });

  it('should reset streak when frequency-based habit is late', () => {
    const lastCompletion = new Date('2024-01-15T14:30:00.000Z');
    const completionDate = new Date('2024-01-25T14:30:00.000Z'); // 10 days later, late for weekly
    
    const task: HabitTask = {
      ...baseTask,
      frequency: 7,
      completedAt: lastCompletion,
      streak: 2,
      longestStreak: 4,
    };

    const result = calculateHabitStreak(task, completionDate);
    expect(result.streak).toBe(1);
    expect(result.longestStreak).toBe(4);
  });

  it('should handle habits with no timing constraints', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    
    const task: HabitTask = {
      ...baseTask,
      dueDate: null,
      frequency: null,
      streak: 2,
      longestStreak: 4,
    };

    const result = calculateHabitStreak(task, completionDate);
    expect(result.streak).toBe(3); // Always on time when no constraints
    expect(result.longestStreak).toBe(4);
  });
});

describe('calculateNextHabitDueDate', () => {
  it('should return null when frequency is null', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    
    const result = calculateNextHabitDueDate(null, completionDate);
    expect(result).toBeNull();
  });

  it('should return null when frequency is zero', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    
    const result = calculateNextHabitDueDate(0, completionDate);
    expect(result).toBeNull();
  });

  it('should add frequency days to completion date', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    const frequency = 7; // Weekly
    
    const result = calculateNextHabitDueDate(frequency, completionDate);
    const expected = addDays(completionDate, frequency);
    
    expect(result).toEqual(expected);
  });

  it('should handle daily frequency', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    const frequency = 1; // Daily
    
    const result = calculateNextHabitDueDate(frequency, completionDate);
    const expected = new Date('2024-01-16T14:30:00.000Z');
    
    expect(result).toEqual(expected);
  });

  it('should handle monthly frequency', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    const frequency = 30; // Monthly
    
    const result = calculateNextHabitDueDate(frequency, completionDate);
    const expected = addDays(completionDate, 30);
    
    expect(result).toEqual(expected);
  });

  it('should preserve time of day from completion date', () => {
    const completionDate = new Date('2024-01-15T09:15:30.123Z');
    const frequency = 7;
    
    const result = calculateNextHabitDueDate(frequency, completionDate);
    
    expect(result!.getHours()).toBe(completionDate.getHours());
    expect(result!.getMinutes()).toBe(completionDate.getMinutes());
    expect(result!.getSeconds()).toBe(completionDate.getSeconds());
    expect(result!.getMilliseconds()).toBe(completionDate.getMilliseconds());
  });

  it('should handle different frequency values correctly', () => {
    const completionDate = new Date('2024-01-15T14:30:00.000Z');
    
    // Test various frequencies
    const frequencies = [1, 3, 7, 14, 30, 365];
    
    frequencies.forEach(frequency => {
      const result = calculateNextHabitDueDate(frequency, completionDate);
      const expected = addDays(completionDate, frequency);
      expect(result).toEqual(expected);
    });
  });

  it('should handle edge cases with month and year boundaries', () => {
    // End of month
    const endOfMonth = new Date('2024-01-31T14:30:00.000Z');
    const result1 = calculateNextHabitDueDate(7, endOfMonth);
    expect(result1!.getMonth()).toBe(1); // February
    
    // End of year
    const endOfYear = new Date('2023-12-31T14:30:00.000Z');
    const result2 = calculateNextHabitDueDate(1, endOfYear);
    expect(result2!.getFullYear()).toBe(2024);
    expect(result2!.getMonth()).toBe(0); // January
  });

  it('should handle leap year correctly', () => {
    const leapYearDate = new Date('2024-02-28T14:30:00.000Z');
    const result = calculateNextHabitDueDate(1, leapYearDate);
    
    expect(result!.getDate()).toBe(29); // Feb 29th exists in 2024
    expect(result!.getMonth()).toBe(1); // February
  });
});