import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserInfo, login } from "../apis/user";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      localStorage.setItem("token", response.headers.authorization);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
      return rejectWithValue(error.response.data);
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
      state.userName = "";
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
        state.error = action.payload.error;
      }),
      builder.addCase(getUserInfoThunk.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(getUserInfoThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.userName = action.payload.response.name;
      }),
      builder.addCase(getUserInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.error;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
