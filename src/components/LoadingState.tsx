import { Box, Skeleton } from '@mui/material';

export function LoadingState() {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rounded" height={80} sx={{ mb: 1.5 }} />
      <Skeleton variant="rounded" height={80} sx={{ mb: 1.5 }} />
      <Skeleton variant="rounded" height={80} />
    </Box>
  );
}
