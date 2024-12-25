// routes/userRoutes.js
const express = require('express');
const { register,login,refreshAccessToken,logout} = require('../controllers/authController');



const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token',refreshAccessToken);
router.post('/logout', logout);
//router.post('/revoke', verifyToken, revokeAllTokens);

module.exports = router;