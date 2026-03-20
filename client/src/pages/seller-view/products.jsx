import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    addSellerProduct,
    editSellerProduct,
    deleteSellerProduct,
    fetchSellerProducts,
} from "@/store/seller/seller-slice";
import { useSellerData } from "@/hooks/useSellerData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Pencil, Trash2, Plus, X, Upload, Package, AlertCircle } from "lucide-react";

const EMPTY_FORM = {
    title: "", description: "", category: "men", brand: "nike",
    price: "", salePrice: "", totalStock: "", image: "",
};

const CATEGORIES = ["men", "women", "kids", "accessories", "footwear"];
const BRANDS = ["nike", "adidas", "puma", "levi", "zara", "h&m"];

export default function SellerProducts() {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { sellerInfo, products, isLoading, error } = useSellerData({ withProducts: true });

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    function openAdd() {
        setEditId(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
    }

    function openEdit(product) {
        setEditId(product._id);
        setForm({
            title: product.title || "",
            description: product.description || "",
            category: product.category || "men",
            brand: product.brand || "nike",
            price: product.price || "",
            salePrice: product.salePrice || "",
            totalStock: product.totalStock || "",
            image: product.image || "",
        });
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditId(null);
        setForm(EMPTY_FORM);
    }

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validation: Type
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            toast({ title: "Invalid image format. Use JPG, JPEG, or PNG.", variant: "destructive" });
            return;
        }

        // Validation: Size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "Image size too large. Max 5MB allowed.", variant: "destructive" });
            return;
        }

        setUploadLoading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((f) => ({ ...f, image: reader.result }));
            toast({ title: "✅ Image selected successfully!" });
            setUploadLoading(false);
        };
        reader.onerror = () => {
            toast({ title: "Image upload failed. Try again.", variant: "destructive" });
            setUploadLoading(false);
        };
        reader.readAsDataURL(file);
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        const res = await dispatch(deleteSellerProduct({ id, sellerId: sellerInfo._id }));
        if (res.meta.requestStatus === "fulfilled") {
            toast({ title: "🗑️ Product deleted." });
        } else {
            toast({ title: "Delete failed.", variant: "destructive" });
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!sellerInfo?._id) return;

        // Validation: Required Fields
        if (!form.title || !form.description || !form.category || !form.brand || form.price === "" || form.totalStock === "") {
            toast({ title: "Please fill all required fields.", variant: "destructive" });
            return;
        }

        // Validation: Image Required
        if (!form.image) {
            toast({ title: "Product image is required.", variant: "destructive" });
            return;
        }

        const payload = {
            ...form,
            sellerId: sellerInfo._id,
            price: Number(form.price),
            salePrice: Number(form.salePrice) || 0,
            totalStock: Number(form.totalStock),
        };

        setSaving(true);
        let res;
        if (editId) {
            res = await dispatch(editSellerProduct({ id: editId, data: payload }));
        } else {
            res = await dispatch(addSellerProduct(payload));
        }
        setSaving(false);

        if (res.meta.requestStatus === "fulfilled") {
            toast({ title: editId ? "✅ Product updated!" : "✅ Product added!" });
            closeForm();
            dispatch(fetchSellerProducts(sellerInfo._id));
        } else {
            toast({ title: res.payload?.message || "Failed to save product.", variant: "destructive" });
        }
    }

    if (isLoading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-500 text-sm">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border/50">
                <div>
                    <h1 className="text-2xl font-extrabold text-foreground tracking-tight">My Products</h1>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">{products.length} product{products.length !== 1 ? "s" : ""} in your shop</p>
                </div>
                <Button
                    onClick={openAdd}
                    disabled={!sellerInfo || sellerInfo.status !== "approved"}
                    className="mt-4 sm:mt-0 flex items-center gap-2 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all px-6 text-white"
                >
                    <Plus size={18} className="mr-1" /> Add Product
                </Button>
            </div>

            {/* Status warning if not approved */}
            {sellerInfo && sellerInfo.status !== "approved" && (
                <div className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mt-4">
                    <div className="p-2 bg-amber-500/20 rounded-xl"><AlertCircle size={20} className="text-amber-600 shrink-0" /></div>
                    <p className="text-sm font-medium text-amber-700">
                        Your account is <strong className="uppercase tracking-wider">{sellerInfo.status}</strong>. You can view products but cannot add or edit until approved by an admin.
                    </p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-4 bg-destructive/10 border border-destructive/20 rounded-2xl p-5 mt-4">
                    <AlertCircle size={20} className="text-destructive shrink-0" />
                    <p className="text-sm font-medium text-destructive">{error}</p>
                </div>
            )}

            {/* Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm sm:items-center items-end">
                    <div className="bg-white dark:bg-card rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar border border-border/50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-border/50 sticky top-0 bg-white dark:bg-card z-10 rounded-t-3xl">
                            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                                {editId ? "Edit Product" : "Add New Product"}
                            </h2>
                            <button
                                onClick={closeForm}
                                className="p-2 rounded-full hover:bg-muted transition text-muted-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div>
                                <Label className="mb-2 block font-semibold text-foreground">Product Image</Label>
                                <div className="flex items-center gap-5">
                                    {form.image ? (
                                        <div className="relative group">
                                            <img
                                                src={form.image}
                                                className="h-24 w-24 object-cover rounded-2xl border border-border/50 shadow-sm"
                                                alt="preview"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setForm((f) => ({ ...f, image: "" }))}
                                                className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-24 w-24 rounded-2xl border-2 border-dashed border-border flex items-center justify-center bg-muted/20">
                                            <Package size={28} className="text-muted-foreground/50" />
                                        </div>
                                    )}
                                    <label className="cursor-pointer flex items-center gap-2 border-2 border-dashed border-border rounded-2xl px-5 py-4 text-sm font-bold text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all">
                                        <Upload size={18} />
                                        {uploadLoading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                Uploading...
                                            </span>
                                        ) : "Upload Image"}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploadLoading}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <Label className="mb-2 block font-semibold text-foreground">Product Title *</Label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. Classic Running Shoes"
                                    required
                                    className="rounded-xl border-border/50 bg-muted/5 font-medium"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="mb-2 block font-semibold text-foreground">Description *</Label>
                                <Textarea
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    placeholder="Describe your product..."
                                    rows={3}
                                    required
                                    className="rounded-xl border-border/50 bg-muted/5 font-medium resize-none"
                                />
                            </div>

                            {/* Category & Brand */}
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <Label className="mb-2 block font-semibold text-foreground">Category *</Label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                        className="w-full border border-border/50 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-muted/5 text-foreground appearance-none"
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label className="mb-2 block font-semibold text-foreground">Brand *</Label>
                                    <select
                                        value={form.brand}
                                        onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                                        className="w-full border border-border/50 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-muted/5 text-foreground appearance-none"
                                    >
                                        {BRANDS.map((b) => (
                                            <option key={b} value={b} className="uppercase">{b.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Prices & Stock */}
                            <div className="grid grid-cols-3 gap-5">
                                <div>
                                    <Label className="mb-2 block font-semibold text-foreground">Price (₹) *</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                                        placeholder="999"
                                        required
                                        className="rounded-xl border-border/50 bg-muted/5 font-bold"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block font-semibold text-foreground">Sale Price (₹)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={form.salePrice}
                                        onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))}
                                        placeholder="0 = no sale"
                                        className="rounded-xl border-border/50 bg-muted/5 font-bold text-primary"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block font-semibold text-foreground">Stock *</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={form.totalStock}
                                        onChange={(e) => setForm((f) => ({ ...f, totalStock: e.target.value }))}
                                        placeholder="50"
                                        required
                                        className="rounded-xl border-border/50 bg-muted/5 font-bold"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-border/50">
                                <Button
                                    type="submit"
                                    disabled={saving || uploadLoading}
                                    className="flex-1 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all"
                                >
                                    {saving ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </span>
                                    ) : editId ? "Update Product" : "Add Product"}
                                </Button>
                                <Button type="button" variant="outline" onClick={closeForm} className="flex-1 rounded-xl font-bold border-border/50 hover:bg-muted bg-white dark:bg-card">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Product Grid */}
            {products.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground bg-white dark:bg-card rounded-2xl border border-border/50 shadow-sm border-dashed">
                    <Package size={64} className="mx-auto mb-5 opacity-20 text-primary" />
                    <p className="font-bold text-lg text-foreground">No products yet</p>
                    <p className="text-sm mt-2 font-medium max-w-sm mx-auto">
                        {sellerInfo?.status === "approved"
                            ? 'Click "Add Product" to list your first product and start selling.'
                            : "Your account must be approved before you can add products."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <div
                            key={p._id}
                            className="bg-white dark:bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                        >
                            <div className="relative overflow-hidden aspect-square bg-muted/20">
                                <img
                                    src={p.image || "https://via.placeholder.com/300x200?text=No+Image"}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    alt={p.title}
                                />
                                {p.salePrice > 0 && (
                                    <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm tracking-wider">
                                        SALE
                                    </span>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-foreground line-clamp-1">{p.title}</h3>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">{p.category} · {p.brand}</p>

                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-xl font-extrabold text-primary">
                                            ₹{p.salePrice > 0 ? p.salePrice : p.price}
                                        </span>
                                        {p.salePrice > 0 && (
                                            <span className="text-sm font-semibold text-muted-foreground line-through">₹{p.price}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                                        <p className="text-xs font-semibold text-muted-foreground">Stock: <span className="text-foreground">{p.totalStock}</span></p>
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${p.totalStock > 10
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : p.totalStock > 0
                                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                : "bg-destructive/10 text-destructive"
                                            }`}>
                                            {p.totalStock > 10 ? "In Stock" : p.totalStock > 0 ? "Low Stock" : "Out of Stock"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-5">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs border border-primary/20 text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors bg-white dark:bg-card"
                                    >
                                        <Pencil size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs text-destructive bg-destructive/10 rounded-xl font-bold shadow-sm hover:bg-destructive hover:text-white transition-all"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
