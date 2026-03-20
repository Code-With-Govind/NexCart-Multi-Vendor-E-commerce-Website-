import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background w-full">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ShoppingLayout;
