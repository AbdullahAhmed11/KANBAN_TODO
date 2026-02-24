import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  Container,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import { useCallback, useState } from 'react';
import { useAppDispatch } from './store';
import { setSearchTerm } from './store/slices/searchSlice';
import { useDebouncedSearch } from './features/kanban/hooks/useDebouncedSearch';
import { useTasksQuery } from './features/kanban/hooks/useTasksQuery';
import { KanbanBoard } from './features/kanban/components/KanbanBoard';
import { TaskForm } from './features/kanban/components/TaskForm.tsx';
import type { Task } from './types/task';
import type { ColumnId } from './types/task';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function App() {
  const dispatch = useAppDispatch();
  const [, debouncedSearch] = useDebouncedSearch();
  const { data: tasks = [] } = useTasksQuery(debouncedSearch);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForColumn, setCreateForColumn] = useState<ColumnId | null>(null);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleCloseForm = useCallback(() => {
    setEditingTask(null);
    setCreateOpen(false);
    setCreateForColumn(null);
  }, []);

  const handleAddTask = useCallback((columnId: ColumnId) => {
    setCreateForColumn(columnId);
    setCreateOpen(true);
  }, []);

  const taskCount = tasks.length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <GridViewIcon sx={{ fontSize: 28, color: 'text.secondary' }} />
            <Box>
              <Typography
                variant="h6"
                component="h1"
                sx={{ fontWeight: 700, letterSpacing: 0.5, lineHeight: 1.2 }}
              >
                KANBAN BOARD
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {taskCount} task{taskCount !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
          <TextField
            size="small"
            placeholder="Search tasks..."
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: '100%', sm: 240 },
              maxWidth: 320,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'grey.50',
                borderRadius: 2,
              },
            }}
          />
        </Toolbar>
      </AppBar>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          width: '100%',
          py: 3,
          px: 2,
          backgroundColor: 'background.default',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        <KanbanBoard onEditTask={handleEditTask} onAddTask={handleAddTask} />
      </Container>
      <TaskForm
        open={createOpen || Boolean(editingTask)}
        task={editingTask}
        initialColumn={createForColumn}
        onClose={handleCloseForm}
      />
    </ThemeProvider>
  );
}
