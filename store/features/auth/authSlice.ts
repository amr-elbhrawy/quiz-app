import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  loginThunk,
  signupThunk,
  forgetPasswordThunk,
  resetPasswordThunk,
  changePasswordThunk,
} from './authThunk';

interface AuthState {
  loading: boolean;
  loadingUser: boolean;
  error: string | null;
  successMsg: string | null;
  user: any | null;
  token: string | null;
}

const initialState: AuthState = {
  loading: false,
  loadingUser: true,  
  error: null,
  successMsg: null,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMsg = null;
    },
logout: (state) => {
  // تنظيف الـ state
  state.user = null;
  state.token = null;
  state.loading = false;
  state.loadingUser = false;
  state.error = null;
  state.successMsg = null;
  
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
 
  localStorage.clear();
},

    setUserFromStorageStart: (state) => {
      state.loadingUser = true;
    },
    setUserFromStorage: (state, action: PayloadAction<any | null>) => {
      state.user = action.payload;
      state.loadingUser = false;
    },
    setTokenFromStorage: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;

        const { accessToken, profile } = action.payload.data;

        state.user = profile;
        state.successMsg = 'Login successful';

        if (accessToken) {
          state.token = accessToken;
          localStorage.setItem('token', accessToken);
          localStorage.setItem('user', JSON.stringify(profile));
          console.log('Token saved successfully:', accessToken);
        } else {
          console.error('No token found in response:', action.payload);
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Signup
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.successMsg = 'Signup successful';

        const token = action.payload.token || action.payload.accessToken;
        if (token) {
          state.token = token;
          localStorage.setItem('token', token);
        }
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Forget Password
      .addCase(forgetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload;
      })
      .addCase(forgetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change Password
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearAuthMessages,
  logout,
  setTokenFromStorage,
  setUserFromStorage,
  setUserFromStorageStart,
} = authSlice.actions;
export default authSlice.reducer;
