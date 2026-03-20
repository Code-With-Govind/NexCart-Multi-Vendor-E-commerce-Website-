import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetailsorderDetails");

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px] rounded-2xl p-0 overflow-hidden border-border/50 shadow-2xl">
      <div className="bg-muted/10 p-6 border-b border-border/50">
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">Order Information</h2>
        <p className="text-sm text-muted-foreground mt-1">Details and status for Order #{orderDetails?._id}</p>
      </div>

      <div className="grid gap-6 p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Order Meta */}
        <div className="grid grid-cols-2 gap-4 bg-muted/5 p-4 rounded-xl border border-border/50">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Order Date</p>
            <p className="font-extrabold text-foreground mt-0.5">{orderDetails?.orderDate.split("T")[0]}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Total Amount</p>
            <p className="font-extrabold text-primary mt-0.5">${orderDetails?.totalAmount}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Payment Method</p>
            <p className="font-extrabold text-foreground mt-0.5 capitalize">{orderDetails?.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Payment Status</p>
            <p className="font-extrabold text-foreground mt-0.5 capitalize">{orderDetails?.paymentStatus}</p>
          </div>
          <div className="col-span-2 mt-2 pt-4 border-t border-border/50 flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">Order Status</p>
            <Badge
              className={`py-1.5 px-4 rounded-full font-bold text-xs shadow-sm uppercase tracking-wider ${orderDetails?.orderStatus === "confirmed"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : orderDetails?.orderStatus === "rejected"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : orderDetails?.orderStatus === "pending"
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : orderDetails?.orderStatus === "inShipping"
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : orderDetails?.orderStatus === "delivered"
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-muted-foreground text-white hover:bg-muted-foreground/90"
                }`}
            >
              {orderDetails?.orderStatus}
            </Badge>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">Order Items</h3>
          <ul className="space-y-3">
            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
              ? orderDetails?.cartItems.map((item, index) => (
                <li key={index} className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/5 p-3 rounded-xl border border-border/50">
                  <span className="font-bold text-foreground line-clamp-1 flex-1 pr-4">{item.title}</span>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0 text-sm">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <span className="text-xs">Qty:</span> <span className="font-bold text-foreground">{item.quantity}</span>
                    </span>
                    <span className="font-extrabold text-foreground bg-white dark:bg-card px-2 py-0.5 rounded-md shadow-sm border border-border/50">
                      ${item.price}
                    </span>
                  </div>
                </li>
              ))
              : null}
          </ul>
        </div>

        <Separator className="bg-border/50" />

        {/* Shipping Info */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">Shipping Information</h3>
          <div className="bg-muted/5 p-4 rounded-xl border border-border/50 flex flex-col gap-1.5 text-sm font-medium text-foreground">
            <span className="text-base font-extrabold mb-1">{user.userName}</span>
            <span>{orderDetails?.addressInfo?.address}</span>
            <span>{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</span>
            <span className="text-muted-foreground flex items-center gap-1.5 mt-2">
              <span className="font-semibold text-foreground">Phone:</span> {orderDetails?.addressInfo?.phone}
            </span>
            {orderDetails?.addressInfo?.notes && (
              <span className="text-muted-foreground flex items-center gap-1.5 mt-1 border-t border-border/50 pt-2">
                <span className="font-semibold text-foreground">Notes:</span> {orderDetails?.addressInfo?.notes}
              </span>
            )}
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Update Status Form */}
        <div>
          <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">Update Status</h3>
          <CommonForm
            formControls={[
              {
                label: "Select new status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Save Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
