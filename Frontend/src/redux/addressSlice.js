import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
    name: "address",
    initialState: {
        addresses: [],
        selectedId: null,
        status: 'idle'
    },
    reducers: {
        setAddresses: (state, action) => { 
            state.addresses = action.payload; 
        },
        setSelectedId: (state, action) => { 
            state.selectedId = action.payload; 
        },
        addAddress: (state, action) => {
            state.addresses.push(action.payload);
            state.selectedId = action.payload._id;
        },
        updateAddressState: (state, action) => {
            const index = state.addresses.findIndex(a => a._id === action.payload._id);
            if (index !== -1) {
                state.addresses[index] = action.payload;
            }
        },
        removeAddress: (state, action) => {
            state.addresses = state.addresses.filter(a => a._id !== action.payload);
            if (state.selectedId === action.payload) {
                state.selectedId = null;
            }
        }
    }
});

export const { setAddresses, setSelectedId, addAddress, updateAddressState, removeAddress } = addressSlice.actions;
export default addressSlice.reducer;