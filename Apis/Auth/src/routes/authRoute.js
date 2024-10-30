// routes/userRoutes.js
const express = require('express');
const { register,login,refreshAccessToken,logout} = require('../controllers/authController');
const authenticateInExternalApi = require('../middlewares/apiAuthExterna');



const router = express.Router();

router.post('/register', register);
router.post('/login',authenticateInExternalApi, login);
router.post('/refresh-token',refreshAccessToken);
router.post('/logout', logout);
//router.post('/logout', verifyToken, logout);
//router.post('/revoke', verifyToken, revokeAllTokens);

module.exports = router;