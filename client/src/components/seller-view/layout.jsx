import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    User,
    LogOut,
    Store,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

const navItems = [
    { to: "/seller/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/seller/products", icon: Package, label: "My Products" },
    { to: "/seller/orders", icon: ShoppingBag, label: "Orders" },
    { to: "/seller/profile", icon: User, label: "Shop Profile" },
];

export default function SellerLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(logoutUser()).then(() => navigate("/auth/login"));
    }

    return (
        <div className="flex min-h-screen w-full bg-muted/10 max-h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-card border-r border-border/50 flex flex-col shadow-soft sticky top-0 h-screen z-10 p-6">
                <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                    <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                        <Store size={24} />
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-foreground">Seller Hub</span>
                </div>
                <nav className="flex-1 mt-8 space-y-2">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${isActive
                                    ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <div className="pt-6 border-t border-border/50 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-bold text-destructive hover:bg-destructive/10 transition-all"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar min-w-0">
                <Outlet />
            </main>
        </div>
    );
}
