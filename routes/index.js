var express = require("express");
var router = express.Router();

const PaymentController = require("../controllers");
const payment = new PaymentController();

router.post("/subscribe", (req, res) => {
  payment.subscribe(req, res);
});

router.get("/get-subscriptions", (req, res) => {
  payment.getSubscriptions(req, res);
});

module.exports = router;
