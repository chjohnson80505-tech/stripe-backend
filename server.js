const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// IMPORTANT: allows your GitHub site to call backend
app.use(cors());
app.use(express.json());

// -------------------------
// PLAN MAPPING (MUST MATCH FRONTEND)
// -------------------------
const plans = {
  daily: "price_1TVCwOCDs6LQCbIGcaaB93pJ",
  weekly: "price_1TVCwjCDs6LQCbIGf7MsXlXv",
  monthly: "price_1TVCx6CDs6LQCbIGAT4MJsWJ",
  six_months: "price_1TVCxSCDs6LQCbIGJwsJiNVW",
  yearly: "price_1TVCy0CDs6LQCbIGAy43tJ4u"
};

// -------------------------
// HEALTH CHECK ROUTE
// -------------------------
app.get("/", (req, res) => {
  res.send("Stripe backend is running");
});

// -------------------------
// CREATE CHECKOUT SESSION
// -------------------------
app.post("/create-checkout-session", async (req, res) => {

  try {

    const { planId } = req.body;

    const price = plans[planId];

    if (!price) {
      return res.status(400).json({ error: "Invalid planId" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: price,
          quantity: 1
        }
      ],
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel"
    });

    return res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
