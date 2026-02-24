import { Box, Typography, Button } from '@mui/material';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
}: ErrorStateProps) {
  return (
    <Box
      sx={{
        py: 3,
        px: 2,
        textAlign: 'center',
        color: 'error.main',
      }}
    >
      <Typography variant="body2">{message}</Typography>
      {onRetry && (
        <Button size="small" onClick={onRetry} sx={{ mt: 1 }}>
          Retry
        </Button>
      )}
    </Box>
  );
}
