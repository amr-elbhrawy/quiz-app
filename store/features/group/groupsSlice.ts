import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Update the import path below if the actual location is different
import { GroupService } from '../../../services/group.service';
import { toast } from 'react-toastify';

interface Group {
  id: string;
  name: string;
  students: number;
}

interface GroupsState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  loading: false,
  error: null,
};

export const fetchGroups = createAsyncThunk(
  'groups/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await GroupService.getAll();
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to fetch groups');
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default groupsSlice.reducer;
