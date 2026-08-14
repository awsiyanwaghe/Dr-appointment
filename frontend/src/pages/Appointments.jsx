import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import ReletedDoctors from "../components/ReletedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointments = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const {
    CurrencySymbol,
    backendUrl,
    token,
    fetchDoctors,
    doctors,
  } = useContext(AppContext);

  const daysofWeek = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
  ];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET DOCTOR INFO
  // ==========================================
  const fetchDocInfo = () => {
    const doctor = doctors.find((doc) => doc._id === docId);

    setDocInfo(doctor);
  };

  // ==========================================
  // GENERATE AVAILABLE SLOTS
  // ==========================================
  const getAvailableSlots = () => {
    if (!docInfo) return;

    setDocSlots([]);

    const today = new Date();
    const allSlots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);

      currentDate.setDate(today.getDate() + i);

      // Start time - 10 AM
      const startTime = new Date(currentDate);
      startTime.setHours(10, 0, 0, 0);

      // End time - 9 PM
      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      // If today, don't show past slots
      if (i === 0) {
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();

        if (currentHour >= 10) {
          startTime.setHours(
            currentMinute > 30
              ? currentHour + 1
              : currentHour,
            currentMinute > 30 ? 0 : 30,
            0,
            0
          );
        }
      }

      const timeSlots = [];

      let slotDateTime = new Date(startTime);

      while (slotDateTime < endTime) {
        const formattedTime = slotDateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const day = slotDateTime.getDate();
        const month = slotDateTime.getMonth() + 1;
        const year = slotDateTime.getFullYear();

        const slotDate = `${day}_${month}_${year}`;

        // Check if slot is already booked
        const isSlotBooked =
          docInfo.slots_booked &&
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(formattedTime);

        if (!isSlotBooked) {
          timeSlots.push({
            datetime: new Date(slotDateTime),
            time: formattedTime,
          });
        }

        // Next slot after 30 minutes
        slotDateTime.setMinutes(
          slotDateTime.getMinutes() + 30
        );
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================
  const bookAppointment = async () => {
    // User login check
   if (!token) {
  toast.warn("Please login to book appointment");

  navigate("/login", {
    state: {
      from: `/appointment/${docId}`,
    },
  });

  return;
}

    // Time slot check
    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    // Date check
    if (!docSlots[slotIndex] || !docSlots[slotIndex][0]) {
      toast.warn("Please select a valid date");
      return;
    }

    // Prevent double click
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const selectedSlot =
        docSlots[slotIndex][0].datetime;

      const day = selectedSlot.getDate();
      const month = selectedSlot.getMonth() + 1;
      const year = selectedSlot.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      console.log("Booking appointment:", {
        docId,
        slotDate,
        slotTime,
      });

      // Axios interceptor automatically sends:
      // Authorization: Bearer TOKEN
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime,
        }
      );

      console.log("Booking response:", data);

      if (data.success) {
        toast.success("Appointment booked successfully!");

        // Refresh doctors data
        await fetchDoctors();

        // Go to My Appointments
        navigate("/my-appointments");
      } else {
        toast.error(
          data.message || "Failed to book appointment"
        );
      }
    } catch (error) {
      console.error("Booking error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET DOCTOR WHEN DOCTORS LOAD
  // ==========================================
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  // ==========================================
  // GENERATE SLOTS WHEN DOCTOR LOADS
  // ==========================================
  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  // ==========================================
  // LOADING
  // ==========================================
  if (!docInfo) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">
          Loading doctor details...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ==========================================
          DOCTOR DETAILS
      ========================================== */}
      <div className="flex flex-col sm:flex-row gap-4">

        {/* Doctor Image */}
        <div>
          <img
            className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        {/* Doctor Information */}
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">

          {/* Name */}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}

            <img
              className="w-5"
              src={assets.verified_icon}
              alt="Verified"
            />
          </p>

          {/* Degree / Speciality / Experience */}
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>

            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>

          {/* About */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About

              <img
                src={assets.info_icon}
                alt="Info"
              />
            </p>

            <p className="text-sm text-gray-500 max-w-[700px] mt-1">
              {docInfo.about}
            </p>
          </div>

          {/* Fee */}
          <p className="text-gray-500 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-600">
              {CurrencySymbol} {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* ==========================================
          BOOKING SLOTS
      ========================================== */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">

        <p>Booking slots</p>

        {/* Dates */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">

          {docSlots.length > 0 &&
            docSlots.map((item, index) => (
              <div
                onClick={() => {
                  setSlotIndex(index);
                  setSlotTime("");
                }}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-[#5f6FFF] text-white"
                    : "border border-gray-200"
                }`}
                key={index}
              >
                <p>
                  {item[0] &&
                    daysofWeek[
                      item[0].datetime.getDay()
                    ]}
                </p>

                <p>
                  {item[0] &&
                    item[0].datetime.getDate()}
                </p>
              </div>
            ))}
        </div>

        {/* Time Slots */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">

          {docSlots.length > 0 &&
            docSlots[slotIndex]?.map(
              (item, index) => (
                <p
                  onClick={() =>
                    setSlotTime(item.time)
                  }
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                    item.time === slotTime
                      ? "bg-[#5f6FFF] text-white"
                      : "text-gray-600 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              )
            )}
        </div>

        {/* Book Button */}
        <button
          onClick={bookAppointment}
          disabled={loading}
          className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? "Booking..."
            : "Book an appointment"}
        </button>
      </div>

      {/* ==========================================
          RELATED DOCTORS
      ========================================== */}
      <ReletedDoctors
        docId={docId}
        speciality={docInfo.speciality}
      />
    </div>
  );
};

export default Appointments;