import {
  Box,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../../types/task';
import type { Priority } from '../../../types/task';

const PRIORITY_STYLES: Record<Priority, { bg: string; color: string }> = {
  high: { bg: '#f44336', color: '#fff' },
  medium: { bg: '#ff9800', color: '#fff' },
  low: { bg: '#9e9e9e', color: '#fff' },
};

const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: String(task.id),
    data: { task },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const priority: Priority = task.priority ?? 'medium';
  const priorityStyle = PRIORITY_STYLES[priority];
  const priorityLabel = PRIORITY_LABELS[priority];

  return (
    <>
      <Card
        ref={setNodeRef}
        variant="outlined"
        elevation={0}
        sx={{
          mb: 1.5,
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: isDragging ? 0.5 : 1,
          borderRadius: 2,
          boxShadow: 1,
          '&:active': { cursor: 'grabbing' },
        }}
        style={style}
        {...listeners}
        {...attributes}
      >
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ flex: 1, pr: 1 }}>
              {task.title}
            </Typography>
            <IconButton size="small" onClick={handleOpen} aria-label="Options">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {task.description || '—'}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography
              component="span"
              variant="caption"
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 1,
                backgroundColor: priorityStyle.bg,
                color: priorityStyle.color,
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            >
              {priorityLabel}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit(task);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onDelete(task.id);
          }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
