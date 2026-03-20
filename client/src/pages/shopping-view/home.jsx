import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  StarIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden group">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              className={`${index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          ))
          : null}

        {/* Overlay for Hero CTA */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center px-4 max-w-3xl pointer-events-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-semibold tracking-widest mb-4 border border-white/30 uppercase">NEW COLLECTION</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight uppercase tracking-tight">Elevate Your Lifestyle</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md font-medium">Discover the latest trends in fashion and electronics. Unbeatable prices, unparalleled quality.</p>
            <Button
              size="lg"
              onClick={() => navigate('/shop/listing')}
              className="rounded-full font-bold text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform border border-transparent"
            >
              Shop Now
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white z-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-md"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-800" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white z-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-md"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-800" />
        </Button>
      </div>
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-soft border-border/50"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-soft border-border/50"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner Block */}
      <section className="py-20 bg-primary/5 relative overflow-hidden group cursor-pointer">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-colors duration-700"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground text-gradient inline-block tracking-tight">Flash Sale! Up to 50% Off</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Don't miss out on our biggest sale of the season. Grab your favorite styles before they're gone!</p>
          <Button size="lg" className="rounded-full font-bold text-lg px-8 py-6 shadow-xl bg-secondary hover:bg-secondary/90 hover:scale-105 transition-transform text-white border-none">
            Explore Deals
          </Button>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Trending Products
            </h2>
            <Button variant="link" onClick={() => navigate('/shop/listing')} className="text-primary font-bold">View All</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.slice(0, 4).map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
              : null}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Just For You
            </h2>
            <Button variant="link" onClick={() => navigate('/shop/listing')} className="text-primary font-bold">View All</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 4
              ? productList.slice(4).map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
              : null}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Alex Johnson", rating: 5, text: "Absolutely love the quality of the clothes. Will definitely buy again!" },
              { name: "Sarah Williams", rating: 5, text: "Fast shipping and excellent customer service. Highly recommended." },
              { name: "Michael Brown", rating: 4, text: "Great products at reasonable prices. The electronics selection is top-notch." },
            ].map((review, idx) => (
              <Card key={idx} className="shadow-md border-border/40 hover:-translate-y-2 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => <StarIcon key={i} className="w-5 h-5 fill-secondary text-secondary" />)}
                  </div>
                  <p className="italic text-muted-foreground mb-4 leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                      {review.name[0]}
                    </div>
                    <p className="font-bold text-foreground">{review.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
