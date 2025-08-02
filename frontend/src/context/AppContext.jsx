import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const CurrencySymbol = '₹'
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [doctors, setdoctors] = useState([])
  const [token, settoken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
  const [userData, setuserData] = useState(false)



  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list')
      if (data.success) {
        setdoctors(data.doctors)

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }
  }

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

      if (data.success) {
        setuserData(data.userData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }


  const value = {
    doctors, getDoctorsData,
    CurrencySymbol,
    token,
    settoken,
    backendUrl,
    userData,
    setuserData,                        // chat gpt se changes h 
    loadUserProfileData
  };


  useEffect(() => {
    getDoctorsData()
  }, [])


  useEffect(() => {
    if (token) {
      loadUserProfileData()
    } else {
      setuserData(false)
    }
  }, [token])




  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
