import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

// ✅ React Icons se Eye import karo
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {

    const navigate = useNavigate();

    const [state, setstate] = useState('Admin')

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')

    const { setAToken, backendUrl } = useContext(AdminContext)
    const { setdToken } = useContext(DoctorContext)

    // ✅ Password show/hide state
    const [showPassword, setShowPassword] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (state === 'Admin') {

                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
                console.log(backendUrl);

                if (data.success) {
                    localStorage.setItem('aToken', data.token)
                    setAToken(data.token);
                    toast.success('Admin login successful!')
                    navigate('/admin-dashboard')
                } else {
                    toast.error(data.message)
                }
            } else {

                const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
                if (data.success) {
                    localStorage.setItem('dToken', data.token)
                    setdToken(data.token);
                    console.log(data.token);
                    toast.success('Doctor login successful!');
                    navigate('/doctor-dashboard')
                } else {
                    toast.error(data.message)
                }

            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'><span className='text-[#5F6FFF]'>{state} </span>Login</p>
                
                <div className='w-full'>
                    <p>Email</p>
                    <input 
                        onChange={(e) => setemail(e.target.value)} 
                        value={email} 
                        className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                        type="email" 
                        required 
                    />
                </div>
                
                {/* ✅ Password with Show/Hide */}
                <div className='w-full'>
                    <p>Password</p>
                    <div className='relative w-full'>
                        <input 
                            onChange={(e) => setpassword(e.target.value)} 
                            value={password} 
                            className='border border-[#DADADA] rounded w-full p-2 mt-1 pr-10' 
                            type={showPassword ? "text" : "password"} 
                            required 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>
                </div>
                
                <button type='submit' className='bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base'>Login</button>
                
                {
                    state === "Admin" ? 
                    <p>Doctor Login <span className='text-[#5F6FFF] underline cursor-pointer' onClick={() => setstate('Doctor')}>Click here</span></p>
                    : 
                    <p>Admin Login <span className='text-[#5F6FFF] underline cursor-pointer' onClick={() => setstate('Admin')}>Click here</span></p>
                }
            </div>
        </form>
    )
}

export default Login