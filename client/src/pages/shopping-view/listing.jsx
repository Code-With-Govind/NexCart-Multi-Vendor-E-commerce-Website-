import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  console.log(queryParams, "queryParams");

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { totalPage } = useSelector((state) => state.shopProducts);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
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

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort, page: currentPage, limit: 12 })
      );
  }, [dispatch, sort, filters, currentPage]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(productList, "productListproductListproductList");

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[280px] shrink-0">
          <ProductFilter filters={filters} handleFilter={handleFilter} />
        </div>
        <div className="bg-white dark:bg-card w-full rounded-2xl shadow-soft border border-border/50 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/10">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">All Products</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap bg-white dark:bg-background px-3 py-1.5 rounded-full shadow-sm border border-border/50">
                {productList?.length || 0} Products
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 rounded-full px-5 py-2 hover:bg-muted/50 transition-colors shadow-sm bg-white dark:bg-background border-border/50"
                  >
                    <ArrowUpDownIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] rounded-xl shadow-lg border-border/50 p-2">
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                        className="py-2.5 cursor-pointer font-medium hover:bg-muted/50 rounded-lg px-3"
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                  key={productItem._id}
                />
              ))
              : (
                <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">No Products Found</h3>
                  <p className="text-lg text-muted-foreground font-medium max-w-md">Try adjusting your filters or search criteria to find what you're looking for.</p>
                </div>
              )}
          </div>
          {/* Pagination Controls */}
          {totalPage > 1 && (
            <div className="flex justify-center items-center gap-4 py-8 border-t border-border/50 bg-muted/10">
              <Button
                variant="outline"
                className="rounded-full px-6 font-semibold hover:bg-muted/50 transition-colors shadow-sm bg-white dark:bg-background"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm font-bold text-foreground bg-white dark:bg-background shadow-sm border border-border/50 px-5 py-2 rounded-full">
                {currentPage} <span className="text-muted-foreground font-medium mx-1">/</span> {totalPage}
              </span>
              <Button
                variant="outline"
                className="rounded-full px-6 font-semibold hover:bg-muted/50 transition-colors shadow-sm bg-white dark:bg-background"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
                disabled={currentPage === totalPage}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
