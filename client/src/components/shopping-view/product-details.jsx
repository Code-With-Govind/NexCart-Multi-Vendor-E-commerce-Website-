import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState, useRef } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const imageContainerRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-10 max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] rounded-2xl md:rounded-3xl border-none shadow-2xl bg-white dark:bg-card">
        <div
          ref={imageContainerRef}
          className="relative overflow-hidden rounded-2xl bg-muted/20 flex items-center justify-center group cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            style={{ ...zoomStyle, transition: zoomStyle.transform === "scale(1)" ? "transform 0.3s ease-out" : "none" }}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="flex flex-col h-full max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">{productDetails?.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-muted-foreground font-medium">
                ({averageReview.toFixed(2)}) · {reviews?.length || 0} reviews
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <p
                className={`text-2xl font-bold ${productDetails?.salePrice > 0 ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-primary text-4xl"
                  }`}
              >
                ${productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 ? (
                <p className="text-4xl font-extrabold text-primary">
                  ${productDetails?.salePrice}
                </p>
              ) : null}
            </div>

            <Separator className="bg-border/50 my-6" />
          </div>

          <div className="mb-6">
            {productDetails?.totalStock === 0 ? (
              <Button size="lg" className="w-full opacity-60 cursor-not-allowed rounded-full text-lg font-bold shadow-sm" disabled>
                Out of Stock
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-white"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>

          <Tabs defaultValue="description" className="w-full mt-2">
            <TabsList className="w-full grid grid-cols-2 rounded-xl bg-muted/50 p-1 mb-6">
              <TabsTrigger value="description" className="rounded-lg font-bold text-sm">Description</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg font-bold text-sm">Reviews ({reviews?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="p-4 bg-muted/10 rounded-2xl border border-border/40">
                <p className="text-muted-foreground text-base leading-relaxed">
                  {productDetails?.description}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <div className="flex-1">
                <div className="grid gap-4 mb-8">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((reviewItem, idx) => (
                      <div key={idx} className="flex gap-4 p-5 bg-muted/10 rounded-2xl border border-border/40">
                        <Avatar className="w-12 h-12 border-2 border-primary/20">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white font-bold">
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-foreground">{reviewItem?.userName}</h3>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={reviewItem?.reviewValue} />
                          </div>
                          <p className="text-muted-foreground leading-relaxed mt-1">
                            {reviewItem.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 bg-muted/10 rounded-2xl border border-border/40">
                      <p className="text-muted-foreground font-medium">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </div>

                <div className="flex-col flex gap-4 p-6 bg-muted/10 rounded-2xl border border-border/40">
                  <Label className="text-lg font-bold text-foreground">Write a Review</Label>
                  <div className="flex gap-1 mb-2">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="rounded-xl border-border/50 py-6 placeholder:text-muted-foreground/70"
                  />
                  <Button
                    size="lg"
                    className="rounded-full font-bold shadow-sm w-full mt-2"
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === ""}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
