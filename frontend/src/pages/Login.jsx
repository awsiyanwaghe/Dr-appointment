import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Login = () => {

  const { backendUrl, token, settoken } = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setstate] = useState("Sign Up");

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [loading, setloading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setloading(true)
    try {
      if (state === 'Sign Up') {

        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          settoken(data.token)
          toast.success("Account created successfully");
        } else {
          toast.error(data.message)
        }
      } else {

        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)

          settoken(data.token)
          toast.success("Logged in successfully");
        } else {
          toast.error(data.message)
        }

      }
    } catch (error) {
      toast.error(error.message)

    }finally{
      setloading(false)
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200  rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "sign up" : "log in"} to book
          appointment
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setname(e.target.value)}
              value={name}
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="text"
            onChange={(e) => setemail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="text"
            onChange={(e) => setpassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit" className=" bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base">
          {state === "Sign Up" ?(loading ? "SignUp..." : "Create Account") : (loading ? "loging...":"Login")}
          
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setstate("Login")}
              className="text-[#5f6FFF] underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create an new account?{" "}
            <span
              onClick={() => setstate("Sign Up")}
              className="text-[#5f6FFF] underline cursor-pointer"
            >
              {" "}
              click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
