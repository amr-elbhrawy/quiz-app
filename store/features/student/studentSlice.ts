import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { StudentService } from "@/services/student.service";
import { toast } from "react-toastify";

// Types
interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  role: string;
  group?: {
    _id: string;
    name: string;
  };
}

interface StudentsState {
  students: Student[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  pageSize: number;
}

const initialState: StudentsState = {
  students: [],
  loading: false,
  actionLoading: false,
  error: null,
  searchTerm: "",
  currentPage: 1,
  pageSize: 8,
};

// -------- Async Thunks --------

// Get all
export const fetchStudents = createAsyncThunk(
  "students/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await StudentService.getAll();
      return res.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to fetch students";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get all without group
export const fetchStudentsWithoutGroup = createAsyncThunk(
  "students/fetchWithoutGroup",
  async (_, { rejectWithValue }) => {
    try {
      const res = await StudentService.getAllWithoutGroup();
      return res.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to fetch ungrouped students";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete student
export const deleteStudent = createAsyncThunk(
  "students/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await StudentService.delete(id);
      toast.success("Student deleted successfully");
      return id;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to delete student";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Add student to group
export const addStudentToGroup = createAsyncThunk(
  "students/addToGroup",
  async ({ studentId, groupId }: { studentId: string; groupId: string }, { rejectWithValue }) => {
    try {
      const res = await StudentService.addToGroup(studentId, groupId);
      toast.success("Student added to group successfully");
      return res.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to add student to group";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update student group
export const updateStudentGroup = createAsyncThunk(
  "students/updateGroup",
  async ({ studentId, groupId }: { studentId: string; groupId: string }, { rejectWithValue }) => {
    try {
      const res = await StudentService.updateGroup(studentId, groupId);
      toast.success("Student group updated successfully");
      return res.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update student group";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// -------- Slice --------
const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStudentsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteStudent.pending, (state, action) => {
        state.actionLoading = true;
        const id = action.meta.arg;
        state.students = state.students.filter((s) => s._id !== id); // Optimistic
      })
      .addCase(deleteStudent.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // Add to group
      .addCase(addStudentToGroup.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(addStudentToGroup.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.students = state.students.map((s) =>
          s._id === updated._id ? updated : s
        );
      })
      .addCase(addStudentToGroup.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      // Update group
      .addCase(updateStudentGroup.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateStudentGroup.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.students = state.students.map((s) =>
          s._id === updated._id ? updated : s
        );
      })
      .addCase(updateStudentGroup.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { setSearchTerm, setCurrentPage, clearError, resetStudentsState } =
  studentsSlice.actions;

// Selectors
export const selectStudents = (state: { students: StudentsState }) =>
  state.students.students;
export const selectStudentsLoading = (state: { students: StudentsState }) =>
  state.students.loading;
export const selectStudentsError = (state: { students: StudentsState }) =>
  state.students.error;
export const selectStudentsActionLoading = (state: { students: StudentsState }) =>
  state.students.actionLoading;
export const selectStudentsSearchTerm = (state: { students: StudentsState }) =>
  state.students.searchTerm;

// Filtered + Paginated
export const selectFilteredStudents = (state: { students: StudentsState }) => {
  const { students, searchTerm } = state.students;
  if (!searchTerm) return students;
  return students.filter(
    (s) =>
      s.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const selectPaginatedStudents = (state: { students: StudentsState }) => {
  const filtered = selectFilteredStudents(state);
  const { currentPage, pageSize } = state.students;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    students: filtered.slice(start, end),
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / pageSize),
    hasMore: end < filtered.length,
  };
};
// في نهاية ملف studentSlice.ts قبل export default
// في نهاية ملف studentSlice.ts - Fixed selector
export const selectStudentsWithoutGroup = (state: { students: StudentsState }) => {
  // التأكد من وجود students array قبل الفلترة
  const students = state.students?.students || [];
  return students.filter(student => !student.group);
};
export default studentsSlice.reducer;
