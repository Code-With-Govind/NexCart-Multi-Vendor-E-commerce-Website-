import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl shadow-soft border-border/50 group bg-white dark:bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative overflow-hidden aspect-square bg-muted/20">
        <img
          src={product?.image || "https://dummyimage.com/600x400/cccccc/000000.png&text=No+Image"}
          alt={product?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product?.totalStock === 0 ? (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Out of Stock
          </div>
        ) : product?.totalStock < 10 ? (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Low Stock: {product?.totalStock}
          </div>
        ) : null}
      </div>
      <CardContent className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{product?.title}</h2>
        </div>
        <div className="flex justify-between items-end mt-4">
          <div className="flex flex-col">
            {product?.salePrice > 0 ? (
              <>
                <span className="text-sm font-semibold text-muted-foreground line-through">
                  ${product?.price}
                </span>
                <span className="text-xl font-extrabold text-primary">
                  ${product?.salePrice}
                </span>
              </>
            ) : (
              <span className="text-xl font-extrabold text-foreground">
                ${product?.price}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex justify-between items-center gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-xl font-bold border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-colors bg-white dark:bg-card"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(product?._id);
            setFormData(product);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          className="flex-1 rounded-xl font-bold shadow-sm hover:shadow-md transition-all"
          onClick={() => handleDelete(product?._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;
