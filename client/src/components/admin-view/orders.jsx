import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="shadow-sm border-border/50 rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/10 border-b border-border/50 p-6">
        <CardTitle className="text-xl font-extrabold text-foreground">All Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-muted-foreground w-[250px]">Order ID</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Order Date</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Amount</TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                <TableRow key={orderItem?._id} className="cursor-pointer transition-colors hover:bg-muted/10 group">
                  <TableCell className="font-medium text-foreground">{orderItem?._id}</TableCell>
                  <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 rounded-full font-bold text-xs shadow-sm uppercase tracking-wider ${orderItem?.orderStatus === "confirmed"
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : orderItem?.orderStatus === "rejected"
                            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            : orderItem?.orderStatus === "pending"
                              ? "bg-amber-500 hover:bg-amber-600 text-white"
                              : orderItem?.orderStatus === "inShipping"
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : orderItem?.orderStatus === "delivered"
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  : "bg-muted-foreground hover:bg-muted-foreground/90 text-white"
                        }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-extrabold text-foreground">${orderItem?.totalAmount}</TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full shadow-sm font-bold border-border/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all bg-white dark:bg-card"
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        View Details
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
              : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-medium">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
