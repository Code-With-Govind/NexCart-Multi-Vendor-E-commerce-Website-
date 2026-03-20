import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border-border/50 shadow-soft overflow-hidden flex flex-col justify-between">
      <div className="relative">
        <div
          onClick={() => handleGetProductDetails(product?._id)}
          className="cursor-pointer overflow-hidden relative"
        >
          <img
            src={product?.image || "https://dummyimage.com/600x400/cccccc/000000.png&text=No+Image"}
            alt={product?.title}
            className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 px-3 py-1 shadow-sm">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600 px-3 py-1 shadow-sm">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-rose-500 hover:bg-rose-600 px-3 py-1 shadow-sm">
              Sale
            </Badge>
          ) : null}
        </div>

        {/* Wishlist Button Overlay */}
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement Wishlist functionality
          }}
          className="absolute top-3 right-3 rounded-full bg-white/70 backdrop-blur-sm shadow-sm hover:bg-white border-none text-gray-700 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-2 h-9 w-9 z-10"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer flex-1 flex flex-col"
      >
        <CardContent className="p-5 flex-1 pl-4 pr-4">
          <h2 className="text-xl font-bold mb-1 text-foreground line-clamp-1">{product?.title}</h2>

          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>

          {product?.sellerId?.shopName && (
            <div className="text-sm text-muted-foreground mb-3 truncate">
              Sold by: <span className="font-semibold text-foreground">{product.sellerId.shopName}</span>
            </div>
          )}

          <div className="flex items-center gap-2 mt-auto">
            <span
              className={`${product?.salePrice > 0 ? "line-through text-muted-foreground text-sm font-medium" : "text-xl font-extrabold text-primary"}`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-xl font-extrabold text-primary">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>

      <CardFooter className="px-5 pb-5 pt-0 mt-auto">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed rounded-full font-semibold" disabled>
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full rounded-full font-semibold shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
