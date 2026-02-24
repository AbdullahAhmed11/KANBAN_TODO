import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useCreateTask, useUpdateTask } from '../hooks/useTaskMutations';
import { COLUMNS } from '../constants';
import type { Task } from '../../../types/task';
import type { ColumnId, Priority } from '../../../types/task';

interface TaskFormProps {
  open: boolean;
  task: Task | null;
  initialColumn?: ColumnId | null;
  onClose: () => void;
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function TaskForm({ open, task, initialColumn = null, onClose }: TaskFormProps) {
  const isEdit = Boolean(task);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState<ColumnId>('backlog');
  const [priority, setPriority] = useState<Priority>('medium');

  const createTask = useCreateTask({
    onSuccess: () => onClose(),
  });
  const updateTask = useUpdateTask({
    onSuccess: () => onClose(),
  });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setColumn(task.column);
      setPriority(task.priority ?? 'medium');
    } else {
      setTitle('');
      setDescription('');
      setColumn(initialColumn ?? 'backlog');
      setPriority('medium');
    }
  }, [task, initialColumn, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (isEdit && task) {
      updateTask.mutate({
        id: task.id,
        data: { title: title.trim(), description: description.trim(), column, priority },
      });
    } else {
      createTask.mutate({
        title: title.trim(),
        description: description.trim(),
        column,
        priority,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEdit ? 'Edit task' : 'New task'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              select
              label="Column"
              value={column}
              onChange={(e) => setColumn(e.target.value as ColumnId)}
              fullWidth
            >
              {COLUMNS.map(({ id, label }) => (
                <MenuItem key={id} value={id}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              fullWidth
            >
              {PRIORITIES.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!title.trim() || createTask.isPending || updateTask.isPending}
          >
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
