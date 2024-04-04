const User = require('../models/User');
const Repayment = require('../models/Repayment');
const Loan = require('../models/Loan');


// /Controller code to make a single repayment for a loan 
exports.addRepayment = async (req, res) => {
    try {
        const { loanId, termId, amount } = req.body;
        const userId = req.user.id; 

        console.log(userId);

        // Verify the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found!' });
        }

        // Verify the loan
        const loan = await Loan.findById(loanId).populate('repayments');
        if (!loan) {
            return res.status(404).json({ msg: 'Loan not found!' });
        }

        // Check if the logged-in user is the same as the user who has taken the loan
        if (loan.user.toString() !== userId) {
            return res.status(403).json({ msg: 'Forbidden: Only the user who has taken the loan can add repayments.' });
        }

        // Find the particular repayment term for the loan
        const repaymentTerm = loan.repayments.find(r => r._id.toString() === termId);
        if (!repaymentTerm) {
            return res.status(404).json({ msg: 'Repayment term not found!' });
        }

        // Check if the repayment amount is greater than or equal to the scheduled repayment amount
        if (amount < repaymentTerm.amount) {
            return res.status(400).json({ msg: 'Repayment amount must be greater than or equal to the scheduled repayment amount!' });
        }

        let excessAmount = 0;
        if (amount > repaymentTerm.amount) {
            excessAmount = amount - repaymentTerm.amount;
        }

        const repayment = new Repayment({
            loan: loanId,
            termId: termId,
            amount: amount,
            status: 'PAID',
            user: userId
        });

        await repayment.save();

        //update the status of repayment term in loan document
         const loanUpdate = await Loan.findByIdAndUpdate(
            loanId,
            {$set: {"repayments.$[elem].status": "PAID"}},
            {arrayFilters: [{ "elem._id": termId }]}
         );

         if(!loanUpdate){
            return res.status(500).json({msg: 'Failed to update loan payment status!'});
         }

        // Distribute the excess amount across the remaining terms only if there is an excess
        if (excessAmount > 0) {
            const remainingTerms = loan.repayments.filter(r => r._id.toString() !== termId);
            const excessPerTerm = excessAmount / remainingTerms.length;

            for (const term of remainingTerms) {
                await Loan.findByIdAndUpdate(
                    loanId,
                    {$set: {"repayments.$[elem].amount": term.amount - excessPerTerm}},
                    {arrayFilters: [{ "elem._id": term._id }]}
                );
            }
        }


        //check if its the last repayment and update the loan status to paid
        const remainingRepayments = loan.repayments.filter(r => r.status !== 'PAID');
        if(remainingRepayments.length === 1){
            //refresh loan document
            const updatedLoan = await Loan.findById(loanId);
            if (updatedLoan.repayments.every(r => r.status === 'PAID')) {
                await Loan.findByIdAndUpdate(loanId, {$set: {status: 'PAID'}});
            }
        }

        res.status(201).json(repayment);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error!');
    }
};


