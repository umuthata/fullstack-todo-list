import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

const savedToken = localStorage.getItem("token");

const initialState: AuthState = {
    token: savedToken,
    isAuthenticated: savedToken !== null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setToken, logout } = authSlice.actions;

export default authSlice.reducer;