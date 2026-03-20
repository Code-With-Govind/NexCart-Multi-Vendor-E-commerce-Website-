import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, X, UserPlus, Clock } from "lucide-react";

const STATUS_COLOR = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
};

export default function AdminSellers() {
    const { toast } = useToast();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectTarget, setRejectTarget] = useState(null);

    async function fetchSellers() {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/sellers", { withCredentials: true });
            setSellers(res.data.data || []);
        } catch {
            toast({ title: "Failed to load sellers.", variant: "destructive" });
        }
        setLoading(false);
    }

    useEffect(() => { fetchSellers(); }, []);

    async function updateStatus(id, status, reason = "") {
        try {
            await axios.put(`http://localhost:5000/api/admin/sellers/${id}/status`, {
                status, rejectionReason: reason,
            }, { withCredentials: true });
            toast({ title: `Seller ${status} successfully.` });
            fetchSellers();
        } catch {
            toast({ title: "Update failed.", variant: "destructive" });
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Seller Registrations</h1>

            {/* Reject reason modal */}
            {rejectTarget && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-3">Reason for Rejection</h3>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            rows={3}
                            placeholder="Enter rejection reason (optional)"
                            className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
                        />
                        <div className="flex gap-3">
                            <button onClick={() => { updateStatus(rejectTarget, "rejected", rejectReason); setRejectTarget(null); setRejectReason(""); }}
                                className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-red-600">
                                Confirm Rejection
                            </button>
                            <button onClick={() => setRejectTarget(null)}
                                className="flex-1 border rounded-lg py-2 text-sm font-medium hover:bg-gray-50">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : sellers.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <UserPlus size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No seller registrations yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sellers.map((s) => (
                        <div key={s._id} className="bg-white rounded-2xl border shadow-sm p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-bold text-gray-800">{s.shopName}</h2>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[s.status]}`}>
                                            {s.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">Owner: {s.ownerName} · {s.email}</p>
                                    {s.phone && <p className="text-sm text-gray-400">📞 {s.phone}</p>}
                                    {s.shopDescription && (
                                        <p className="text-sm text-gray-500 mt-1 italic">"{s.shopDescription}"</p>
                                    )}
                                    {s.shopAddress?.city && (
                                        <p className="text-sm text-gray-400 mt-1">
                                            📍 {s.shopAddress.address}, {s.shopAddress.city}, {s.shopAddress.state} - {s.shopAddress.pincode}
                                        </p>
                                    )}
                                    {s.businessLicense && (
                                        <p className="text-sm text-gray-400">License: {s.businessLicense}</p>
                                    )}
                                    {s.rejectionReason && (
                                        <p className="text-sm text-red-500 mt-1">Reason: {s.rejectionReason}</p>
                                    )}
                                    <p className="text-xs text-gray-300 mt-2">
                                        Registered: {new Date(s.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {s.status !== "approved" && (
                                    <div className="flex gap-2 sm:flex-col">
                                        <button onClick={() => updateStatus(s._id, "approved")}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition">
                                            <CheckCircle2 size={14} /> Approve
                                        </button>
                                        {s.status !== "rejected" && (
                                            <button onClick={() => setRejectTarget(s._id)}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition">
                                                <X size={14} /> Reject
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
