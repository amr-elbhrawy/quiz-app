// src/store/features/quiz/quizSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { QuizService } from "@/services/quiz.service";

interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface QuizState {
  quizzes: any[];
  quiz: any | null;
  result: any | null;
  
  // ✅ NEW: Paginated results
  paginatedResults: PaginatedData<any> | null;
  resultsLoading: boolean;
  resultsError: string | null;
  
  incoming: any[];
  completed: any[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  quiz: null,
  result: null,
  
  // Paginated results
  paginatedResults: null,
  resultsLoading: false,
  resultsError: null,
  
  incoming: [],
  completed: [],
  loading: false,
  error: null,
  successMessage: null,
};

// ✅ NEW: Fetch paginated results
export const fetchPaginatedResults = createAsyncThunk(
  "quiz/fetchPaginatedResults",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
      forceRefresh?: boolean;
    } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { quiz: QuizState };
      const { page = 1, limit = 10, forceRefresh = false } = params;
      
      // تجنب الطلب إذا كانت النتائج موجودة وليست قديمة
      if (!forceRefresh && state.quiz.paginatedResults?.page === page && !state.quiz.resultsLoading) {
        return state.quiz.paginatedResults;
      }
      
      console.log(`🔄 Fetching results - Page: ${page}, Limit: ${limit}`);
      const response = await QuizService.getResultsPaginated(params);
      return response;
    } catch (err: any) {
      console.error('❌ fetchPaginatedResults error:', err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ OPTIMIZED: Lightweight initial load
export const fetchResultsSummary = createAsyncThunk(
  "quiz/fetchResultsSummary",
  async (_, { rejectWithValue }) => {
    try {
      // جلب الصفحة الأولى فقط للعرض السريع
      const response = await QuizService.getResultsPaginated({ 
        page: 1, 
        limit: 5 // عدد أقل للتحميل السريع
      });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 باقي الـ Thunks (بدون تغيير)
export const fetchQuizzes = createAsyncThunk(
  "quiz/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await QuizService.getAll();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  "quiz/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await QuizService.getById(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createQuiz = createAsyncThunk(
  "quiz/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await QuizService.create(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "quiz/update",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await QuizService.update(id, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "quiz/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await QuizService.delete(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const joinQuiz = createAsyncThunk(
  "quiz/join",
  async (data: { code: string }, { rejectWithValue }) => {
    try {
      const res = await QuizService.join(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "quiz/submit",
  async (
    { quizId, data }: { quizId: string; data: { answers: { question: string; answer: string }[] } },
    { rejectWithValue }
  ) => {
    try {
      const res = await QuizService.submit(quizId, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchQuizWithoutAnswers = createAsyncThunk(
  "quiz/withoutAnswers",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await QuizService.getWithoutAnswers(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ LEGACY: Keep for backward compatibility
export const fetchQuizResult = createAsyncThunk(
  "quiz/result",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { quiz: QuizState };
    if (state.quiz.result && !state.quiz.loading) {
      return state.quiz.result;
    }
    
    try {
      const res = await QuizService.getResult();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchIncomingQuizzes = createAsyncThunk(
  "quiz/incoming",
  async (_, { rejectWithValue }) => {
    try {
      const res = await QuizService.getIncoming();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchCompletedQuizzes = createAsyncThunk(
  "quiz/completed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await QuizService.getCompleted();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const reassignQuiz = createAsyncThunk(
  "quiz/reassign",
  async (
    { quizId, data }: { quizId: string; data: { group: string; schadule: string; duration: number } },
    { rejectWithValue }
  ) => {
    try {
      const res = await QuizService.reassign(quizId, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Slice
const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.resultsError = null;
    },
    clearQuiz: (state) => {
      state.quiz = null;
    },
    clearResult: (state) => {
      state.result = null;
    },
    clearPaginatedResults: (state) => {
      state.paginatedResults = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    // ✅ NEW: Update single result in cache
    updateResultInCache: (state, action: PayloadAction<any>) => {
      if (state.paginatedResults) {
        const index = state.paginatedResults.data.findIndex(
          item => item._id === action.payload._id
        );
        if (index !== -1) {
          state.paginatedResults.data[index] = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Generic helpers
    const pending = (state: QuizState) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    };
    const rejected = (state: QuizState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };
    
    // Results specific helpers
    const resultsPending = (state: QuizState) => {
      state.resultsLoading = true;
      state.resultsError = null;
    };
    const resultsRejected = (state: QuizState, action: any) => {
      state.resultsLoading = false;
      state.resultsError = action.payload as string;
    };

    // ✅ NEW: Paginated results
    builder.addCase(fetchPaginatedResults.pending, resultsPending);
    builder.addCase(fetchPaginatedResults.fulfilled, (state, action) => {
      state.resultsLoading = false;
      state.paginatedResults = action.payload;
    });
    builder.addCase(fetchPaginatedResults.rejected, resultsRejected);

    // ✅ NEW: Results summary
    builder.addCase(fetchResultsSummary.pending, resultsPending);
    builder.addCase(fetchResultsSummary.fulfilled, (state, action) => {
      state.resultsLoading = false;
      state.paginatedResults = action.payload;
    });
    builder.addCase(fetchResultsSummary.rejected, resultsRejected);

    // باقي الـ cases (بدون تغيير)
    builder.addCase(fetchQuizzes.pending, pending);
    builder.addCase(fetchQuizzes.fulfilled, (state, action) => {
      state.loading = false;
      state.quizzes = action.payload;
    });
    builder.addCase(fetchQuizzes.rejected, rejected);

    builder.addCase(fetchQuizById.pending, pending);
    builder.addCase(fetchQuizById.fulfilled, (state, action) => {
      state.loading = false;
      state.quiz = action.payload;
    });
    builder.addCase(fetchQuizById.rejected, rejected);

    builder.addCase(createQuiz.pending, pending);
    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.loading = false;
      state.quizzes.push(action.payload);
      state.successMessage = "Quiz created successfully!";
      // Clear cache when new quiz is created
      state.paginatedResults = null;
    });
    builder.addCase(createQuiz.rejected, rejected);

    builder.addCase(updateQuiz.pending, pending);
    builder.addCase(updateQuiz.fulfilled, (state, action) => {
      state.loading = false;
      state.quiz = action.payload;
      state.successMessage = "Quiz updated successfully!";
    });
    builder.addCase(updateQuiz.rejected, rejected);

    builder.addCase(deleteQuiz.pending, pending);
    builder.addCase(deleteQuiz.fulfilled, (state, action) => {
      state.loading = false;
      state.quizzes = state.quizzes.filter((q) => q.id !== action.payload);
      state.successMessage = "Quiz deleted successfully!";
      // Clear cache when quiz is deleted
      state.paginatedResults = null;
    });
    builder.addCase(deleteQuiz.rejected, rejected);

    builder.addCase(joinQuiz.pending, pending);
    builder.addCase(joinQuiz.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = "Joined quiz successfully!";
    });
    builder.addCase(joinQuiz.rejected, rejected);

    builder.addCase(submitQuiz.pending, pending);
    builder.addCase(submitQuiz.fulfilled, (state, action) => {
      state.loading = false;
      state.result = action.payload;
      state.successMessage = "Quiz submitted successfully!";
    });
    builder.addCase(submitQuiz.rejected, rejected);

    builder.addCase(fetchQuizWithoutAnswers.pending, pending);
    builder.addCase(fetchQuizWithoutAnswers.fulfilled, (state, action) => {
      state.loading = false;
      state.quiz = action.payload;
    });
    builder.addCase(fetchQuizWithoutAnswers.rejected, rejected);

    // Legacy result
    builder.addCase(fetchQuizResult.pending, pending);
    builder.addCase(fetchQuizResult.fulfilled, (state, action) => {
      state.loading = false;
      state.result = action.payload;
    });
    builder.addCase(fetchQuizResult.rejected, rejected);

    builder.addCase(fetchIncomingQuizzes.pending, pending);
    builder.addCase(fetchIncomingQuizzes.fulfilled, (state, action) => {
      state.loading = false;
      state.incoming = action.payload;
    });
    builder.addCase(fetchIncomingQuizzes.rejected, rejected);

    builder.addCase(fetchCompletedQuizzes.pending, pending);
    builder.addCase(fetchCompletedQuizzes.fulfilled, (state, action) => {
      state.loading = false;
      state.completed = action.payload;
    });
    builder.addCase(fetchCompletedQuizzes.rejected, rejected);

    builder.addCase(reassignQuiz.pending, pending);
    builder.addCase(reassignQuiz.fulfilled, (state, action) => {
      state.loading = false;
      state.quiz = action.payload;
      state.successMessage = "Quiz reassigned successfully!";
    });
    builder.addCase(reassignQuiz.rejected, rejected);
  },
});

export const { 
  clearError, 
  clearQuiz, 
  clearResult, 
  clearPaginatedResults,
  clearSuccessMessage,
  updateResultInCache
} = quizSlice.actions;

export default quizSlice.reducer;