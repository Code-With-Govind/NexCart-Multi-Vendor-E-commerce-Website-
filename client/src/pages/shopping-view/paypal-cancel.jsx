import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaypalCancelPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white rounded-2xl shadow-md p-10 flex flex-col items-center max-w-md w-full text-center">
                <XCircle className="text-red-500 w-16 h-16 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
                <p className="text-gray-500 mb-6">
                    Your PayPal payment was cancelled. No charges have been made. You can
                    return to checkout if you'd like to try again.
                </p>
                <div className="flex gap-3 w-full">
                    <Button
                        className="flex-1"
                        onClick={() => navigate("/shop/checkout")}
                    >
                        Back to Checkout
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate("/shop/home")}
                    >
                        Continue Shopping
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PaypalCancelPage;
