import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const {
    user,
    setUser,
    token,
    backendUrl,
    fetchUserProfile,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // UPDATE PROFILE
  // ==========================================
  const updateUserProfileData = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", user.name || "");
      formData.append("phone", user.phone || "");

      formData.append(
        "address",
        JSON.stringify(
          user.address || {
            line1: "",
            line2: "",
          }
        )
      );

      formData.append(
        "gender",
        user.gender || "Not Selected"
      );

      formData.append(
        "dob",
        user.dob || "Not Selected"
      );

      // Image only if user selected a new image
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData
      );

      console.log("Update profile response:", data);

      if (data.success) {
        toast.success(data.message);

        // Get fresh profile data
        await fetchUserProfile();

        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(
          data.message || "Failed to update profile"
        );
      }
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg flex flex-col gap-4 text-sm">
      
      {/* ==========================================
          PROFILE IMAGE
      ========================================== */}
      {isEdit ? (
        <label
          htmlFor="image"
          className="cursor-pointer"
        >
          <div className="inline-block relative">
            <img
              className="w-36 h-36 object-cover rounded"
              src={
                image
                  ? URL.createObjectURL(image)
                  : user.image
              }
              alt="Profile"
            />

            {!image && (
              <img
                className="w-10 absolute bottom-12 right-12"
                src={assets.upload_icon}
                alt="Upload"
              />
            )}
          </div>

          <input
            onChange={(e) =>
              setImage(e.target.files?.[0] || false)
            }
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
        </label>
      ) : (
        <img
          className="w-36 h-36 object-cover rounded"
          src={user.image}
          alt="Profile"
        />
      )}

      {/* ==========================================
          NAME
      ========================================== */}
      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4 border px-2 py-1 rounded"
          type="text"
          value={user.name || ""}
          onChange={(e) =>
            setUser((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {user.name}
        </p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      {/* ==========================================
          CONTACT INFORMATION
      ========================================== */}
      <div>
        <p className="text-neutral-500 underline mt-3">
          CONTACT INFORMATION
        </p>

        <div className="grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700">

          {/* EMAIL */}
          <p className="font-medium">
            Email id :
          </p>

          <p className="text-blue-500">
            {user.email}
          </p>

          {/* PHONE */}
          <p className="font-medium">
            Phone :
          </p>

          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52 border px-2 py-1 rounded"
              type="text"
              value={user.phone || ""}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-blue-400">
              {user.phone}
            </p>
          )}

          {/* ADDRESS */}
          <p className="font-medium">
            Address :
          </p>

          {isEdit ? (
            <div>
              <input
                className="bg-gray-100 border px-2 py-1 rounded w-full"
                placeholder="Address line 1"
                type="text"
                value={
                  user.address?.line1 || ""
                }
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    address: {
                      ...(prev.address || {}),
                      line1: e.target.value,
                    },
                  }))
                }
              />

              <br />

              <input
                className="bg-gray-100 border px-2 py-1 rounded w-full mt-2"
                placeholder="Address line 2"
                type="text"
                value={
                  user.address?.line2 || ""
                }
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    address: {
                      ...(prev.address || {}),
                      line2: e.target.value,
                    },
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {user.address?.line1}
              <br />
              {user.address?.line2}
            </p>
          )}
        </div>
      </div>

      {/* ==========================================
          BASIC INFORMATION
      ========================================== */}
      <div>
        <p className="text-neutral-500 underline mt-3">
          BASIC INFORMATION
        </p>

        <div className="grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700">

          {/* GENDER */}
          <p className="font-medium">
            Gender :
          </p>

          {isEdit ? (
            <select
              className="max-w-32 bg-gray-100 border px-2 py-1 rounded"
              value={
                user.gender || "Not Selected"
              }
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
            >
              <option value="Not Selected">
                Not Selected
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>
            </select>
          ) : (
            <p className="text-gray-400">
              {user.gender}
            </p>
          )}

          {/* DOB */}
          <p className="font-medium">
            Birthday :
          </p>

          {isEdit ? (
            <input
              className="max-w-36 bg-gray-100 border px-2 py-1 rounded"
              type="date"
              value={
                user.dob &&
                user.dob !== "Not Selected"
                  ? user.dob
                  : ""
              }
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  dob: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-gray-400">
              {user.dob}
            </p>
          )}
        </div>
      </div>

      {/* ==========================================
          BUTTON
      ========================================== */}
      <div className="mt-8">
        {isEdit ? (
          <button
            disabled={loading}
            className="border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all duration-500 disabled:opacity-50"
            onClick={updateUserProfileData}
          >
            {loading
              ? "Saving..."
              : "Save information"}
          </button>
        ) : (
          <button
            className="border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all duration-500"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;