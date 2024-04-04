const mongoose = require('mongoose');

const RepaymentSchema = new mongoose.Schema({
    loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan',
        required: true,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    repaymentDate: {
        type: Date,
        default: Date.now,
    },
    status:{
        type: String,
        enum: ['PENDING', 'PAID'],
        default: 'PENDING',
    },
});

module.exports = mongoose.model('Repayment', RepaymentSchema);