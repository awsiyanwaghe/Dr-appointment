import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {
  const { aToken, setAToken, logoutAdmin } = useContext(AdminContext)
  const { dToken, setdToken, logoutDoctor } = useContext(DoctorContext)
  const navigate = useNavigate()

  const logout = () => {
    if (aToken) {
      logoutAdmin(); // Use the context's logout function
    } 
    if (dToken) {
      logoutDoctor(); // Use the context's logout function
    }
    
    toast.success("Logged out successfully");
    navigate('/login'); // Navigate after clearing tokens
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-sm'>
        <img 
          className='w-36 sm:w-40 cursor-pointer' 
          src={assets.admin_logo} 
          alt="Logo" 
          onClick={() => navigate(aToken ? '/admin-dashboard' : '/doctor-dashboard')}
        />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>
      <button 
        onClick={logout} 
        className='bg-[#5f6FFF] text-white text-sm px-10 py-2 rounded-full hover:bg-[#4a5ae9] transition-colors'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar