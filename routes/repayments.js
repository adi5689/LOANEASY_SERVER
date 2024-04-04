const express = require('express');
const router = express.Router();
const { addRepayment } = require('../controllers/repaymentController');
const auth = require('../middleware/auth');

router.post('/makerepayment', auth, addRepayment);

module.exports = router;
