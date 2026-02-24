export type ColumnId = 'backlog' | 'in_progress' | 'review' | 'done';

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  title: string;
  description: string;
  column: ColumnId;
  priority?: Priority;
}

export interface TaskCreate {
  title: string;
  description: string;
  column: ColumnId;
  priority?: Priority;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  column?: ColumnId;
  priority?: Priority;
}
