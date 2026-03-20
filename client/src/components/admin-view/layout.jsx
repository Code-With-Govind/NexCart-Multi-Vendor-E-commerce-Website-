import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-muted/10 max-h-screen overflow-hidden">
      {/* admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col min-w-0 max-h-screen">
        {/* admin header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <main className="flex-1 flex-col flex p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
