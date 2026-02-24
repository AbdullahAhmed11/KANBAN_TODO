import { createSlice } from '@reduxjs/toolkit';

interface SearchState {
  term: string;
}

const initialState: SearchState = {
  term: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: { payload: string }) => {
      state.term = action.payload;
    },
  },
});

export const { setSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;
