import { AlignJustify, LogOut, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const { notifications, unreadCount, markAllRead } = useAdminNotifications();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-card border-b border-border/50 shadow-sm sticky top-0 z-20">
      <Button onClick={() => setOpen(true)} variant="outline" size="icon" className="lg:hidden rounded-full shadow-sm hover:bg-muted/50 border-border/50">
        <AlignJustify className="w-5 h-5 text-foreground" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative shadow-sm rounded-full w-10 h-10 border-border/50 hover:bg-muted/50 transition-colors bg-white dark:bg-card">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 border-2 border-white dark:border-card rounded-full shadow-sm">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl shadow-lg border-border/50 p-2">
            <DropdownMenuLabel className="flex justify-between items-center px-2 py-1">
              <span className="font-bold text-base">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:text-primary/80 font-bold transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50 my-2" />
            <div className="max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-sm text-center text-muted-foreground font-medium bg-muted/10 rounded-xl border border-dashed border-border/50">
                  No new notifications
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notif) => (
                    <DropdownMenuItem key={notif._id} className="p-3 bg-muted/5 hover:bg-muted/20 rounded-xl transition-colors cursor-default border border-transparent hover:border-border/50">
                      <div className="flex flex-col gap-1.5 w-full">
                        <p className="text-sm font-medium text-foreground leading-tight">{notif.message}</p>
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-full px-5 py-2 text-sm font-bold shadow-sm hover:shadow-md transition-all text-white"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
