const express = require('express');
const router = express.Router();
const { createLoan, approveLoan, getLoansByUser, getLoanByUser, getAllLoans } = require('../controllers/loanController');
const checkAdmin = require('../middleware/checkAdmin');
const auth = require('../middleware/auth');


router.get('/all', checkAdmin, getAllLoans);
router.post('/createloan', auth, createLoan);
router.get('/user/:id', auth, getLoanByUser);
router.put('/:id/approve', auth, checkAdmin, approveLoan);
router.get('/user', auth, getLoansByUser);


module.exports = router;
