import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // <-- Make sure this is imported
import { AdminContext } from './context/AdminContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard'
import AllApointments from './pages/Admin/AllApointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'
import { DoctorContext } from './context/DoctorContext'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'

const App = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  return (
    <>
      {/* Single ToastContainer at the root level */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {aToken || dToken ? (
        <div className='bg-[#F8F9FD]'>
          <Navbar />
          <div className='flex items-start'>
            <Sidebar />
            <Routes>
              {/* admin Route  */}
              <Route path='/' element={<></>} />
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/all-appointments' element={<AllApointments />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/doctor-list' element={<DoctorsList />} />
              {/* doctor Route  */}
              <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
              <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
              <Route path='/doctor-profile' element={<DoctorProfile/>} />
            </Routes>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  )
}

export default App