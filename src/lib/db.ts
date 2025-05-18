import type { DBSchema, IDBPDatabase } from 'idb';
import { openDB } from 'idb';
import type { CreateTaskDto, TaskEntity } from './types';
import { TaskStatus } from './types';
import type { QueryOptions } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

interface TaskDB extends DBSchema {
  tasks: {
    key: string;
    value: TaskEntity;
    indexes: {
      'by-dueDate': Date;
      'by-priority': number;
      'by-status': TaskStatus;
      'by-id': string;
    };
  };
}

let db: IDBPDatabase<TaskDB> | null = null;

const _initDB = async () => {
  if (db) return db;

  db = await openDB<TaskDB>('task-manager', 1, {
    upgrade(database) {
      const store = database.createObjectStore('tasks', { keyPath: 'id' });
      store.createIndex('by-dueDate', 'dueDate');
      store.createIndex('by-priority', 'priority');
      store.createIndex('by-status', 'status');
      store.createIndex('by-id', 'id');
    },
  });

  return db;
};

const _getDB = async () => {
  if (!db) {
    await _initDB();
  }
  return db!;
};

function useAddTask() {
  const mutationFn = async (dto: CreateTaskDto) => {
    const db = await _getDB();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const newTask = {
      ...dto,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await db.add('tasks', newTask);

    return newTask;
  };

  return useMutation({
    mutationFn,
  });
}

function useUpdateTask() {
  const mutationFn = async (task: TaskEntity) => {
    // id + createdAt + CreateTaskDto
    const db = await _getDB();
    return db.put('tasks', {
      ...task,
      updatedAt: new Date().toISOString(),
    });
  };

  return useMutation({
    mutationFn,
  });
}

function useDeleteTask() {
  const mutationFn = async (id: string) => {
    const db = await _getDB();
    return db.delete('tasks', id);
  };

  return useMutation({
    mutationFn,
  });
}

function useGetAllTasks() {
  const queryFn = async () => {
    const db = await _getDB();
    return db.getAll('tasks');
  };

  return useQuery({
    queryKey: ['tasks'],
    queryFn,
  });
}

function useGetCompletedTask() {
  const queryFn = async () => {
    const db = await _getDB();
    const tasks = await db.getAll('tasks');
    return tasks.filter((task) => task.status === TaskStatus.DONE);
  };

  return useQuery({
    queryKey: ['completed-tasks'],
    queryFn,
  });
}

function useTask(
  id: string,
  options?: Omit<QueryOptions<TaskEntity | undefined>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const db = await _getDB();
      const task = db.get('tasks', id);
      if (!task) {
        throw new Error(`Task with id ${id} not found`);
      }
      return task;
    },
    ...options,
  });
}
export {
  useAddTask,
  useUpdateTask,
  useDeleteTask,
  useGetAllTasks,
  useGetCompletedTask,
  useTask,
};
