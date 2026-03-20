import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, User, Heart, Search } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
        getCurrentMenuItem.id !== "products" &&
        getCurrentMenuItem.id !== "search"
        ? {
          category: [getCurrentMenuItem.id],
        }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
        new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
      )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderSearch() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop/search?keyword=${keyword}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="hidden lg:flex flex-1 items-center relative max-w-md mx-8">
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search for products..."
        className="w-full pl-10 pr-4 py-2 rounded-full bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:ring-primary shadow-inner text-sm transition-all"
      />
    </form>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  console.log(cartItems, "sangam");

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-3">
      <Button
        onClick={() => navigate("/shop/search")}
        variant="ghost"
        size="icon"
        className="lg:hidden hover:bg-muted/50 rounded-full"
      >
        <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="sr-only">Search</span>
      </Button>

      <Button
        onClick={() => navigate("/shop/home")}
        variant="ghost"
        size="icon"
        className="hover:bg-muted/50 rounded-full group"
      >
        <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-rose-500 transition-colors" />
        <span className="sr-only">Wishlist</span>
      </Button>

      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative hover:bg-muted/50 rounded-full"
        >
          <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <Button
        onClick={() => navigate("/shop/account")}
        variant="ghost"
        size="icon"
        className="hover:bg-muted/50 rounded-full"
      >
        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="sr-only">User Profile</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl tracking-tight text-gradient">NexCart</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block ms-8">
          <MenuItems />
        </div>

        <HeaderSearch />

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
