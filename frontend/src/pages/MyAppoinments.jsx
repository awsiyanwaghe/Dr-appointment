import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const MyAppoinments = () => {
  const {
    backendUrl,
    token,
    fetchDoctors,
  } = useContext(AppContext);

  const [appointments, setAppointments] =
    useState([]);

  const navigate = useNavigate();

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const slotDateFormate = (slotDate) => {
    if (!slotDate) return "";

    const dateArray = slotDate.split("_");

    return (
      dateArray[0] +
      " " +
      months[Number(dateArray[1])] +
      " " +
      dateArray[2]
    );
  };

  // ==========================================
  // GET USER APPOINTMENTS
  // ==========================================
  const getUserAppointments = async () => {
    try {
      if (!token) {
        return;
      }

      // Axios interceptor automatically sends:
      // Authorization: Bearer TOKEN
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`
      );

      console.log(
        "Appointments response:",
        data
      );

      if (data.success) {
        setAppointments(
          [...data.appointments].reverse()
        );
      } else {
        toast.error(
          data.message || "Failed to load appointments"
        );
      }
    } catch (error) {
      console.error(
        "Get appointments error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load appointments"
      );
    }
  };

  // ==========================================
  // CANCEL APPOINTMENT
  // ==========================================
  const cancelAppointment = async (
    appointmentId
  ) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        {
          appointmentId,
        }
      );

      if (data.success) {
        toast.success(data.message);

        await getUserAppointments();
        await fetchDoctors();
      } else {
        toast.error(
          data.message || "Failed to cancel appointment"
        );
      }
    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to cancel appointment"
      );
    }
  };

  // ==========================================
  // RAZORPAY PAYMENT
  // ==========================================
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,

      amount: order.amount,

      currency: order.currency,

      name: "Prescripto",

      description: "Appointment Payment",

      order_id: order.id,

      receipt: order.receipt,

      handler: async (response) => {
        console.log(
          "Razorpay response:",
          response
        );

        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response
          );

          if (data.success) {
            toast.success(
              "Payment successful!"
            );

            await getUserAppointments();

            navigate("/my-appointments");
          } else {
            toast.error(
              data.message || "Payment failed"
            );
          }
        } catch (error) {
          console.error(
            "Payment verification error:",
            error
          );

          toast.error(
            error.response?.data?.message ||
              "Payment verification failed"
          );
        }
      },

      theme: {
        color: "#5f6FFF",
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.open();
  };

  // ==========================================
  // CREATE RAZORPAY ORDER
  // ==========================================
  const appointmentRazorPay = async (
    appointmentId
  ) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        {
          appointmentId,
        }
      );

      console.log(
        "Payment order response:",
        data
      );

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(
          data.message || "Unable to start payment"
        );
      }
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Payment failed"
      );
    }
  };

  // ==========================================
  // LOAD APPOINTMENTS
  // ==========================================
  useEffect(() => {
    if (token) {
      getUserAppointments();
      fetchDoctors();
    } else {
      setAppointments([]);
    }
  }, [token]);

  return (
    <div>
      {/* ==========================================
          TITLE
      ========================================== */}
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My appointments
      </p>

      {/* ==========================================
          APPOINTMENTS
      ========================================== */}
      <div>
        {appointments.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No appointments found.
          </div>
        ) : (
          appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-5 border-b"
              key={item._id || index}
            >
              {/* Doctor Image */}
              <div>
                <img
                  className="w-40 bg-[#EAEFFF] rounded-lg"
                  src={item.docData?.image}
                  alt={item.docData?.name}
                />
              </div>

              {/* Doctor Details */}
              <div className="flex-1 text-sm text-zinc-600">

                <p className="text-zinc-800 font-semibold text-base">
                  {item.docData?.name}
                </p>

                <p className="mt-1">
                  {item.docData?.speciality}
                </p>

                <p className="mt-2 font-medium text-zinc-700">
                  Address:
                </p>

                <p>
                  {item.docData?.address?.line1}
                </p>

                <p>
                  {item.docData?.address?.line2}
                </p>

                <p className="mt-2">
                  <span className="font-medium text-zinc-700">
                    Date & Time:
                  </span>{" "}
                  {slotDateFormate(
                    item.slotDate
                  )}{" "}
                  | {item.slotTime}
                </p>

                {/* =================================
                    BUTTONS
                ================================= */}

                <div className="flex flex-wrap gap-3 mt-4">

                  {/* Paid */}
                  {!item.cancelled &&
                    item.payment &&
                    !item.isCompleted && (
                      <button
                        disabled
                        className="text-sm text-green-600 text-center sm:min-w-48 py-2 border border-green-500 rounded"
                      >
                        Paid
                      </button>
                    )}

                  {/* Pay Online */}
                  {!item.cancelled &&
                    !item.payment &&
                    !item.isCompleted && (
                      <button
                        onClick={() =>
                          appointmentRazorPay(
                            item._id
                          )
                        }
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        Pay Online
                      </button>
                    )}

                  {/* Cancel */}
                  {!item.cancelled &&
                    !item.isCompleted &&
                    !item.payment && (
                      <button
                        onClick={() =>
                          cancelAppointment(
                            item._id
                          )
                        }
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        Cancel appointment
                      </button>
                    )}

                  {/* Cancelled */}
                  {item.cancelled &&
                    !item.isCompleted && (
                      <button
                        disabled
                        className="text-sm text-red-500 text-center sm:min-w-48 py-2 border border-red-300 rounded"
                      >
                        Appointment cancelled
                      </button>
                    )}

                  {/* Completed */}
                  {item.isCompleted && (
                    <button
                      disabled
                      className="text-sm text-green-600 text-center sm:min-w-48 py-2 border border-green-300 rounded"
                    >
                      Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppoinments;