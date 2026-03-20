import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerSeller } from "@/store/seller/seller-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "lucide-react";

const INITIAL = {
    userName: "", email: "", password: "", confirmPassword: "",
    shopName: "", ownerName: "", phone: "", shopDescription: "",
    businessLicense: "",
    shopAddress: { address: "", city: "", state: "", pincode: "" },
};

export default function SellerRegister() {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [form, setForm] = useState(INITIAL);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    function set(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }
    function setAddress(e) {
        setForm((f) => ({
            ...f,
            shopAddress: { ...f.shopAddress, [e.target.name]: e.target.value },
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast({ title: "Passwords do not match.", variant: "destructive" });
            return;
        }
        if (form.password.length < 6) {
            toast({ title: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }
        setLoading(true);
        const { confirmPassword, ...payload } = form;
        const res = await dispatch(registerSeller(payload));
        setLoading(false);
        if (res.payload?.success) {
            setSuccess(true);
        } else {
            toast({
                title: res.payload?.message || "Registration failed. Please try again.",
                variant: "destructive",
            });
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Submitted!</h2>
                    <p className="text-gray-500 mb-6">
                        Your seller application is under review. An admin will approve your account shortly. You can then log in to access your seller dashboard.
                    </p>
                    <Link to="/auth/login">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">Go to Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4">
                        <Store size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Open Your Online Shop</h1>
                    <p className="text-gray-500 mt-2">Register as a seller and start selling today</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Account Info */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Account Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Username *</Label>
                                    <Input name="userName" value={form.userName} onChange={set} required placeholder="e.g. myshop_seller" />
                                </div>
                                <div>
                                    <Label>Email Address *</Label>
                                    <Input name="email" type="email" value={form.email} onChange={set} required placeholder="shop@email.com" />
                                </div>
                                <div>
                                    <Label>Password *</Label>
                                    <Input name="password" type="password" value={form.password} onChange={set} required placeholder="Min 6 characters" />
                                </div>
                                <div>
                                    <Label>Confirm Password *</Label>
                                    <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={set} required />
                                </div>
                            </div>
                        </section>

                        {/* Shop Info */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Shop Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Shop Name *</Label>
                                    <Input name="shopName" value={form.shopName} onChange={set} required placeholder="Your Shop Name" />
                                </div>
                                <div>
                                    <Label>Owner's Full Name *</Label>
                                    <Input name="ownerName" value={form.ownerName} onChange={set} required placeholder="Full Name" />
                                </div>
                                <div>
                                    <Label>Phone Number</Label>
                                    <Input name="phone" value={form.phone} onChange={set} placeholder="+91 XXXXX XXXXX" />
                                </div>
                                <div>
                                    <Label>Business License No. (optional)</Label>
                                    <Input name="businessLicense" value={form.businessLicense} onChange={set} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <Label>Shop Description</Label>
                                <Textarea name="shopDescription" value={form.shopDescription} onChange={set}
                                    placeholder="Tell customers about your shop..." rows={3} />
                            </div>
                        </section>

                        {/* Shop Address */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Shop Address</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <Label>Street Address</Label>
                                    <Input name="address" value={form.shopAddress.address} onChange={setAddress} />
                                </div>
                                <div>
                                    <Label>City</Label>
                                    <Input name="city" value={form.shopAddress.city} onChange={setAddress} />
                                </div>
                                <div>
                                    <Label>State</Label>
                                    <Input name="state" value={form.shopAddress.state} onChange={setAddress} />
                                </div>
                                <div>
                                    <Label>Pincode</Label>
                                    <Input name="pincode" value={form.shopAddress.pincode} onChange={setAddress} />
                                </div>
                            </div>
                        </section>

                        <Button type="submit" disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 text-base font-semibold">
                            {loading ? "Submitting..." : "Submit Seller Registration"}
                        </Button>

                        <p className="text-center text-sm text-gray-500">
                            Already a seller?{" "}
                            <Link to="/auth/login" className="text-indigo-600 hover:underline font-medium">
                                Log in
                            </Link>
                            {" · "}
                            <Link to="/auth/register" className="text-indigo-600 hover:underline font-medium">
                                Register as buyer
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
