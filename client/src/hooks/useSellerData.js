import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchSellerProfile,
    fetchSellerProducts,
    fetchSellerOrders,
} from "@/store/seller/seller-slice";

/**
 * useSellerData — shared hook for all seller pages.
 * Ensures sellerProfile is loaded once, and optionally fetches products/orders.
 *
 * @param {Object} options
 * @param {boolean} options.withProducts  - also fetch seller's products
 * @param {boolean} options.withOrders    - also fetch seller's orders
 */
export function useSellerData({ withProducts = false, withOrders = false } = {}) {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { sellerInfo, products, orders, isLoading, error } = useSelector((s) => s.seller);
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (!user?.id) return;
        if (hasFetchedRef.current && sellerInfo) return; // already loaded

        const load = async () => {
            hasFetchedRef.current = true;
            let info = sellerInfo;

            // Fetch profile if not already in store
            if (!info) {
                const res = await dispatch(fetchSellerProfile(user.id));
                info = res.payload?.data;
            }

            if (!info?._id) return; // not a seller or failed

            if (withProducts) dispatch(fetchSellerProducts(info._id));
            if (withOrders) dispatch(fetchSellerOrders(info._id));
        };

        load();
    }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // When sellerInfo appears for the first time (loaded from profile fetch),
    // trigger downstream fetches if they haven't run yet
    useEffect(() => {
        if (!sellerInfo?._id) return;

        if (withProducts && products.length === 0 && !isLoading) {
            dispatch(fetchSellerProducts(sellerInfo._id));
        }
        if (withOrders && orders.length === 0 && !isLoading) {
            dispatch(fetchSellerOrders(sellerInfo._id));
        }
    }, [sellerInfo?._id]); // eslint-disable-line react-hooks/exhaustive-deps

    return { user, sellerInfo, products, orders, isLoading, error };
}
