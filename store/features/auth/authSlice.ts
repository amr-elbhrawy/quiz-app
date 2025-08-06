import { createSlice } from '@reduxjs/toolkit';
import {
  loginThunk,
  signupThunk,
  forgetPasswordThunk,
  resetPasswordThunk,
  changePasswordThunk,
} from './authThunk';

interface AuthState {
  loading: boolean;
  error: string | null;
  successMsg: string | null;
  user: any | null; 
}

const initialState: AuthState = {
  loading: false,
  error: null,
  successMsg: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMsg = null;
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
        state.user = action.payload;
        state.successMsg = 'Login successful';
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
        state.user = action.payload;
        state.successMsg = 'Signup successful';
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

export const { clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
