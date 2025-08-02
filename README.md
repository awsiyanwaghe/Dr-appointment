# 🏥 Prescripto

A full-stack Doctor Appointment Booking System where users can view doctors' availability, book appointments, make online payments, and manage their profiles. Built with the MERN Stack and styled using Tailwind CSS.

🌐 **Live Website:** [Prescripto on Render](https://dr-appointment-1.onrender.com/)

---

## ✨ Features

### 👨‍⚕️ For Users:
- View list of available doctors
- Check doctor availability
- Book an appointment for a specific date/time
- Online payment via Razorpay
- Edit personal profile details

### 🩺 For Doctors:
- Register and login to doctor dashboard
- Update profile (name, degree, address, fees, etc.)
- Mark appointment slots as complete or cancel
- View and manage upcoming appointments

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Axios
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- Razorpay API for payments

---

## 🚀 Getting Started (Local Setup)

### Prerequisites:
- Node.js installed
- MongoDB running locally or use MongoDB Atlas
- Razorpay developer keys

### Clone the repository:
```bash
git clone https://github.com/yourusername/prescripto.git
cd prescripto
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install


PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm start


