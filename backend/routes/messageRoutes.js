const express=require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, allMessages } = require('../controllers/messageControllers');

const router=express.Router()

//2 routes- sending message and fetching all messages in a particular chat. Protected routes as I want user to be logged in therefore used protect middleware
router.route('/').post(protect, sendMessage)
router.route("/:chatId").get(protect, allMessages);

module.exports=router

