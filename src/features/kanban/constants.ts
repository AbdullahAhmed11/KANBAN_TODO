import type { ColumnId } from '../../types/task';

export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'backlog', label: 'TO DO' },
  { id: 'in_progress', label: 'IN PROGRESS' },
  { id: 'review', label: 'IN REVIEW' },
  { id: 'done', label: 'DONE' },
];

export const COLUMN_IDS: ColumnId[] = COLUMNS.map((c) => c.id);

export const COLUMN_LABELS: Record<ColumnId, string> = COLUMNS.reduce(
  (acc, { id, label }) => {
    acc[id] = label;
    return acc;
  },
  {} as Record<ColumnId, string>
);

export const COLUMN_COLORS: Record<ColumnId, string> = {
  backlog: '#2196f3',
  in_progress: '#ff9800',
  review: '#9c27b0',
  done: '#4caf50',
};

export const PAGE_SIZE = 10;
