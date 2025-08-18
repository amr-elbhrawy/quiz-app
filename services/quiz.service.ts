import { axiosInstance } from './api';
import { QUIZ_URL } from './endpoints';

// ✅ Cache بسيط للنتائج
const resultsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface QuizResultsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'date' | 'title' | 'participants';
  sortOrder?: 'asc' | 'desc';
}

export const QuizService = {
  // Get all quizzes
  getAll: () => axiosInstance.get(QUIZ_URL.GET_ALL),
  
  // Get quiz by ID
  getById: (id: string) => axiosInstance.get(QUIZ_URL.GET_BY_ID(id)),
  
  // Create new quiz
  create: (data: {
    title: string;
    description: string;
    duration: number;
    questions_number: number;
    score_per_question: number;
    schadule: string;
    difficulty: string;
    type: string;
    group: string;
  }) => axiosInstance.post(QUIZ_URL.CREATE, data),
  
  // Update quiz - مع تصفية الحقول الآمنة
  update: (id: string, data: any) => {
    const safeFields = {
      title: data.title,
      description: data.description,
      duration: data.duration,
      score_per_question: data.score_per_question,
      schadule: data.schadule,
      questions_number: data.questions_number
    };
        
    const cleanData = Object.keys(safeFields).reduce((acc, key) => {
      const value = safeFields[key as keyof typeof safeFields];
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
        
    console.log('Sending safe data for quiz update:', cleanData);
    return axiosInstance.put(QUIZ_URL.UPDATE(id), cleanData);
  },
  
  // Delete quiz
  delete: (id: string) => axiosInstance.delete(QUIZ_URL.DELETE(id)),
  
  // Join quiz - مع debugging
  join: (data: { code: string }) => {
    console.log('Joining quiz with code:', data.code);
    return axiosInstance.post(QUIZ_URL.JOIN, data)
      .then(response => {
        console.log('Join API response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Join API error:', error);
        throw error;
      });
  },
  
  // Submit quiz answers
  submit: (
    quizId: string,
    data: { answers: { question: string; answer: string }[] }
  ) => axiosInstance.post(QUIZ_URL.SUBMIT(quizId), data),
  
  // Get quiz without answers
  getWithoutAnswers: (id: string) => {
    console.log('Fetching quiz without answers, ID:', id);
    return axiosInstance.get(QUIZ_URL.WITHOUT_ANSWERS(id))
      .then(response => {
        console.log('Quiz without answers response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Quiz without answers error:', error);
        throw error;
      });
  },
  
  // ✅ NEW: Get paginated quiz results مع caching
  getResultsPaginated: async (params: QuizResultsParams = {}): Promise<PaginatedResponse<any>> => {
    const { page = 1, limit = 10, search, sortBy = 'date', sortOrder = 'desc' } = params;
    
    // إنشاء cache key
    const cacheKey = JSON.stringify({ page, limit, search, sortBy, sortOrder });
    const now = Date.now();
    
    // فحص الـ cache
    if (resultsCache.has(cacheKey)) {
      const cached = resultsCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Returning cached results');
        return cached.data;
      }
    }
    
    try {
      // إنشاء query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });
      
      if (search) queryParams.append('search', search);
      
      const response = await axiosInstance.get(`${QUIZ_URL.RESULT}?${queryParams}`);
      
      // حفظ في الـ cache
      resultsCache.set(cacheKey, {
        data: response.data,
        timestamp: now
      });
      
      console.log(`📄 Fetched page ${page} with ${response.data.data?.length || 0} results`);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching paginated results:', error);
      throw error;
    }
  },
  
  // ✅ OLD: Get all results (fallback)
  getResult: () => {
    console.warn('⚠️ Using old getResult method - consider using getResultsPaginated');
    return axiosInstance.get(QUIZ_URL.RESULT);
  },
  
  // Get incoming quizzes
  getIncoming: () => axiosInstance.get(QUIZ_URL.INCOMMING),
  
  // Get completed quizzes
  getCompleted: () => axiosInstance.get(QUIZ_URL.COMPLETED),
  
  // Reassign quiz
  reassign: (
    quizId: string,
    data: { group: string; schadule: string; duration: number }
  ) => axiosInstance.put(QUIZ_URL.REASSIGN(quizId), data),
  
  // ✅ Clear cache utility
  clearResultsCache: () => {
    resultsCache.clear();
    console.log('🧹 Results cache cleared');
  },
  
  // ✅ Get specific quiz results
  getQuizResults: async (quizId: string, page = 1, limit = 10) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      const response = await axiosInstance.get(`${QUIZ_URL.RESULT}/${quizId}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching quiz-specific results:', error);
      throw error;
    }
  }
};