require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const loanRoutes = require('./routes/loan');
const repaymentRoutes = require('./routes/repayments');
const cors = require('cors')


const app = express();

//enable cors
app.use(cors());

// connect to MongoDB
connectDB()



//middleware
app.use(express.json());

//routes
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/repayments', repaymentRoutes);


const PORT = process.env.PORT || 4000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));