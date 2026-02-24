import { Box, Paper, Pagination, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDroppable } from '@dnd-kit/core';
import { ColumnHeader } from './ColumnHeader';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../../../components/EmptyState';
import { PAGE_SIZE } from '../constants';
import type { Task } from '../../../types/task';
import type { ColumnId } from '../../../types/task';

interface ColumnProps {
  columnId: ColumnId;
  tasks: Task[];
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onAddTask: (columnId: ColumnId) => void;
}

export function Column({
  columnId,
  tasks,
  totalCount,
  page,
  onPageChange,
  onEdit,
  onDelete,
  onAddTask,
}: ColumnProps) {
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{
        p: 2,
        minHeight: 320,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
        bgcolor: isOver ? 'action.hover' : 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <ColumnHeader columnId={columnId} count={totalCount} />
      <Box
        ref={setNodeRef}
        sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}
      >
        {tasks.length === 0 ? (
          <EmptyState message="No tasks" />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </Box>
      <Button
        startIcon={<AddIcon />}
        onClick={() => onAddTask(columnId)}
        fullWidth
        sx={{
          mt: 1,
          justifyContent: 'flex-start',
          textTransform: 'none',
          bgcolor: 'grey.100',
          color: 'text.primary',
          '&:hover': { bgcolor: 'grey.200' },
        }}
      >
        Add task
      </Button>
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, p) => onPageChange(p)}
          size="small"
          sx={{ mt: 1.5, justifyContent: 'center', display: 'flex' }}
        />
      )}
    </Paper>
  );
}
