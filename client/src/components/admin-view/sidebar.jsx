import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  UserCheck,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket size={20} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck size={20} />,
  },
  {
    id: "sellers",
    label: "Sellers",
    path: "/admin/sellers",
    icon: <UserCheck size={20} />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = window.location;
  const { unreadCount } = useAdminNotifications();

  return (
    <nav className="mt-8 flex-col flex gap-2 w-full">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname.includes(menuItem.path);
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`flex cursor-pointer text-base items-center justify-between gap-2 rounded-xl px-4 py-3 transition-all duration-200 ${isActive
              ? "bg-primary text-white font-semibold shadow-md shadow-primary/20"
              : "text-slate-400 hover:bg-slate-800 hover:text-white font-medium"
              }`}
          >
            <div className="flex items-center gap-3">
              {menuItem.icon}
              <span>{menuItem.label}</span>
            </div>
            {menuItem.id === "sellers" && unreadCount > 0 && (
              <span className={`flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full ${isActive ? 'bg-white text-primary' : 'bg-red-500 text-white'}`}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 bg-slate-950 border-r-0 p-6 flex flex-col">
          <div className="flex flex-col h-full">
            <SheetHeader className="pb-8 border-b-0 text-left">
              <SheetTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <ChartNoAxesCombined size={30} className="text-indigo-400" />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">NexCart Admin</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-72 flex-col bg-slate-950 border-r-0 p-6 lg:flex shadow-2xl shadow-slate-900/20 z-10 sticky top-0 h-screen">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/10 transition-colors hover:bg-white/10"
        >
          <div className="p-2 bg-primary/20 rounded-lg">
            <ChartNoAxesCombined size={28} className="text-indigo-400" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">NexCart Admin</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
