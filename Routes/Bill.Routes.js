const { Router } = require("express");
const {
  userBilling,
  addBill,
  editBill,
  deleteBill,
} = require("../Controllers/Billing.Controller");
const { verifyToken } = require("../Helpers/JWT");
const router = Router();

router.get("/billing-list", verifyToken, userBilling);
router.post("/add-billing", verifyToken, addBill);
router.post("/update-billing/:bill_id", verifyToken, editBill);
router.post("/delete-billing/:bill_id", verifyToken, deleteBill);

module.exports = router;
