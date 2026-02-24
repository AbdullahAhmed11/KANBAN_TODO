export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: {
    column?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
};
