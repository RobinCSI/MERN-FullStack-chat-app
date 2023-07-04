const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const router = express.Router();
const {protect}=require("../middleware/authMiddleware")

// Creating routes
router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
// router.route('/').get(allUsers)

module.exports = router;
