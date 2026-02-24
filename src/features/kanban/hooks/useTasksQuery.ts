import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../../../api/tasks';
import { taskKeys } from '../../../lib/queryKeys';
import type { Task } from '../../../types/task';

function filterTasksBySearch(tasks: Task[], search: string): Task[] {
  if (!search.trim()) return tasks;
  const term = search.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term)
  );
}

export function useTasksQuery(debouncedSearch: string = '') {
  return useQuery({
    queryKey: taskKeys.list({ search: debouncedSearch }),
    queryFn: () => getTasks(),
    select: (data) => filterTasksBySearch(data, debouncedSearch),
  });
}
