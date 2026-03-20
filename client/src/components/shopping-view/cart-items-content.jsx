import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-muted/10 rounded-2xl border border-border/40 hover:bg-muted/20 transition-colors">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded-xl object-cover shadow-sm border border-border/50"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <h3 className="font-extrabold text-foreground truncate" title={cartItem?.title}>{cartItem?.title}</h3>
        <div className="flex items-center gap-3 mt-2">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full shadow-sm hover:border-primary hover:text-primary transition-colors"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-bold text-base w-4 text-center">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full shadow-sm hover:border-primary hover:text-primary transition-colors"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-1">
        <p className="font-extrabold text-base text-foreground">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCartItemDelete(cartItem)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors mt-auto"
        >
          <Trash size={18} />
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
