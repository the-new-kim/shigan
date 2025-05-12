import type { DBSchema, IDBPDatabase } from 'idb';
import { openDB } from 'idb';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: number; // 0-10
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: {
      'by-dueDate': Date;
      'by-priority': number;
      'by-status': TaskStatus;
    };
  };
}

let db: IDBPDatabase<TaskDB> | null = null;

export const initDB = async () => {
  if (db) return db;

  db = await openDB<TaskDB>('task-manager', 1, {
    upgrade(database) {
      const store = database.createObjectStore('tasks', { keyPath: 'id' });
      store.createIndex('by-dueDate', 'dueDate');
      store.createIndex('by-priority', 'priority');
      store.createIndex('by-status', 'status');
    },
  });

  return db;
};

export const getDB = async () => {
  if (!db) {
    await initDB();
  }
  return db!;
};

export const addTask = async (
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const db = await getDB();
  const id = crypto.randomUUID();
  const now = new Date();
  const newTask = {
    ...task,
    id,
    createdAt: now,
    updatedAt: now,
  };
  await db.add('tasks', newTask);

  return newTask;
};

export const updateTask = async (task: Task) => {
  const db = await getDB();
  return db.put('tasks', {
    ...task,
    updatedAt: new Date(),
  });
};

export const deleteTask = async (id: string) => {
  const db = await getDB();
  return db.delete('tasks', id);
};

export const getAllTasks = async () => {
  const db = await getDB();
  return db.getAll('tasks');
};

export const getTasksByQuadrant = async (daysThreshold: number = 0) => {
  const db = await getDB();
  const tasks = await db.getAll('tasks');
  const now = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(now.getDate() + daysThreshold);
  
  const result = {
    q1: tasks.filter((task) => task.priority >= 7 && task.dueDate <= thresholdDate), // Urgent & Important
    q2: tasks.filter((task) => task.priority >= 7 && task.dueDate > thresholdDate), // Not Urgent & Important
    q3: tasks.filter((task) => task.priority < 7 && task.dueDate <= thresholdDate), // Urgent & Not Important
    q4: tasks.filter((task) => task.priority < 7 && task.dueDate > thresholdDate), // Not Urgent & Not Important
  };

  return result;
};

export const getCompletedTasks = async () => {
  const db = await getDB();
  const tasks = await db.getAll('tasks');
  return tasks.filter((task) => task.status === TaskStatus.DONE);
};
