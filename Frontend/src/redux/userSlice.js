import { createSlice } from "@reduxjs/toolkit";

const getInitialUserState = () => {
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            return JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("Could not load user from localStorage", e);
    }
    return null;
};

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: getInitialUserState(), 
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("user");
            }
        },
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
        }
    }
})

export const { setUser, logoutUser } = userSlice.actions; 
export default userSlice.reducer;