import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full relative">
      <div className="hidden lg:flex items-center justify-center bg-zinc-950 w-1/2 px-12 relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-0"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-primary/40 rounded-full blur-[120px] z-0"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-secondary/40 rounded-full blur-[120px] z-0"></div>

        <div className="max-w-xl space-y-6 text-center text-primary-foreground z-10">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg text-white leading-tight">
            Discover the Best of E-Commerce
          </h1>
          <p className="text-lg text-zinc-300 font-medium max-w-md mx-auto">
            Join thousands of shoppers and find your perfect style today with our curated collections.
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-muted/10 px-4 py-12 sm:px-6 lg:px-8 relative">
        <div className="w-full max-w-md z-10 bg-white dark:bg-card p-10 rounded-3xl shadow-soft border border-border/50">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
