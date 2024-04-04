# LOANEASY SERVER System

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction
The LOANEASY SERVER System is a web application designed to manage loans, repayments, and user accounts. It provides a comprehensive solution for loan management, including creating loans, approving loans, fetching loan details, and managing repayments. The system is built with Node.js, Express, and MongoDB, utilizing Mongoose for database operations.

## Features
- User authentication and authorization
- Loan creation and management
- Repayment tracking and management
- Admin functionalities for loan approval

## Installation
1. Clone the repository: `git clone https://github.com/yourusername/loan-management-system.git`
2. Navigate to the project directory: `cd loan-management-system`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory and add your MongoDB URI and JWT secret:
    ***MONGODB_URI=your_mongodb_uri
    ***JWT_SECRET=your_jwt_secret
5. 5. Start the server: `npm start`

## Usage
The application runs on port 4000 by default. You can access the API endpoints using tools like Postman or through the frontend application.

## API Endpoints
- **User Routes**:
 - POST `/api/users/signup`: Register a new user
 - POST `/api/users/login`: Authenticate a user and return a JWT token
 - GET `/api/users/me`: Get the authenticated user's details
- **Loan Routes**:
 - POST `/api/loans/createloan`: Create a new loan
 - GET `/api/loans/user`: Get all loans for the authenticated user
 - GET `/api/loans/user/:id`: Get a specific loan for the authenticated user
 - PUT `/api/loans/:id/approve`: Approve a loan (admin only)
 - GET `/api/loans/all`: Get all loans (admin only)
- **Repayment Routes**:
 - POST `/api/repayments/makerepayment`: Make a repayment for a loan

## Contributing
Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
