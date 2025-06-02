import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";
import {
  RegisterData,
  LoginData,
  User,
  RegisterResponse,
  AuthState,
  ApiError,
} from "../../types/auth";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await apiService.get<User>("/users/me", token);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

export const register = createAsyncThunk<
  RegisterResponse,
  RegisterData,
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const response = await apiService.post("/auth/register", data);
    return response.data as RegisterResponse;
  } catch (error) {
    const apiError = error as ApiError;
    const message = apiError.response?.data?.message ?? "Registration failed";

    return rejectWithValue(message);
  }
});

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiService.post("/auth/login", data);
      const { token }: { token: string } = response?.data as { token: string };

      console.log("data", response?.data);
      localStorage.setItem("token", token);
      // Fetch user profile after successful login
      await dispatch(fetchUserProfile());
      return token;
    } catch (error) {
      const apiError = error as ApiError;
      console.log("error is ", apiError.response?.data);
      return rejectWithValue(apiError.response?.data || "Login failed");
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (token: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiService.post("/auth/google", { token });
      const { token: authToken }: { token: string } = response?.data as {
        token: string;
      };
      localStorage.setItem("token", authToken);
      await dispatch(fetchUserProfile());
      return authToken;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data || "Google login failed");
    }
  }
);

export const githubLogin = createAsyncThunk(
  "auth/githubLogin",
  async (code: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiService.post("/auth/github", { code });
      const { token: authToken }: { token: string } = response?.data as {
        token: string;
      };
      localStorage.setItem("token", authToken);
      await dispatch(fetchUserProfile());
      return authToken;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.response?.data || "GitHub login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(githubLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(githubLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(githubLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
