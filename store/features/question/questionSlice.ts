// src/store/features/question/questionSlice.ts
import { createSlice, createAsyncThunk, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { QuestionService } from "@/services/question.service";

 export interface Question {
  _id: string;
  id?: string;
  title: string;
  description: string;
  options: { A: string; B: string; C: string; D: string };
  answer: "A" | "B" | "C" | "D";
  difficulty: "easy" | "medium" | "hard";
  type: "FE" | "BE";
  createdAt?: string;
  updatedAt?: string;
}

interface QuestionState {
  questions: Question[];
  question: Question | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
  totalCount: number;
}

const initialState: QuestionState = {
  questions: [],
  question: null,
  loading: false,
  error: null,
  lastFetch: null,
  totalCount: 0,
};

 const CACHE_TIMEOUT = 5 * 60 * 1000;

 export const fetchQuestions = createAsyncThunk(
  "questions/fetchAll",
  async (forceRefresh: boolean = false, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { questions: QuestionState };
      const now = Date.now();
      
       if (!forceRefresh && 
          state.questions.lastFetch && 
          now - state.questions.lastFetch < CACHE_TIMEOUT &&
          state.questions.questions.length > 0) {
        return state.questions.questions;
      }

      const res = await QuestionService.getAll();
      return res.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Error fetching questions";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchQuestionById = createAsyncThunk(
  "questions/fetchById",
  async (id: string, { getState, rejectWithValue }) => {
    try {
       const state = getState() as { questions: QuestionState };
      const cachedQuestion = state.questions.questions.find(q => q._id === id);
      
      if (cachedQuestion) {
        return cachedQuestion;
      }

      const res = await QuestionService.getById(id);
      return res.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Error fetching question";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createQuestion = createAsyncThunk(
  "questions/create",
  async (data: Omit<Question, "_id" | "createdAt" | "updatedAt">, { rejectWithValue }) => {
    try {
      const res = await QuestionService.create(data);
      return res.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Error creating question";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateQuestion = createAsyncThunk(
  "questions/update",
  async ({ id, data }: { 
    id: string; 
    data: Omit<Question, "_id" | "createdAt" | "updatedAt"> 
  }, { rejectWithValue }) => {
    try {
      const res = await QuestionService.update(id, data);
      return res.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Error updating question";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "questions/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await QuestionService.delete(id);
      return id;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Error deleting question";
      return rejectWithValue(errorMessage);
    }
  }
);

 const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
     clearError: (state) => {
      state.error = null;
    },
     clearQuestion: (state) => {
      state.question = null;
    },
     optimisticDeleteQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(q => q._id !== action.payload);
      state.totalCount = Math.max(0, state.totalCount - 1);
    },
     resetQuestionState: (state) => {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      //  Fetch All Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
        state.totalCount = action.payload.length;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //   Fetch Question By ID
      .addCase(fetchQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.question = action.payload;
        
         const existingIndex = state.questions.findIndex(q => q._id === action.payload._id);
        if (existingIndex === -1) {
          state.questions.push(action.payload);
          state.totalCount += 1;
        } else {
          state.questions[existingIndex] = action.payload;
        }
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(createQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.unshift(action.payload); // إضافة في البداية
        state.totalCount += 1;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //   Update Question
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.questions.findIndex((q) => q._id === action.payload._id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
         if (state.question && state.question._id === action.payload._id) {
          state.question = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(deleteQuestion.pending, (state) => {
        state.error = null;
         
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
       
        state.questions = state.questions.filter((q) => q._id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
        
         if (state.question && state.question._id === action.payload) {
          state.question = null;
        }
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.error = action.payload as string;
   
      });
  },
});

//   Selectors  
export const selectAllQuestions = (state: { questions: QuestionState }) => 
  state.questions.questions;

export const selectQuestionsLoading = (state: { questions: QuestionState }) => 
  state.questions.loading;

export const selectQuestionsError = (state: { questions: QuestionState }) => 
  state.questions.error;

export const selectCurrentQuestion = (state: { questions: QuestionState }) => 
  state.questions.question;

export const selectQuestionsCount = (state: { questions: QuestionState }) => 
  state.questions.totalCount;

//   Memoized selectors
export const selectQuestionsByDifficulty = createSelector(
  [selectAllQuestions, (state, difficulty: string) => difficulty],
  (questions, difficulty) => 
    questions.filter(question => question.difficulty === difficulty)
);

export const selectQuestionsByType = createSelector(
  [selectAllQuestions, (state, type: string) => type],
  (questions, type) => 
    questions.filter(question => question.type === type)
);

export const selectQuestionById = createSelector(
  [selectAllQuestions, (state, id: string) => id],
  (questions, id) => 
    questions.find(question => question._id === id)
);

//  Combined selectors for statistics
export const selectQuestionsStats = createSelector(
  [selectAllQuestions],
  (questions) => ({
    total: questions.length,
    easy: questions.filter(q => q.difficulty === 'easy').length,
    medium: questions.filter(q => q.difficulty === 'medium').length,
    hard: questions.filter(q => q.difficulty === 'hard').length,
    frontend: questions.filter(q => q.type === 'FE').length,
    backend: questions.filter(q => q.type === 'BE').length,
  })
);

//   Actions
export const { 
  clearError, 
  clearQuestion, 
  optimisticDeleteQuestion, 
  resetQuestionState 
} = questionSlice.actions;

export default questionSlice.reducer;