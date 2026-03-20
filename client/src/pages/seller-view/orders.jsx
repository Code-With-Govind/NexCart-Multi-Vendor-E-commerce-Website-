import { useState } from "react";
import { useSellerData } from "@/hooks/useSellerData";
import { ShoppingBag, Package, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateSellerOrderStatus } from "@/store/seller/seller-slice";
import { useToast } from "@/components/ui/use-toast";

const STATUS_STYLES = {
    pending: "bg-amber-500 text-white",
    confirmed: "bg-emerald-500 text-white",
    rejected: "bg-destructive text-white",
    delivered: "bg-blue-500 text-white",
    "in-process": "bg-purple-500 text-white",
};

function OrderCard({ order }) {
    const [expanded, setExpanded] = useState(false);
    const dispatch = useDispatch();
    const { toast } = useToast();

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        dispatch(updateSellerOrderStatus({ id: order._id, orderStatus: newStatus })).then(res => {
            if (res.meta.requestStatus === "fulfilled") {
                toast({ title: "✅ Order status updated!" });
            } else {
                toast({ title: "Failed to update order status", variant: "destructive" });
            }
        });
    };

    return (
        <div className="bg-white dark:bg-card rounded-2xl border border-border/50 shadow-soft hover:shadow-lg transition-all overflow-hidden">
            {/* Order Header */}
            <div
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 cursor-pointer bg-muted/5 hover:bg-muted/10 transition-colors"
                onClick={() => setExpanded((v) => !v)}
            >
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl mt-0.5">
                        <Package size={20} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-mono font-bold tracking-wider">
                            ORDER #{order._id?.slice(-10).toUpperCase()}
                        </p>
                        <p className="text-sm font-extrabold text-foreground mt-1">
                            {order.cartItems?.length || 0} item{order.cartItems?.length !== 1 ? "s" : ""}
                        </p>
                        {order.addressInfo?.city && (
                            <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">
                                📍 {order.addressInfo.city}
                                {order.addressInfo.pincode ? ` — ${order.addressInfo.pincode}` : ""}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="text-right">
                        <p className="text-lg font-extrabold text-foreground">₹{order.totalAmount}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            {order.orderDate
                                ? new Date(order.orderDate).toLocaleDateString("en-IN", {
                                    day: "numeric", month: "short", year: "numeric",
                                })
                                : "—"}
                        </p>
                    </div>

                    <select
                        value={order.orderStatus}
                        onChange={handleStatusChange}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border-r-[12px] border-transparent outline-none cursor-pointer shadow-sm ${STATUS_STYLES[order.orderStatus?.toLowerCase()] || "bg-muted text-muted-foreground"}`}
                    >
                        <option value="pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="in-process">In Process</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <div className="text-muted-foreground ml-2 p-1.5 bg-muted/50 rounded-full">
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>
            </div>

            {/* Expanded: Order Items */}
            {expanded && (
                <div className="border-t border-border/50 p-5 bg-white dark:bg-card">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Items in this order</p>
                    <div className="space-y-3">
                        {order.cartItems?.map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-muted/5 border border-border/50 rounded-xl">
                                <img
                                    src={item.image || "https://via.placeholder.com/60x60?text=?"}
                                    className="h-14 w-14 object-cover rounded-lg border border-border/50 bg-white flex-shrink-0"
                                    alt={item.title}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-foreground truncate">{item.title}</p>
                                    <p className="text-xs font-semibold text-muted-foreground mt-1">
                                        Qty <span className="text-primary font-bold px-1.5 py-0.5 bg-primary/10 rounded-md">{item.quantity}</span> · ₹{item.price} each
                                    </p>
                                </div>
                                <p className="text-sm font-extrabold text-foreground shrink-0">
                                    ₹{(Number(item.price) * Number(item.quantity)).toFixed(0)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Payment info */}
                    <div className="mt-5 pt-5 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span className={`px-3 py-1.5 rounded-full uppercase tracking-wider text-[10px] shadow-sm ${order.paymentStatus === "paid"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}>
                            Payment: {order.paymentStatus || "pending"}
                        </span>
                        <span className="uppercase tracking-wider">Via {order.paymentMethod || "—"}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SellerOrders() {
    const { orders, isLoading, error } = useSellerData({ withOrders: true });
    const [filter, setFilter] = useState("all");

    const filteredOrders = filter === "all"
        ? orders
        : orders.filter((o) => o.orderStatus === filter);

    const statusCounts = orders.reduce((acc, o) => {
        acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Orders</h1>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                        {orders.length} total order{orders.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-4 bg-destructive/10 border border-destructive/20 rounded-2xl p-5 mb-5">
                    <AlertCircle size={20} className="text-destructive shrink-0" />
                    <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
            )}

            {isLoading && orders.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-muted-foreground text-sm font-medium">Loading orders...</p>
                    </div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-24 bg-white dark:bg-card rounded-2xl border border-border/50 shadow-sm border-dashed">
                    <ShoppingBag size={64} className="mx-auto mb-5 text-primary opacity-20" />
                    <p className="font-bold text-lg text-foreground">No orders yet</p>
                    <p className="text-sm text-muted-foreground mt-2 font-medium max-w-sm mx-auto">
                        Orders from customers buying your products will appear here.
                    </p>
                </div>
            ) : (
                <>
                    {/* Filter tabs */}
                    <div className="flex gap-3 flex-wrap bg-white dark:bg-card p-2 rounded-2xl border border-border/50 shadow-sm">
                        {["all", "pending", "confirmed", "delivered", "in-process", "rejected"].map((status) => {
                            const count = status === "all" ? orders.length : (statusCounts[status] || 0);
                            if (status !== "all" && count === 0) return null;
                            return (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${filter === status
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-transparent text-muted-foreground hover:bg-muted"
                                        }`}
                                >
                                    {status} <span className="opacity-70 ml-1">({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Orders list */}
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground bg-white dark:bg-card rounded-2xl border border-border/50 border-dashed">
                            <p className="font-medium text-sm">No <strong className="uppercase">{filter}</strong> orders found.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {filteredOrders.map((order) => (
                                <OrderCard key={order._id} order={order} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
