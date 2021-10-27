import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  user: null | { name: string };
}

const initialState: UserState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.user = { name: action.payload };
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
