const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    term: {
        type: Number,
        required: true,
    },
    repaymentFrequency: {
        type: String,
        enum: ['weekly', 'monthly'],
        default: 'weekly',
    },
    applicationDate: { 
        type: Date,
        default: Date.now, 
    },
    repayments: [
        {   
            loan: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Loan',
                default: function() { return this._id; }
            },
            amount: Number,
            dueDate: Date,
            status: {
                type: String,
                enum: ['PENDING', 'PAID'],
                default: 'PENDING',
            },
        },
    ],
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'PAID', 'REJECTED'],
        default: 'PENDING',
    },   
});

module.exports = mongoose.model('Loan', LoanSchema);
