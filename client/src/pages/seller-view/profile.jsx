import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateSellerProfile } from "@/store/seller/seller-slice";
import { useSellerData } from "@/hooks/useSellerData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Store, CheckCircle2, Clock, XCircle, Save } from "lucide-react";

const STATUS_CONFIG = {
    approved: {
        icon: CheckCircle2,
        label: "Approved",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
    pending: {
        icon: Clock,
        label: "Pending Approval",
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
    },
    rejected: {
        icon: XCircle,
        label: "Rejected",
        color: "text-destructive",
        bg: "bg-destructive/10",
        border: "border-destructive/20",
    },
};

export default function SellerProfile() {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { user, sellerInfo, isLoading } = useSellerData();

    const [form, setForm] = useState({
        shopName: "",
        ownerName: "",
        phone: "",
        shopDescription: "",
        businessLicense: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });
    const [saving, setSaving] = useState(false);

    // Populate form when sellerInfo loads
    useEffect(() => {
        if (sellerInfo) {
            setForm({
                shopName: sellerInfo.shopName || "",
                ownerName: sellerInfo.ownerName || "",
                phone: sellerInfo.phone || "",
                shopDescription: sellerInfo.shopDescription || "",
                businessLicense: sellerInfo.businessLicense || "",
                address: sellerInfo.shopAddress?.address || "",
                city: sellerInfo.shopAddress?.city || "",
                state: sellerInfo.shopAddress?.state || "",
                pincode: sellerInfo.shopAddress?.pincode || "",
            });
        }
    }, [sellerInfo]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!user?.id) return;

        const payload = {
            shopName: form.shopName,
            ownerName: form.ownerName,
            phone: form.phone,
            shopDescription: form.shopDescription,
            businessLicense: form.businessLicense,
            shopAddress: {
                address: form.address,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
            },
        };

        setSaving(true);
        const res = await dispatch(updateSellerProfile({ userId: user.id, data: payload }));
        setSaving(false);

        if (res.meta.requestStatus === "fulfilled") {
            toast({ title: "✅ Profile updated successfully!" });
        } else {
            toast({ title: res.payload?.message || "Update failed.", variant: "destructive" });
        }
    }

    if (isLoading && !sellerInfo) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-muted-foreground text-sm font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const statusKey = sellerInfo?.status || "pending";
    const statusCfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
    const StatusIcon = statusCfg.icon;

    return (
        <div className="max-w-3xl space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border/50">
                <div className="p-3 bg-primary/10 rounded-xl w-fit">
                    <Store size={24} className="text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Shop Profile</h1>
                    <p className="text-muted-foreground font-medium text-sm mt-0.5">Manage your shop information and business details.</p>
                </div>
            </div>

            {/* Status Badge */}
            <div className={`flex items-start gap-4 ${statusCfg.bg} border ${statusCfg.border} rounded-2xl p-5 shadow-sm`}>
                <div className="p-2 bg-white/50 dark:bg-card/50 rounded-xl shrink-0 mt-0.5 shadow-sm">
                    <StatusIcon size={24} className={statusCfg.color} />
                </div>
                <div>
                    <p className={`text-base font-extrabold ${statusCfg.color} tracking-tight uppercase`}>
                        Account Status: {statusCfg.label}
                    </p>
                    {statusKey === "pending" && (
                        <p className="text-sm font-medium text-amber-700/80 dark:text-amber-400/80 mt-1">
                            Your account is under review. You can carefully update your profile while waiting for admin approval.
                        </p>
                    )}
                    {statusKey === "rejected" && sellerInfo?.rejectionReason && (
                        <p className="text-sm font-medium text-destructive mt-1">
                            <span className="font-bold">Reason:</span> {sellerInfo.rejectionReason}
                        </p>
                    )}
                </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shop Info Section */}
                <div className="bg-white dark:bg-card rounded-2xl border border-border/50 shadow-soft p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                            Shop Information
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <Label className="mb-2 block font-semibold text-foreground">Shop Name *</Label>
                            <Input
                                name="shopName"
                                value={form.shopName}
                                onChange={handleChange}
                                placeholder="Your Shop Name"
                                required
                                className="rounded-xl border-border/50 bg-muted/5 font-medium"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block font-semibold text-foreground">Owner Name *</Label>
                            <Input
                                name="ownerName"
                                value={form.ownerName}
                                onChange={handleChange}
                                placeholder="Full Name"
                                required
                                className="rounded-xl border-border/50 bg-muted/5 font-medium"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block font-semibold text-foreground">Phone Number</Label>
                            <Input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="+91 XXXXX XXXXX"
                                className="rounded-xl border-border/50 bg-muted/5 font-medium"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block font-semibold text-foreground">Business License No.</Label>
                            <Input
                                name="businessLicense"
                                value={form.businessLicense}
                                onChange={handleChange}
                                placeholder="Optional"
                                className="rounded-xl border-border/50 bg-muted/5 font-medium"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Label className="mb-2 block font-semibold text-foreground">Shop Description</Label>
                            <Textarea
                                name="shopDescription"
                                value={form.shopDescription}
                                onChange={handleChange}
                                placeholder="Tell customers about your shop..."
                                rows={4}
                                className="rounded-xl border-border/50 bg-muted/5 font-medium resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="bg-white dark:bg-card rounded-2xl border border-border/50 shadow-soft p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                            Shop Address
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <Label className="mb-2 block font-semibold text-foreground">Street Address</Label>
                            <Input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="House/Shop No., Street, Area"
                                className="rounded-xl border-border/50 bg-muted/5 font-medium"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block font-semibold text-foreground">City</Label>
                            <Input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                placeholder="Mumbai"
                                className="rounded-xl border-border/50 bg-muted/5 font-medium"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block font-semibold text-foreground">State</Label>
                            <Input
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                placeholder="Maharashtra"
                                className="rounded-xl border-border/50 bg-muted/5 font-medium"
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block font-semibold text-foreground">Pincode</Label>
                            <Input
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                placeholder="400001"
                                maxLength={6}
                                className="rounded-xl border-border/50 bg-muted/5 font-medium tracking-widest uppercase"
                            />
                        </div>
                    </div>
                </div>

                {/* Account Info (readonly) */}
                {sellerInfo?.email && (
                    <div className="bg-muted/10 rounded-2xl border border-border/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Registered Email</p>
                            <p className="text-foreground font-extrabold mt-1">{sellerInfo.email}</p>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Member Since</p>
                            <p className="text-foreground font-extrabold mt-1">
                                {sellerInfo.createdAt
                                    ? new Date(sellerInfo.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "long", year: "numeric",
                                    })
                                    : "—"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                <Button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-base py-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                >
                    {saving ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving Changes...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Save Shop Details
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
