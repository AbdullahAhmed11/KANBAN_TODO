import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import {
  createTask,
  updateTask,
  deleteTask,
} from '../../../api/tasks';
import { taskKeys } from '../../../lib/queryKeys';
import type { Task, TaskCreate, TaskUpdate } from '../../../types/task';

export function useCreateTask(
  options?: UseMutationOptions<Task, Error, TaskCreate>
) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: createTask,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
}

export function useUpdateTask(
  options?: UseMutationOptions<Task, Error, { id: number; data: TaskUpdate }>
) {
  const queryClient = useQueryClient();
  type Prev = [readonly unknown[], Task[] | undefined][];
  return useMutation({
    ...options,
    mutationFn: ({ id, data }) => updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const prev = queryClient.getQueriesData<Task[]>({
        queryKey: taskKeys.lists(),
      }) as Prev;
      queryClient.setQueriesData<Task[]>(
        { queryKey: taskKeys.lists() },
        (old) => {
          if (!old) return old;
          return old.map((t) =>
            t.id === id ? { ...t, ...data } : t
          );
        }
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        context.prev.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useDeleteTask(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();
  type Prev = [readonly unknown[], Task[] | undefined][];
  return useMutation({
    ...options,
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const prev = queryClient.getQueriesData<Task[]>({
        queryKey: taskKeys.lists(),
      }) as Prev;
      queryClient.setQueriesData<Task[]>(
        { queryKey: taskKeys.lists() },
        (old) => (old ? old.filter((t) => t.id !== id) : old)
      );
      return { prev };
    },
    onError: (_err, _id, context) => {
      if (context?.prev) {
        context.prev.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
