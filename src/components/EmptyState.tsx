import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  message?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  message = 'No items yet',
  children,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 3,
        px: 2,
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <Typography variant="body2">{message}</Typography>
      {children}
    </Box>
  );
}
