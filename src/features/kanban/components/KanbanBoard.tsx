import { Box } from '@mui/material';
import { useState, useCallback } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { Column } from './Column';
import { LoadingState } from '../../../components/LoadingState';
import { ErrorState } from '../../../components/ErrorState';
import { useTasksQuery } from '../hooks/useTasksQuery';
import { useDebouncedSearch } from '../hooks/useDebouncedSearch';
import { useDeleteTask, useUpdateTask } from '../hooks/useTaskMutations';
import { COLUMN_IDS, PAGE_SIZE } from '../constants';
import type { Task } from '../../../types/task';
import type { ColumnId } from '../../../types/task';

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
  onAddTask: (columnId: ColumnId) => void;
}

function groupTasksByColumn(tasks: Task[]) {
  const map: Record<string, Task[]> = {};
  for (const id of COLUMN_IDS) {
    map[id] = [];
  }
  for (const task of tasks) {
    if (map[task.column]) {
      map[task.column].push(task);
    }
  }
  return map;
}

export function KanbanBoard({ onEditTask, onAddTask }: KanbanBoardProps) {
  const [, debouncedSearch] = useDebouncedSearch();
  const { data: tasks = [], isLoading, isError, error, refetch } = useTasksQuery(debouncedSearch);
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const [columnPages, setColumnPages] = useState<Record<ColumnId, number>>(() =>
    COLUMN_IDS.reduce((acc, id) => ({ ...acc, [id]: 1 }), {} as Record<ColumnId, number>)
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const task = active.data?.current?.task as Task | undefined;
      if (!task || over.id === task.column) return;
      const targetColumn = over.id as ColumnId;
      if (!COLUMN_IDS.includes(targetColumn)) return;
      updateTask.mutate({ id: task.id, data: { column: targetColumn } });
    },
    [updateTask]
  );

  const byColumn = groupTasksByColumn(tasks);

  const handlePageChange = useCallback((columnId: ColumnId, page: number) => {
    setColumnPages((prev) => ({ ...prev, [columnId]: page }));
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }
  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? 'Failed to load tasks'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {COLUMN_IDS.map((columnId) => {
          const allInColumn = byColumn[columnId] ?? [];
          const page = columnPages[columnId] ?? 1;
          const start = (page - 1) * PAGE_SIZE;
          const paginatedTasks = allInColumn.slice(start, start + PAGE_SIZE);
          return (
            <Box key={columnId} sx={{ minHeight: 0 }}>
              <Column
                columnId={columnId}
                tasks={paginatedTasks}
                totalCount={allInColumn.length}
                page={page}
                onPageChange={(p) => handlePageChange(columnId, p)}
                onEdit={onEditTask}
                onDelete={(id) => deleteTask.mutate(id)}
                onAddTask={onAddTask}
              />
            </Box>
          );
        })}
      </Box>
    </DndContext>
  );
}
