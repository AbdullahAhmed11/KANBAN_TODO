import { useAppSelector } from '../../../store';
import type { RootState } from '../../../store';
import { useDebounce } from '../../../hooks/useDebounce';

const SEARCH_DEBOUNCE_MS = 300;

export function useDebouncedSearch(): [string, string] {
  const searchTerm = useAppSelector((state: RootState) => state.search.term);
  const debouncedSearch = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS);
  return [searchTerm, debouncedSearch];
}
