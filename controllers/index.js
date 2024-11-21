const Stripe = require("stripe");
const stripe = Stripe(process.env.SECRET_KEY);

class PaymentController {
  async subscribe(req, res) {
    try {
      const { email, subscriptionType } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Please enter your Email" });
      }
      const customer = await stripe.customers.create({ email });
      const PRICE_ID =
        subscriptionType === "MONTHLY"
          ? process.env.MONTHLY_PRICE_ID
          : process.env.YEARLY_PRICE_ID;
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: PRICE_ID }],
        payment_behavior: "default_incomplete", // Payment intent is created but not confirmed
        expand: ["latest_invoice.payment_intent"],
      });
      return res.json({
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        customer: customer.id,
      });
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getSubscriptions(req, res) {
    try {
      const subscriptions = [
        { id: "MONTHLY", name: "Monthly", amount: 5 },
        { id: "YEARLY", name: "Yearly", amount: 48 },
      ];
      return res.json({ subscriptions });
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = PaymentController;
