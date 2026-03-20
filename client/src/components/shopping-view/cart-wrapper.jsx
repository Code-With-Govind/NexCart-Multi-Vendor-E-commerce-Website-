import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

  return (
    <SheetContent className="sm:max-w-md w-[400px] flex flex-col p-6 border-l border-border/50 shadow-2xl">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-2xl font-extrabold tracking-tight">Your Cart</SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => <UserCartItemsContent key={item.productId} cartItem={item} />)
          : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground opacity-70">
              <span className="text-5xl">🛒</span>
              <p className="font-medium text-lg">Your cart is empty</p>
            </div>
          )}
      </div>

      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-muted-foreground">Total</span>
          <span className="text-2xl font-extrabold text-foreground">${totalCartAmount.toFixed(2)}</span>
        </div>
        <Button
          size="lg"
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full rounded-full font-bold text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-white"
          disabled={cartItems?.length === 0}
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
