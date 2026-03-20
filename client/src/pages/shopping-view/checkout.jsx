import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder, createRazorpayOrder, verifyRazorpayPayment, createSimulatedOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Payment method config
const PAYMENT_METHODS = [
  {
    id: "razorpay_upi",
    label: "UPI (GPay, PhonePe, Paytm)",
    icon: "https://cdn-icons-png.flaticon.com/512/2721/2721325.png", // generic QR/UPI icon
    basePaymentGateway: "razorpay"
  },
  {
    id: "razorpay_card",
    label: "Credit / Debit Card",
    icon: "https://cdn-icons-png.flaticon.com/512/179/179457.png", // generic card icon
    basePaymentGateway: "razorpay"
  },
  {
    id: "razorpay_netbanking",
    label: "Net Banking",
    icon: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png", // generic bank icon
    basePaymentGateway: "razorpay"
  },
  {
    id: "paypal",
    label: "Pay with PayPal",
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", // PayPal icon
    basePaymentGateway: "paypal"
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    icon: "https://cdn-icons-png.flaticon.com/512/6491/6491490.png",
    basePaymentGateway: "cod"
  },
];

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

  // ── Handle Razorpay Payment Flow ───────────────────────────────────
  async function handleRazorpayPayment() {
    if (!validateCheckout()) return;

    setIsPaymentStart(true);

    // 1. Load Razorpay script
    const res = await loadRazorpayScript();
    if (!res) {
      toast({ title: "Razorpay SDK failed to load. Are you online?", variant: "destructive" });
      setIsPaymentStart(false);
      return;
    }

    // 2. Create Razorpay order on backend
    const orderData = buildOrderData("razorpay");
    const createResponse = await dispatch(createRazorpayOrder(orderData));

    if (!createResponse?.payload?.success) {
      toast({ title: "Order creation failed. Please try again.", variant: "destructive" });
      setIsPaymentStart(false);
      return;
    }

    const { razorpayOrderId, amount, currency, keyId, orderId } = createResponse.payload;

    // 3. Initialize Razorpay Checkout
    const options = {
      key: keyId, // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "NexCart",
      description: "Test Transaction",
      order_id: razorpayOrderId,
      handler: async function (response) {
        // 4. Verify Payment on Backend
        const verifyData = {
          orderId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        };

        const verifyResponse = await dispatch(verifyRazorpayPayment(verifyData));

        if (verifyResponse?.payload?.success) {
          toast({ title: "Payment successful! Your order is confirmed." });
          navigate("/shop/payment-success");
        } else {
          toast({ title: "Payment verification failed. Please contact support.", variant: "destructive" });
        }
      },
      prefill: {
        name: user?.userName || "Guest User",
        email: user?.email || "guest@example.com",
        contact: currentSelectedAddress?.phone || "9999999999",
      },
      theme: {
        color: "#4f46e5", // Indigo-600
      },
      modal: {
        ondismiss: function () {
          setIsPaymentStart(false);
          toast({ title: "Payment cancelled by user.", variant: "destructive" });
        }
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  // ── Shared order data builder ──────────────────────────────────────────────
  function buildOrderData(paymentMethod) {
    return {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
  }

  function validateCheckout() {
    if (!cartItems?.items?.length) {
      toast({ title: "Your cart is empty. Please add items to proceed.", variant: "destructive" });
      return false;
    }
    if (!currentSelectedAddress) {
      toast({ title: "Please select a delivery address to proceed.", variant: "destructive" });
      return false;
    }
    return true;
  }

  // ── PayPal Payment Flow ──────────────────────────────────────────────────
  function handlePaypalPayment() {
    if (!validateCheckout()) return;

    setIsPaymentStart(true);
    const orderData = buildOrderData("paypal");

    dispatch(createNewOrder(orderData)).then((data) => {
      if (!data?.payload?.success) {
        toast({ title: "PayPal initiation failed. Please try again.", variant: "destructive" });
        setIsPaymentStart(false);
      }
      // If success, state.approvalURL is set, and the redirect at the bottom handles it
    });
  }

  // ── Simulated Payment Flow ──────────────────────────────────
  function handleSimulatedPayment() {
    if (!validateCheckout()) return;
    if (!selectedPayment) {
      toast({ title: "Please select a payment method.", variant: "destructive" });
      return;
    }

    setIsPaymentStart(true);
    dispatch(createSimulatedOrder(buildOrderData(selectedPayment))).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Payment successful! Your order is confirmed." });
        navigate("/shop/payment-success");
      } else {
        toast({ title: "Order creation failed. Please try again.", variant: "destructive" });
      }
      setIsPaymentStart(false);
    });
  }

  // ── Redirect PayPal if approvalURL is set ─────────────────────────────────
  if (approvalURL) window.location.href = approvalURL;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      {/* Page Header */}
      <div className="bg-white dark:bg-card border-b border-border/50 py-8 px-4 sm:px-6 shadow-sm">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Checkout</h1>
          <p className="text-muted-foreground mt-2 font-medium">Complete your order securely</p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left Column - Steps */}
          <div className="w-full lg:w-3/5 space-y-8">
            {/* Step 1: Address */}
            <div className="bg-white dark:bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/50 bg-muted/5 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-sm">1</div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">Shipping Address</h2>
              </div>
              <div className="p-6">
                <Address
                  selectedId={currentSelectedAddress}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="bg-white dark:bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden">
              <div className={`px-6 py-4 border-b border-border/50 bg-muted/5 flex items-center gap-4 ${!currentSelectedAddress ? 'opacity-50' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm ${currentSelectedAddress ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>2</div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">Payment Method</h2>
              </div>
              <div className={`p-6 ${!currentSelectedAddress ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex flex-col items-center justify-center gap-3 border-2 rounded-2xl p-6 transition-all duration-300 cursor-pointer ${selectedPayment === method.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10 ring-1 ring-primary/20 scale-[1.02]"
                        : "border-border/50 bg-white dark:bg-card hover:border-primary/40 hover:bg-muted/10 hover:shadow-sm"
                        }`}
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 ${selectedPayment === method.id ? 'bg-white shadow-sm' : 'bg-muted/30'}`}>
                        <img
                          src={method.icon}
                          alt={method.label}
                          className="h-7 w-auto object-contain"
                        />
                      </div>
                      <span className={`text-sm font-bold text-center leading-tight ${selectedPayment === method.id ? 'text-primary' : 'text-foreground'}`}>
                        {method.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white dark:bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden sticky top-24">
              <div className="px-6 py-5 border-b border-border/50 bg-muted/5">
                <h2 className="text-xl font-bold text-foreground tracking-tight">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                  {cartItems?.items?.length > 0
                    ? cartItems.items.map((item) => (
                      <UserCartItemsContent key={item.productId} cartItem={item} />
                    ))
                    : (
                      <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                    )}
                </div>

                <div className="space-y-4 border-t border-border/50 pt-6">
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Subtotal</span>
                    <span>${totalCartAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Shipping</span>
                    <span className="text-emerald-500 font-bold tracking-wide">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-extrabold text-foreground pt-4 border-t border-border/50">
                    <span>Total</span>
                    <span className="text-primary">${totalCartAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={() => {
                    const method = PAYMENT_METHODS.find(m => m.id === selectedPayment);
                    if (method?.basePaymentGateway === "razorpay") handleRazorpayPayment();
                    else if (method?.basePaymentGateway === "paypal") handlePaypalPayment();
                    else handleSimulatedPayment();
                  }}
                  disabled={isPaymentStart || !cartItems?.items?.length || !currentSelectedAddress || !selectedPayment}
                  className="w-full mt-8 rounded-full text-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-white h-14"
                >
                  {isPaymentStart ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Securely...
                    </div>
                  ) : !currentSelectedAddress ? (
                    "Select Delivery Address"
                  ) : !selectedPayment ? (
                    "Select Payment Method"
                  ) : (
                    `Pay $${totalCartAmount.toFixed(2)} Securely`
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5 font-medium">
                  <span className="inline-block text-emerald-500">🔒</span>
                  Guaranteed safe & secure checkout
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
