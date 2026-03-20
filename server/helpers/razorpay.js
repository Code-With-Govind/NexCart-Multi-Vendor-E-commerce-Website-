const Razorpay = require("razorpay");

// Lazy initialization — only creates instance when first used
// so that missing/placeholder keys don't crash the server on startup
let instance = null;

function getRazorpay() {
    const keyId = process.env.RAZORPAY_KEY_ID || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    if (!keyId || keyId.startsWith("rzp_test_your")) {
        console.warn(
            "Razorpay keys not configured. Razorpay functionality will be disabled."
        );
        return null;
    }

    if (!instance) {
        instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }

    return instance;
}

module.exports = getRazorpay;
