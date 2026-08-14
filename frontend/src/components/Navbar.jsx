import React, { useState, useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // ✅ Context se correct values
  const { token, user, logout } = useContext(AppContext);

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = () => {
    logout();

    setShowProfileDropdown(false);

    toast.success("Logged out successfully");

    navigate("/");
  };

  // ================================
  // PROFILE DROPDOWN
  // ================================
  const toggleProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const closeProfileDropdown = () => {
    setShowProfileDropdown(false);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b">
      
      {/* ================================
          LOGO
      ================================= */}
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      {/* ================================
          DESKTOP NAVIGATION
      ================================= */}
      <ul className="hidden md:flex items-start gap-5 font-medium lg:text-[20px]">
        <NavLink to="/">
          <li className="py-1">Home</li>
          <hr className="hidden border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto" />
        </NavLink>

        <NavLink to="/doctors">
          <li className="py-1">All Doctors</li>
          <hr className="hidden border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto" />
        </NavLink>

        <NavLink to="/about">
          <li className="py-1">About</li>
          <hr className="hidden border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto" />
        </NavLink>

        <NavLink to="/contact">
          <li className="py-1">Contact</li>
          <hr className="hidden border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto" />
        </NavLink>
      </ul>

      {/* ================================
          RIGHT SIDE
      ================================= */}
      <div className="flex items-center gap-4">

        {/* =================================
            LOGGED IN
        ================================== */}
        {token && user ? (
          <div className="flex items-center gap-2 relative">

            {/* Profile */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={toggleProfileDropdown}
            >
              <img
                className="w-9 h-9 rounded-full object-cover"
                src={user.image}
                alt="Profile"
              />

              <img
                className="w-2.5"
                src={assets.dropdown_icon}
                alt="Dropdown"
              />
            </div>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div
                className="absolute top-full right-0 mt-2 text-base font-medium text-gray-600 z-30"
              >
                <div className="min-w-52 bg-white rounded-lg flex flex-col gap-4 p-4 shadow-lg border">

                  {/* User Name */}
                  <p className="text-gray-800 font-semibold border-b pb-2">
                    {user.name}
                  </p>

                  {/* My Profile */}
                  <p
                    onClick={() => {
                      navigate("/my-profile");
                      closeProfileDropdown();
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    My Profile
                  </p>

                  {/* My Appointments */}
                  <p
                    onClick={() => {
                      navigate("/my-appointments");
                      closeProfileDropdown();
                    }}
                    className="hover:text-black cursor-pointer"
                  >
                    My Appointments
                  </p>

                  {/* Logout */}
                  <p
                    onClick={handleLogout}
                    className="hover:text-red-500 cursor-pointer"
                  >
                    Logout
                  </p>

                </div>
              </div>
            )}
          </div>
        ) : (

          /* =================================
             NOT LOGGED IN
          ================================== */
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer"
          >
            Create account
          </button>

        )}

        {/* ================================
            MOBILE MENU ICON
        ================================= */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu"
        />

        {/* ================================
            MOBILE MENU
        ================================= */}
        <div
          className={`${
            showMenu
              ? "fixed w-full"
              : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-40 overflow-hidden bg-white transition-all`}
        >

          {/* Mobile Header */}
          <div className="flex items-center justify-between px-5 py-6">
            <img
              className="w-36"
              src={assets.logo}
              alt="Logo"
            />

            <img
              className="w-7 cursor-pointer"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="Close"
            />
          </div>

          {/* Mobile Links */}
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">

            <NavLink
              onClick={() => setShowMenu(false)}
              to="/"
            >
              <p className="px-4 py-2 rounded inline-block">
                Home
              </p>
            </NavLink>

            <NavLink
              onClick={() => setShowMenu(false)}
              to="/doctors"
            >
              <p className="px-4 py-2 rounded inline-block">
                All Doctors
              </p>
            </NavLink>

            <NavLink
              onClick={() => setShowMenu(false)}
              to="/about"
            >
              <p className="px-4 py-2 rounded inline-block">
                About
              </p>
            </NavLink>

            <NavLink
              onClick={() => setShowMenu(false)}
              to="/contact"
            >
              <p className="px-4 py-2 rounded inline-block">
                Contact
              </p>
            </NavLink>

            {/* Mobile Logged In */}
            {token && user ? (
              <>
                <p
                  onClick={() => {
                    navigate("/my-profile");
                    setShowMenu(false);
                  }}
                  className="px-4 py-2 cursor-pointer"
                >
                  My Profile
                </p>

                <p
                  onClick={() => {
                    navigate("/my-appointments");
                    setShowMenu(false);
                  }}
                  className="px-4 py-2 cursor-pointer"
                >
                  My Appointments
                </p>

                <p
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                  className="px-4 py-2 cursor-pointer text-red-500"
                >
                  Logout
                </p>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="bg-[#5f6FFF] text-white px-8 py-3 rounded-full mt-3"
              >
                Create account
              </button>
            )}

          </ul>
        </div>

      </div>
    </div>
  );
};

export default Navbar;