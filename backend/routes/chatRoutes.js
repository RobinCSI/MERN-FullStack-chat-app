const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat); //Accessing or creating chat. Protect means only logged in user can access
router.route("/").get(protect, fetchChats); //Get all of the chats from our database from that particular user
router.route("/group").post(protect, createGroupChat); //Creation of a group
router.route("/rename").put(protect, renameGroup); //Since we are updating the name, therefore it is a put request
router.route("/addToGroup").put(protect, addToGroup);
router.route("/removeFromGroup").put(protect, removeFromGroup);

module.exports = router;
