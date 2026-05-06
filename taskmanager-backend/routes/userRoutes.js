const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllUsers, getMe } = require('../controllers/userController');

router.get('/', protect, adminOnly, getAllUsers);
router.get('/me', protect, getMe);

module.exports = router;