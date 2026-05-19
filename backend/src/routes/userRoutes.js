const express = require('express');
const { getMe, getAllUsers } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/me', authenticate, getMe);
router.get('/', authenticate, authorizeAdmin, getAllUsers);

module.exports = router;