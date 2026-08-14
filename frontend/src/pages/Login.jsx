import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

// ✅ React Icons se Eye import karo
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  // 🔥 AppContext se login, register aur token le rahe hain
  const { login, register, token } = useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();

  // Sign Up / Login
  const [state, setState] = useState("Sign Up");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Loading
  const [loading, setLoading] = useState(false);

  // ✅ Password show/hide state
  const [showPassword, setShowPassword] = useState(false);

  // ================================
  // SUBMIT HANDLER
  // ================================
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (state === "Sign Up" && !name) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);

    try {
      // ================================
      // SIGN UP
      // ================================
      if (state === "Sign Up") {
        const result = await register({
          name,
          email,
          password,
        });

        if (result.success) {
          toast.success("Account created successfully");

          // Context already saves token.
          // Token change hone ke baad useEffect "/" par le jayega.
        } else {
          toast.error(result.message || "Registration failed");
        }
      }

      // ================================
      // LOGIN
      // ================================
      else {
        const result = await login(email, password);

        if (result.success) {
          toast.success("Logged in successfully");

          // Context token save karega.
          // Token change hone ke baad useEffect "/" par le jayega.
        } else {
          toast.error(result.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("Login/Register Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // REDIRECT AFTER LOGIN
  // ================================
  useEffect(() => {
    if (token) {
      const destination = location.state?.from || "/";
      navigate(destination, {
        replace: true,
      });
    }
  }, [token, location.state, navigate]);

  // ================================
  // UI
  // ================================
  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">

        {/* Heading */}
        <p className="text-2xl font-semibold text-zinc-800">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-500">
          Please{" "}
          {state === "Sign Up" ? "sign up" : "log in"} to book appointment
        </p>

        {/* ================================
            NAME - ONLY SIGN UP
        ================================= */}
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>

            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              placeholder="Enter your full name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        )}

        {/* ================================
            EMAIL
        ================================= */}
        <div className="w-full">
          <p>Email</p>

          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* ================================
            PASSWORD WITH SHOW/HIDE
        ================================= */}
        <div className="w-full">
          <p>Password</p>

          <div className="relative w-full">
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1 pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            {/* ✅ Eye Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        {/* ================================
            SUBMIT BUTTON
        ================================= */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base disabled:opacity-60"
        >
          {state === "Sign Up"
            ? loading
              ? "Signing Up..."
              : "Create Account"
            : loading
            ? "Logging in..."
            : "Login"}
        </button>

        {/* ================================
            SWITCH LOGIN / SIGNUP
        ================================= */}
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-[#5f6FFF] underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-[#5f6FFF] underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;