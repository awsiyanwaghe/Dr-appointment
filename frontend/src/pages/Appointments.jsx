import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import ReletedDoctors from "../components/ReletedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointments = () => {
  const { docId } = useParams();
  const { CurrencySymbol, backendUrl, token, getDoctorsData, doctors } = useContext(AppContext);
  const daysofWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setdocSlots] = useState([]);
  const [slotIndex, setslotIndex] = useState(0);
  const [slotTime, setslotTime] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

const getAvaliableSlots = async () => {
  if (!docInfo) return;

  setdocSlots([]); // Clear previous slots
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    // Set start time (10:00 AM)
    const startTime = new Date(currentDate);
    startTime.setHours(10, 0, 0, 0);

    // Set end time (9:00 PM)
    const endTime = new Date(currentDate);
    endTime.setHours(21, 0, 0, 0);

    // Adjust start time if it's today
    if (i === 0) {
      startTime.setHours(
        today.getHours() > 10 ? today.getHours() + 1 : 10,
        today.getMinutes() > 30 ? 30 : 0
      );
    }

    const timeSlots = [];
    let slotTime = new Date(startTime);

    while (slotTime < endTime) {
      const formattedTime = slotTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const day = slotTime.getDate();
      const month = slotTime.getMonth() + 1;
      const year = slotTime.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      // ✅ STRICT CHECK: Ensure slot is available
      const isSlotBooked =
        docInfo.slots_booked &&
        docInfo.slots_booked[slotDate] &&
        docInfo.slots_booked[slotDate].includes(formattedTime);

      if (!isSlotBooked) {
        timeSlots.push({
          datetime: new Date(slotTime),
          time: formattedTime,
        });
      }

      slotTime.setMinutes(slotTime.getMinutes() + 30); // Next slot
    }

    setdocSlots((prev) => [...prev, timeSlots]);
  }
};

const bookAppointment = async () => {
  if (!token) {
    toast.warn("Please login to book appointment");
    return navigate("/login");
  }

  if (!slotTime) {
    toast.warn("Please select a time slot");
    return;
  }

  try {
    const slotDateObj = docSlots[slotIndex][0].datetime;
    const day = slotDateObj.getDate();
    const month = slotDateObj.getMonth() + 1;
    const year = slotDateObj.getFullYear();

    const slotDate = `${day}_${month}_${year}`;

    const { data } = await axios.post(
      `${backendUrl}/api/user/book-appointment`,
      { docId, slotDate, slotTime },
      { headers: { token } }
    );

    if (data.success) {
      toast.success("Appointment booked successfully!");
      await getDoctorsData(); // Force reload doctor data
      await getAvaliableSlots(); // Re-generate slots
      navigate("/my-appointments");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Booking error:", error);
    toast.error(error.response?.data?.message || "Failed to book appointment");
  }
};

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvaliableSlots();
    }
  }, [docInfo]);
  
  if (!docInfo) {
    return <div>....loading</div>
  }

  return (
    docInfo && (
      <div>
        {/* doctor details  */}

        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* doctors info name degree expriene  */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            {/* doctors about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm to-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="to-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {CurrencySymbol} {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* booking slot  */}

        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 ">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setslotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index
                    ? "bg-[#5f6FFF] text-white"
                    : "border border-gray-200"
                    }`}
                  key={index}
                >
                  <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setslotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-200 ${item.time === slotTime
                    ? "bg-[#5f6FFF] text-white"
                    : "text-gray-600 border border-gray-300"
                    }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button onClick={bookAppointment} className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer ">Book an appointment</button>
        </div>
        {/* listing releted doctors */}

        <ReletedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointments;
