-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "subtasks" JSONB DEFAULT '[]';
