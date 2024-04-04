const Loan = require("../models/Loan");

//controller for creating loan
exports.createLoan = async (req, res) => {
    try {
       const { amount, term, repaymentFrequency } = req.body;
       const user = req.user.id;
       const userName = req.user.name;
   
       // Calculate repayment amount
       const repaymentAmount = amount / term;
   
       // Calculate the due dates based on the repayment frequency
       const dueDates = [];
       let dueDate = new Date(); 
       const approvalDay = dueDate.getDate(); 
       for (let i = 0; i < term; i++) {
           let currentDueDate = new Date(dueDate);
           if (repaymentFrequency === 'weekly') {
               currentDueDate.setDate(currentDueDate.getDate() + 7); 
           } else if (repaymentFrequency === 'monthly') {
               currentDueDate.setMonth(currentDueDate.getMonth() + 1); 
               currentDueDate.setDate(approvalDay);
               if (currentDueDate.getDate() !== approvalDay) {
                   currentDueDate.setDate(0); 
               }
           }
           const formattedDueDate = currentDueDate.toISOString().slice(0, 10);
           dueDates.push({ amount: repaymentAmount, dueDate: formattedDueDate, status: 'PENDING' });
           dueDate = currentDueDate;
       }
   
       // Create the new loan without repayments
       const loan = new Loan({
           user,
           userName,
           amount,
           term,
           repaymentFrequency,
           status: 'PENDING',
           applicationDate: new Date() 
       });
   
       // Save the loan to get its ID
       await loan.save();
   
       // Update the repayments with the loan ID
       const updatedRepayments = dueDates.map(repayment => ({
           ...repayment,
           loan: loan._id 
       }));
   
       // Update the loan with the repayments
       loan.repayments = updatedRepayments;
       await loan.save(); // Save the loan again with the updated repayments
   
       res.status(201).json({
           success: true,
           data: loan
       });
    } catch (err) {
       console.error(err.message);
       res.status(500).send("Server Error!");
    }
   };
   

//controller to get the details of all the loans by a user
exports.getLoansByUser = async (req, res) => {
    try {
       const userId = req.user.id;
       const loans = await Loan.find({user: userId}).populate('user', ['name', 'email']);
       if(!loans || loans.length === 0) {
        return res.status(404).json({msg:'Loan not found!'});
       };

       const transformedLoans = loans.map(loan => ({
        id: loan._id,
        amount: loan.amount,
        term: loan.term,
        repaymentFrequency: loan.repaymentFrequency,
        status:loan.status,
        date: loan.applicationDate,

        repayments: loan.repayments.map(repayment => ({
            id: repayment._id,
            loan: repayment.loan,
            amount: repayment.amount,
            dueDate: repayment.dueDate,
            status: repayment.status,
        }))
       }))
       res.json(transformedLoans);
    } catch(err){
        console.error(err.message);
        if(err.kinf == 'ObjectId'){
            return res.status(404).json({msg: 'Loan not found!'});
        }
        res.status(500).send('Server Error!');
    }
};


//controller to get the details of a single loan by a user
exports.getLoanByUser = async (req, res) => {
    try {
        const loan = await Loan.findOne({_id: req.params.id, user: req.user.id}).populate('user', ['name', 'email']);
        if(!loan){
            return res.status(404).json({msg: 'Loan not found or ot associated with this user!'});
        }

        const transformedLoan = {
            id: loan._id,
            amount: loan.amount,
            term: loan.term,
            repaymentFrequency: loan.repaymentFrequency,
            status:loan.status,
            date: loan.applicationDate,
            repayments: loan.repayments.map(repayment => ({
                id: repayment._id,
                loan: repayment.loan,
                amount: repayment.amount,
                dueDate: repayment.dueDate,
                status: repayment.status
            }))
        };
        res.json(transformedLoan);
    } catch(err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(404).json({msg: 'Loan not found!'});
        }
        res.status(500).send('Server Error!');
    }
};

// controller to approve loan of a user by an admin
exports.approveLoan = async (req, res) => {
    try {

        if (!req.user.isAdmin) {
            return res.status(403).json({msg: 'Forbidden: Only admins can approve loans'});
        }


        const loan = await Loan.findById(req.params.id);
        if(!loan){
            return res.status(404).json({msg: "Loan not found!"});
        }
        if(loan.status !== 'PENDING'){
            return res.status(400).json({msg:"Loan is not Pending."});
        }

        loan.status = 'APPROVED';
        await loan.save();
        res.json(loan);
    } catch(err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(404).json({msg: 'Loan not found!'});
        }
        res.status(500).send('Server Error!');
    }
};

//controller for feching all the loan details by the admin
exports.getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find().populate('user', ['name', 'email']);
        if(!loans || loans.length === 0) {
            return res.status(404).json({msg:'No Loans found!'});
        }
        res.json(loans);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
};
