

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/axiosAdminConfig";

const initialState = {
  admin: JSON.parse(localStorage.getItem('adminData')) || null,
  token: localStorage.getItem('adminToken') || null,
  users: [],
  userForEdit: null,
  loading: false,
  error: null,
  updateStatus: null,
};

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("login", credentials);
      return {
        token: response.data.token,
        admin: response.data.admin,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const getUserForEdit = createAsyncThunk(
  "admin/getUserForEdit",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`edit-user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`update-user/${id}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`delete-user/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

export const createUser = createAsyncThunk(
  "admin/createUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("create-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.newUser;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Create failed");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
      state.users = [];
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        localStorage.setItem("adminToken", action.payload.token);
        localStorage.setItem("adminData", JSON.stringify(action.payload.admin));
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserForEdit.pending, (state) => {
        state.loading = true;
        state.userForEdit = null;
      })
      .addCase(getUserForEdit.fulfilled, (state, action) => {
        state.loading = false;
        state.userForEdit = action.payload;
      })
      .addCase(getUserForEdit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.updateStatus = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = "success";
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
        state.userForEdit = action.payload; // Update userForEdit
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.updateStatus = "error";
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;