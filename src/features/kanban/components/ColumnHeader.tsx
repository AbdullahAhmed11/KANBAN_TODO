import { Box, Typography } from '@mui/material';
import { COLUMN_LABELS, COLUMN_COLORS } from '../constants';
import type { ColumnId } from '../../../types/task';

interface ColumnHeaderProps {
  columnId: ColumnId;
  count: number;
}

export function ColumnHeader({ columnId, count }: ColumnHeaderProps) {
  const color = COLUMN_COLORS[columnId];
  const label = COLUMN_LABELS[columnId];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: 0.3 }}>
        {label} {count}
      </Typography>
    </Box>
  );
}
