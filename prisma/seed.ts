import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a demo user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@todone.app' },
    update: {},
    create: {
      email: 'demo@todone.app',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  console.log('Created user:', user.email);

  // Create contexts
  const contexts = await Promise.all([
    prisma.context.upsert({
      where: { id: 'coding-context' },
      update: {},
      create: {
        id: 'coding-context',
        name: 'Coding',
        description: 'Development work',
        icon: 'Code',
        color: 'bg-blue-500',
        userId: user.id,
      },
    }),
    prisma.context.upsert({
      where: { id: 'bathroom-context' },
      update: {},
      create: {
        id: 'bathroom-context',
        name: 'Bathroom',
        description: 'Bathroom tasks & cleaning',
        icon: 'Home',
        color: 'bg-cyan-500',
        userId: user.id,
      },
    }),
    prisma.context.upsert({
      where: { id: 'kitchen-context' },
      update: {},
      create: {
        id: 'kitchen-context',
        name: 'Kitchen',
        description: 'Kitchen & cooking tasks',
        icon: 'Coffee',
        color: 'bg-green-500',
        userId: user.id,
      },
    }),
    prisma.context.upsert({
      where: { id: 'bedroom-context' },
      update: {},
      create: {
        id: 'bedroom-context',
        name: 'Bedroom',
        description: 'Bedroom & sleep routine',
        icon: 'Home',
        color: 'bg-purple-500',
        userId: user.id,
      },
    }),
  ]);

  console.log('Created contexts:', contexts.length);

  // Create tasks
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tasks = [
    // Today's priority tasks
    {
      id: 'task-1',
      title: 'Fix authentication bug in user dashboard',
      project: 'SideProject A',
      priority: 'HIGH' as const,
      tags: ['bug', 'urgent'],
      contextId: 'coding-context',
      dueDate: today,
      urgency: 8.5,
      completed: false,
      type: 'TASK' as const,
      userId: user.id,
    },
    {
      id: 'habit-1',
      title: 'Morning workout',
      project: 'Health',
      priority: 'MEDIUM' as const,
      tags: ['fitness'],
      contextId: 'bedroom-context',
      dueDate: today,
      urgency: 7.8,
      completed: true,
      type: 'HABIT' as const,
      habitType: 'STREAK' as const,
      streak: 12,
      longestStreak: 28,
      frequency: 1,
      lastCompleted: today,
      userId: user.id,
    },

    // Coding context
    {
      id: 'task-2',
      title: 'Deploy staging environment',
      project: 'SideProject A',
      priority: 'HIGH' as const,
      tags: ['deployment'],
      contextId: 'coding-context',
      dueDate: tomorrow,
      urgency: 7.9,
      completed: false,
      type: 'TASK' as const,
      userId: user.id,
    },
    {
      id: 'task-3',
      title: 'Review pull requests',
      project: 'SideProject B',
      priority: 'MEDIUM' as const,
      tags: ['review'],
      contextId: 'coding-context',
      dueDate: null,
      urgency: 6.2,
      completed: true,
      type: 'TASK' as const,
      userId: user.id,
    },
    {
      id: 'habit-2',
      title: 'Daily coding practice',
      project: 'Learning',
      priority: 'MEDIUM' as const,
      tags: ['learning', 'coding'],
      contextId: 'coding-context',
      dueDate: null,
      urgency: 6.5,
      completed: false,
      type: 'HABIT' as const,
      habitType: 'LEARNING' as const,
      streak: 7,
      longestStreak: 15,
      frequency: 1,
      lastCompleted: yesterday,
      userId: user.id,
    },
    {
      id: 'recurring-1',
      title: 'Weekly team standup',
      project: 'Work',
      priority: 'MEDIUM' as const,
      tags: ['meeting', 'recurring'],
      contextId: 'coding-context',
      dueDate: tomorrow,
      urgency: 6.8,
      completed: false,
      type: 'RECURRING' as const,
      frequency: 7,
      nextDue: tomorrow,
      userId: user.id,
    },

    // Kitchen context
    {
      id: 'habit-3',
      title: 'Wipe down counters',
      project: 'Cleaning',
      priority: 'MEDIUM' as const,
      tags: ['cleaning'],
      contextId: 'kitchen-context',
      dueDate: today,
      urgency: 6.1,
      completed: true,
      type: 'HABIT' as const,
      habitType: 'MAINTENANCE' as const,
      streak: 5,
      frequency: 1,
      lastCompleted: today,
      userId: user.id,
    },
    {
      id: 'task-4',
      title: 'Empty dishwasher',
      project: 'Cleaning',
      priority: 'MEDIUM' as const,
      tags: ['dishes'],
      contextId: 'kitchen-context',
      dueDate: today,
      urgency: 5.8,
      completed: false,
      type: 'TASK' as const,
      userId: user.id,
    },

    // Bedroom context
    {
      id: 'habit-4',
      title: 'Make bed',
      project: 'Morning Routine',
      priority: 'LOW' as const,
      tags: ['routine'],
      contextId: 'bedroom-context',
      dueDate: null,
      urgency: 4.2,
      completed: true,
      type: 'HABIT' as const,
      habitType: 'WELLNESS' as const,
      streak: 8,
      longestStreak: 22,
      frequency: 1,
      lastCompleted: today,
      userId: user.id,
    },
    {
      id: 'habit-5',
      title: 'Read before bed',
      project: 'Learning',
      priority: 'LOW' as const,
      tags: ['reading', 'routine'],
      contextId: 'bedroom-context',
      dueDate: null,
      urgency: 5.2,
      completed: false,
      type: 'HABIT' as const,
      habitType: 'LEARNING' as const,
      streak: 9,
      longestStreak: 18,
      frequency: 1,
      lastCompleted: yesterday,
      userId: user.id,
    },

    // Bathroom context
    {
      id: 'habit-6',
      title: 'Evening skincare routine',
      project: 'Self-Care',
      priority: 'LOW' as const,
      tags: ['skincare', 'routine'],
      contextId: 'bathroom-context',
      dueDate: null,
      urgency: 4.8,
      completed: false,
      type: 'HABIT' as const,
      habitType: 'WELLNESS' as const,
      streak: 18,
      longestStreak: 32,
      frequency: 1,
      lastCompleted: yesterday,
      userId: user.id,
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.upsert({
      where: { id: taskData.id },
      update: {},
      create: taskData,
    });
  }

  console.log('Created tasks:', tasks.length);

  // Create some habit completion records
  const completionRecords = [
    { taskId: 'habit-1', completedAt: today },
    { taskId: 'habit-3', completedAt: today },
    { taskId: 'habit-4', completedAt: today },
    { taskId: 'habit-2', completedAt: yesterday },
    { taskId: 'habit-5', completedAt: yesterday },
    { taskId: 'habit-6', completedAt: yesterday },
  ];

  for (const record of completionRecords) {
    await prisma.habitCompletion.create({
      data: record,
    });
  }

  console.log('Created habit completion records:', completionRecords.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });