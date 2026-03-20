import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "http://localhost:5000/api/seller";

const initialState = {
    isLoading: false,
    sellerInfo: null,
    products: [],
    orders: [],
    error: null,
};

export const registerSeller = createAsyncThunk(
    "seller/register",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE}/register`, formData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Registration failed" });
        }
    }
);

export const fetchSellerProfile = createAsyncThunk(
    "seller/fetchProfile",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE}/profile/${userId}`, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Failed to fetch profile" });
        }
    }
);

export const updateSellerProfile = createAsyncThunk(
    "seller/updateProfile",
    async ({ userId, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`${BASE}/profile/${userId}`, data, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Update failed" });
        }
    }
);

export const fetchSellerProducts = createAsyncThunk(
    "seller/fetchProducts",
    async (sellerId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE}/products/${sellerId}`, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Failed to fetch products" });
        }
    }
);

export const addSellerProduct = createAsyncThunk(
    "seller/addProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${BASE}/products`, productData, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Failed to add product" });
        }
    }
);

export const editSellerProduct = createAsyncThunk(
    "seller/editProduct",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`${BASE}/products/${id}`, data, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Failed to edit product" });
        }
    }
);

export const deleteSellerProduct = createAsyncThunk(
    "seller/deleteProduct",
    async ({ id, sellerId }, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`${BASE}/products/${id}/${sellerId}`, { withCredentials: true });
            return { ...res.data, deletedId: id };
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Failed to delete product" });
        }
    }
);

export const fetchSellerOrders = createAsyncThunk(
    "seller/fetchOrders",
    async (sellerId, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${BASE}/orders/${sellerId}`, { withCredentials: true });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Failed to fetch orders" });
        }
    }
);

export const updateSellerOrderStatus = createAsyncThunk(
    "seller/updateOrderStatus",
    async ({ id, orderStatus }, { rejectWithValue }) => {
        try {
            const res = await axios.put(
                `${BASE}/orders/${id}/status`,
                { orderStatus },
                { withCredentials: true }
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Failed to update order status" });
        }
    }
);

const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        resetSellerState: (state) => {
            state.sellerInfo = null;
            state.products = [];
            state.orders = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchSellerProfile.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(fetchSellerProfile.fulfilled, (s, a) => {
                s.isLoading = false;
                s.sellerInfo = a.payload.data;
            })
            .addCase(fetchSellerProfile.rejected, (s, a) => {
                s.isLoading = false;
                s.error = a.payload?.message || "Failed to load profile";
            })

            // Update Profile
            .addCase(updateSellerProfile.pending, (s) => { s.isLoading = true; })
            .addCase(updateSellerProfile.fulfilled, (s, a) => {
                s.isLoading = false;
                s.sellerInfo = a.payload.data;
            })
            .addCase(updateSellerProfile.rejected, (s, a) => {
                s.isLoading = false;
                s.error = a.payload?.message || "Update failed";
            })

            // Fetch Products
            .addCase(fetchSellerProducts.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(fetchSellerProducts.fulfilled, (s, a) => {
                s.isLoading = false;
                s.products = a.payload.data || [];
            })
            .addCase(fetchSellerProducts.rejected, (s, a) => {
                s.isLoading = false;
                s.error = a.payload?.message || "Failed to load products";
            })

            // Add Product
            .addCase(addSellerProduct.fulfilled, (s, a) => {
                if (a.payload.data) s.products.push(a.payload.data);
            })
            .addCase(addSellerProduct.rejected, (s, a) => {
                s.error = a.payload?.message || "Failed to add product";
            })

            // Edit Product
            .addCase(editSellerProduct.fulfilled, (s, a) => {
                const idx = s.products.findIndex(p => p._id === a.payload.data?._id);
                if (idx !== -1) s.products[idx] = a.payload.data;
            })
            .addCase(editSellerProduct.rejected, (s, a) => {
                s.error = a.payload?.message || "Failed to edit product";
            })

            // Delete Product
            .addCase(deleteSellerProduct.fulfilled, (s, a) => {
                s.products = s.products.filter(p => p._id !== a.payload.deletedId);
            })
            .addCase(deleteSellerProduct.rejected, (s, a) => {
                s.error = a.payload?.message || "Failed to delete product";
            })

            // Fetch Orders
            .addCase(fetchSellerOrders.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(fetchSellerOrders.fulfilled, (s, a) => {
                s.isLoading = false;
                s.orders = a.payload.data || [];
            })
            .addCase(fetchSellerOrders.rejected, (s, a) => {
                s.isLoading = false;
                s.error = a.payload?.message || "Failed to load orders";
            })

            // Update Order Status
            .addCase(updateSellerOrderStatus.fulfilled, (s, a) => {
                const updatedOrder = a.payload.data;
                const index = s.orders.findIndex(o => o._id === updatedOrder._id);
                if (index !== -1) {
                    s.orders[index].orderStatus = updatedOrder.orderStatus;
                }
            })
            .addCase(updateSellerOrderStatus.rejected, (s, a) => {
                s.error = a.payload?.message || "Failed to update order status";
            });
    },
});

export const { resetSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
