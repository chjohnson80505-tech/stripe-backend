const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const stripe = Stripe("sk_live_YOUR_SECRET_KEY");

const plans = {
  daily: "price_1TVCwOCDs6LQCbIGcaaB93pJ",
  weekly: "price_1TVCwjCDs6LQCbIGf7MsXlXv",
  monthly: "price_1TVCx6CDs6LQCbIGAT4MJsWJ",
  six_months: "price_1TVCxSCDs6LQCbIGJwsJiNVW",
  yearly: "price_1TVCy0CDs6LQCbIGAy43tJ4u"
};

app.post("/create-checkout-session", async (req, res) => {

  const priceId = plans[req.body.planId];

  if (!priceId) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  try {

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      success_url: "https://yourdomain.com/success",
      cancel_url: "https://yourdomain.com/cancel"
    });

    res.json({ url: session.url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
