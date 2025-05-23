const express = require('express');
const {register, login} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/register', register);
router.post('/login', login);

router.post('/report', authMiddleware, (req, res) => {
    res.json({message: `Hello ${re.user.id}, you are authorized to report an issue`});
});

module.exports = router;