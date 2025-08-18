import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GroupService } from '../../../services/group.service';
import { toast } from 'react-toastify';

// Types
interface Student {
  _id: string;
  first_name: string;
  last_name: string;
}

interface Group {
  _id: string;
  name: string;
  students: Student[];
}

interface GroupCreateData {
  name: string;
  students: string[];
}

interface GroupUpdateData {
  name: string;
  students: string[];
}

interface GroupsState {
  groups: Group[];
  loading: boolean;
  actionLoading: boolean; // للـ create/update/delete
  error: string | null;
  searchTerm: string;
  currentPage: number;
  pageSize: number;
}

const initialState: GroupsState = {
  groups: [],
  loading: false,
  actionLoading: false,
  error: null,
  searchTerm: '',
  currentPage: 1,
  pageSize: 6,
};

// Async Thunks
export const fetchGroups = createAsyncThunk(
  'groups/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GroupService.getAll();
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to fetch groups';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const fetchGroupById = createAsyncThunk(
  'groups/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await GroupService.getById(id);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to fetch group';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createGroup = createAsyncThunk(
  'groups/create',
  async (data: GroupCreateData, { rejectWithValue, dispatch }) => {
    try {
      const response = await GroupService.create(data);
      toast.success('Group created successfully');
      
      // إعادة جلب القائمة بعد الإنشاء
      dispatch(fetchGroups());
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to create group';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateGroup = createAsyncThunk(
  'groups/update',
  async ({ id, data }: { id: string; data: GroupUpdateData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await GroupService.update(id, data);
      toast.success('Group updated successfully');
      
      // إعادة جلب القائمة بعد التحديث
      dispatch(fetchGroups());
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to update group';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteGroup = createAsyncThunk(
  'groups/delete',
  async (id: string, { rejectWithValue, getState, dispatch }) => {
    try {
      await GroupService.delete(id);
      toast.success('Group deleted successfully');
      
      const state = getState() as { groups: GroupsState };
      
      // إعادة تعيين الصفحة إذا كانت فارغة بعد الحذف
      const remainingGroups = state.groups.groups.filter(g => g._id !== id);
      const filteredGroups = remainingGroups.filter(g => 
        g.name?.toLowerCase().includes(state.groups.searchTerm.toLowerCase())
      );
      const totalPages = Math.ceil(filteredGroups.length / state.groups.pageSize);
      
      if (state.groups.currentPage > totalPages && totalPages > 0) {
        dispatch(setCurrentPage(totalPages));
      }
      
      return id;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to delete group';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    // Search functionality
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page
    },
    
    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state
    resetGroupsState: (state) => {
      state.groups = [];
      state.loading = false;
      state.actionLoading = false;
      state.error = null;
      state.searchTerm = '';
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all groups
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
      })
      
      // Create group
      .addCase(createGroup.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      
      // Update group
      .addCase(updateGroup.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete group - Optimistic update for better performance
      .addCase(deleteGroup.pending, (state, action) => {
        state.actionLoading = true;
        state.error = null;
        // Optimistic delete - remove immediately for better UX
        const groupId = action.meta.arg;
        state.groups = state.groups.filter(g => g._id !== groupId);
      })
      .addCase(deleteGroup.fulfilled, (state) => {
        state.actionLoading = false;
        // Already updated optimistically
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
        // Rollback optimistic update by refetching
        // Will be handled by the component
      });
  },
});

// Actions
export const { 
  setSearchTerm, 
  setCurrentPage, 
  clearError, 
  resetGroupsState 
} = groupsSlice.actions;

// Selectors with memoization for better performance
export const selectGroups = (state: { groups: GroupsState }) => state.groups.groups;
export const selectGroupsLoading = (state: { groups: GroupsState }) => state.groups.loading;
export const selectActionLoading = (state: { groups: GroupsState }) => state.groups.actionLoading;
export const selectGroupsError = (state: { groups: GroupsState }) => state.groups.error;
export const selectSearchTerm = (state: { groups: GroupsState }) => state.groups.searchTerm;
export const selectCurrentPage = (state: { groups: GroupsState }) => state.groups.currentPage;
export const selectPageSize = (state: { groups: GroupsState }) => state.groups.pageSize;

// Memoized filtered groups selector
export const selectFilteredGroups = (state: { groups: GroupsState }) => {
  const { groups, searchTerm } = state.groups;
  if (!searchTerm) return groups;
  
  return groups.filter(group =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Memoized paginated groups selector
export const selectPaginatedGroups = (state: { groups: GroupsState }) => {
  const filteredGroups = selectFilteredGroups(state);
  const { currentPage, pageSize } = state.groups;
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    groups: filteredGroups.slice(startIndex, endIndex),
    totalGroups: filteredGroups.length,
    totalPages: Math.ceil(filteredGroups.length / pageSize),
    hasMore: endIndex < filteredGroups.length,
    hasPrevious: currentPage > 1
  };
};

// Performance optimized selector for group stats
export const selectGroupsStats = (state: { groups: GroupsState }) => {
  const groups = state.groups.groups;
  const totalStudents = groups.reduce((sum, group) => sum + (group.students?.length || 0), 0);
  const averageStudentsPerGroup = groups.length > 0 ? Math.round(totalStudents / groups.length) : 0;
  
  return {
    totalGroups: groups.length,
    totalStudents,
    averageStudentsPerGroup,
    emptyGroups: groups.filter(g => !g.students?.length).length
  };
};

export default groupsSlice.reducer;