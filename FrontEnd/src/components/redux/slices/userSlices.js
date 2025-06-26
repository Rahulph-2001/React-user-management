import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../../utils/axiosUserConfig';

const token = localStorage.getItem('token');
const baseUrl = import.meta.env.VITE_USER_URL;

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: token || null,
  loading: false,
  error: null,
};

// User Login
export const userLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await userApi.post(`login`, { email, password });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Register New User
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userApi.post(`signUp`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch User Profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token") || getState().user.token;
      const response = await userApi.get(`profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update User Profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updatedUserData, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token") || getState().user.token;
      const response = await userApi.put(`update-profile`, updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        if (action.payload.token) {
          state.token = action.payload.token;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        console.log('Fetching user profile...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        console.log('Profile fetched:', action.payload);
        state.loading = false;
        state.user = action.payload; // Update user object
        console.log('Updated user.profilepic:', action.payload.profilepic);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        console.log('Profile fetch error:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        console.log("PROFILE AT PENDING STATE");
        state.loading = true;
        state.error = null;
        console.log("PROFILE AT PENDING STATE",state.loading);
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        console.log('Profile updated:', action.payload);
        state.loading = false;
        state.user = action.payload; // Update user object
        console.log('Updated user.profilepic:', action.payload.profilepic);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;