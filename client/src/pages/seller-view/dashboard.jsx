import { useSellerData } from "@/hooks/useSellerData";
import { Package, ShoppingBag, IndianRupee, Clock, TrendingUp, AlertCircle } from "lucide-react";

export default function SellerDashboard() {
    const { sellerInfo, products, orders, isLoading } = useSellerData({
        withProducts: true,
        withOrders: true,
    });

    if (isLoading && !sellerInfo) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 text-sm">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (sellerInfo?.status === "pending") {
        return (
            <div className="flex flex-col items-center justify-center h-full py-24">
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-10 text-center max-w-md shadow-sm">
                    <Clock size={48} className="text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Approval Pending</h2>
                    <p className="text-gray-500">
                        Your seller registration is under review. An admin will approve your account shortly.
                    </p>
                </div>
            </div>
        );
    }

    if (sellerInfo?.status === "rejected") {
        return (
            <div className="flex flex-col items-center justify-center h-full py-24">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center max-w-md shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Rejected</h2>
                    <p className="text-gray-500">
                        {sellerInfo.rejectionReason || "Your registration was not approved. Please contact support."}
                    </p>
                </div>
            </div>
        );
    }

    const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter((o) => o.orderStatus === "pending").length;

    const stats = [
        {
            label: "Total Products",
            value: products.length,
            icon: Package,
            bg: "bg-indigo-50",
            iconColor: "text-indigo-600",
            border: "border-indigo-100",
        },
        {
            label: "Total Orders",
            value: orders.length,
            icon: ShoppingBag,
            bg: "bg-green-50",
            iconColor: "text-green-600",
            border: "border-green-100",
        },
        {
            label: "Revenue",
            value: `₹${totalRevenue.toFixed(0)}`,
            icon: IndianRupee,
            bg: "bg-yellow-50",
            iconColor: "text-yellow-600",
            border: "border-yellow-100",
        },
        {
            label: "Pending Orders",
            value: pendingOrders,
            icon: Clock,
            bg: "bg-red-50",
            iconColor: "text-red-500",
            border: "border-red-100",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                        Welcome back, {sellerInfo?.shopName || "Seller"} 👋
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Here's an overview of your shop performance.</p>
                </div>
            </div>

            {/* Minimum Products Warning */}
            {products.length < 10 && sellerInfo?.status === "approved" && (
                <div className="flex items-center gap-4 bg-destructive/5 border border-destructive/20 rounded-2xl p-5">
                    <div className="p-3 bg-destructive/10 rounded-xl">
                        <AlertCircle size={24} className="text-destructive shrink-0" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-destructive tracking-tight">Action Required: Add more products</p>
                        <p className="text-sm text-destructive/80 font-medium mt-0.5">
                            You currently have {products.length} product(s). Your store and products will not be visible to customers until you add at least <strong>10 products</strong>.
                        </p>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(({ label, value, icon: Icon, bg, iconColor, border }) => (
                    <div
                        key={label}
                        className="bg-white dark:bg-card rounded-2xl p-6 shadow-soft border border-border/50 flex items-center gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className={`p-4 rounded-xl ${iconColor.replace('text-', 'bg-').replace(/[0-9]+/, '500')}/10 border border-${iconColor.replace('text-', '').replace(/[0-9]+/, '200')}/20 text-${iconColor.replace('text-', '')}`}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{label}</p>
                            <p className="text-3xl font-extrabold text-foreground mt-1 tracking-tight">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white dark:bg-card rounded-2xl shadow-soft border border-border/50 p-6 overflow-hidden">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <TrendingUp size={20} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-extrabold text-foreground tracking-tight">Recent Orders</h2>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-border/50">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-30 text-primary" />
                        <p className="text-sm font-bold">No orders yet. Share your shop to get started!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-muted-foreground font-bold uppercase tracking-wider border-b border-border/50">
                                    <th className="pb-4 pt-2">Order ID</th>
                                    <th className="pb-4 pt-2">Items</th>
                                    <th className="pb-4 pt-2">Amount</th>
                                    <th className="pb-4 pt-2">Status</th>
                                    <th className="pb-4 pt-2">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {orders.slice(0, 8).map((o) => (
                                    <tr key={o._id} className="hover:bg-muted/10 transition-colors group cursor-pointer">
                                        <td className="py-4 font-mono text-sm font-bold text-muted-foreground">
                                            #{o._id?.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="py-4 text-foreground font-medium">
                                            {o.cartItems?.length || 0} item{o.cartItems?.length !== 1 ? "s" : ""}
                                        </td>
                                        <td className="py-4 font-extrabold text-foreground">₹{o.totalAmount}</td>
                                        <td className="py-4">
                                            <span
                                                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${o.orderStatus === "confirmed"
                                                    ? "bg-emerald-500 text-white"
                                                    : o.orderStatus === "pending"
                                                        ? "bg-amber-500 text-white"
                                                        : o.orderStatus === "delivered"
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-muted-foreground text-white"
                                                    }`}
                                            >
                                                {o.orderStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 text-muted-foreground text-sm font-medium">
                                            {o.orderDate ? new Date(o.orderDate).toLocaleDateString("en-IN") : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Top Products */}
            {products.length > 0 && (
                <div className="bg-white dark:bg-card rounded-2xl shadow-soft border border-border/50 p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Package size={20} className="text-primary" />
                        </div>
                        <h2 className="text-xl font-extrabold text-foreground tracking-tight">Your Products</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.slice(0, 8).map((p) => (
                            <div key={p._id} className="border border-border/50 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group bg-muted/5">
                                <div className="h-40 overflow-hidden bg-white">
                                    <img
                                        src={p.image || "https://via.placeholder.com/300x200?text=No+Image"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt={p.title}
                                    />
                                </div>
                                <div className="p-4 bg-white dark:bg-card flex flex-col justify-between h-[84px]">
                                    <p className="text-sm font-bold text-foreground line-clamp-1">{p.title}</p>
                                    <p className="text-lg text-primary font-extrabold">
                                        ₹{p.salePrice > 0 ? p.salePrice : p.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
