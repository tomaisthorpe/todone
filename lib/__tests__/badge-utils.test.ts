import { countDueAndOverdueTasks } from '../badge-utils';
import { Task } from '../data';

// Mock shouldHideCompletedTask and shouldHabitShowAsAvailable
jest.mock('../utils', () => ({
  shouldHideCompletedTask: jest.fn(() => false),
  shouldHabitShowAsAvailable: jest.fn(() => false),
}));

describe('Badge Utils', () => {
  const createMockTask = (overrides: Partial<Task> = {}): Task => ({
    id: '1',
    title: 'Test Task',
    project: null,
    priority: 'MEDIUM',
    tags: [],
    contextId: 'ctx1',
    dueDate: null,
    urgency: 5.0,
    completed: false,
    completedAt: null,
    type: 'TASK',
    notes: null,
    subtasks: [],
    userId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
    habitType: null,
    streak: null,
    longestStreak: null,
    frequency: null,
    nextDue: null,
    ...overrides,
  });

  describe('countDueAndOverdueTasks', () => {
    it('should count tasks due today', () => {
      const today = new Date();
      const tasks = [
        createMockTask({ dueDate: today }),
        createMockTask({ dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) }), // Tomorrow
      ];

      const count = countDueAndOverdueTasks(tasks);
      expect(count).toBe(1);
    });

    it('should count overdue tasks', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const tasks = [
        createMockTask({ dueDate: yesterday }),
        createMockTask({ dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) }), // Tomorrow
      ];

      const count = countDueAndOverdueTasks(tasks);
      expect(count).toBe(1);
    });

    it('should not count completed tasks', () => {
      const today = new Date();
      const tasks = [
        createMockTask({ dueDate: today, completed: true }),
        createMockTask({ dueDate: today, completed: false }),
      ];

      const count = countDueAndOverdueTasks(tasks);
      expect(count).toBe(1);
    });

    it('should not count tasks without due dates', () => {
      const tasks = [
        createMockTask({ dueDate: null }),
        createMockTask({ dueDate: new Date() }),
      ];

      const count = countDueAndOverdueTasks(tasks);
      expect(count).toBe(1);
    });

    it('should not count future tasks', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const tasks = [
        createMockTask({ dueDate: tomorrow }),
        createMockTask({ dueDate: nextWeek }),
      ];

      const count = countDueAndOverdueTasks(tasks);
      expect(count).toBe(0);
    });

    it('should return 0 for empty task list', () => {
      const count = countDueAndOverdueTasks([]);
      expect(count).toBe(0);
    });
  });
});