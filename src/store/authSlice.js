import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserInfo, login } from "../apis/user";

const DEFAULT_AUTH_ERROR = {
  error: { message: "인증 요청을 처리하지 못했습니다." },
};

const getAuthError = (error) => error?.response?.data || DEFAULT_AUTH_ERROR;

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      const token = response.headers?.authorization;
      if (!token) return rejectWithValue(DEFAULT_AUTH_ERROR);

      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      return rejectWithValue(getAuthError(error));
    }
  },
);

export const getUserInfoThunk = createAsyncThunk(
  "auth/getUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserInfo();
      return response.data;
    } catch (error) {
      return rejectWithValue(getAuthError(error));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    isLoading: false,
    userName: "",
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("persist:root");
      state.isLoggedIn = false;
      state.isLoading = false;
      state.userName = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(loginThunk.fulfilled, (state) => {
        state.isLoggedIn = true;
        state.isLoading = false;
        state.error = null;
      }),
      builder.addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.error = action.payload?.error || DEFAULT_AUTH_ERROR.error;
      }),
      builder.addCase(getUserInfoThunk.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(getUserInfoThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.userName = action.payload.response.name;
        state.error = null;
      }),
      builder.addCase(getUserInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.userName = "";
        state.error = action.payload?.error || DEFAULT_AUTH_ERROR.error;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
