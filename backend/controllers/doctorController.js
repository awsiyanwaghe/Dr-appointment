import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";

const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, {
            available: !docData.available,
        });
        res.json({ success: true, message: "Available Changed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const doctorList = async (req, res) => {
    try {
        // ✅ Email bhi include karo (login ke liye)
        const doctors = await doctorModel.find({}).select("-password");
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// api for doctor login

const loginDoctor = async (req, res) => {
    try {
        console.log('🔐 Doctor Login Attempt');
        console.log('📧 Email:', req.body.email);
        console.log('🔑 Password:', req.body.password);
        
        const { email, password } = req.body

        if (!email || !password) {
            console.log('❌ Missing email or password');
            return res.json({ success: false, message: 'Email and password required' });
        }

        const doctor = await doctorModel.findOne({ email })
        console.log('👨‍⚕️ Doctor found:', doctor ? 'Yes' : 'No');

        if (!doctor) {
            return res.json({ success: false, message: 'Invalid Credentials' })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)
        console.log('🔑 Password match:', isMatch ? 'Yes' : 'No');

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            console.log('✅ Login successful!');
            res.json({ success: true, token })
        } else {
            console.log('❌ Password mismatch');
            return res.json({ success: false, message: 'Invalid Credentials' })
        }

    } catch (error) {
        console.log('❌ Login error:', error);
        res.json({ success: false, message: error.message });
    }
};
// api to get doctor appointment for doctor panel

const appointmentDoctor = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// api to mark appointment completed for doctor panel 

const appointmentComplete = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        } else {
            return res.json({ success: false, message: 'Mark Failed' })

        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// api to cancel appointment for doctor panel 

const appointmentCancel = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        } else {
            return res.json({ success: false, message: 'Cancelled Failed' })

        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


// api to get dashboard data for doctor panel 

const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        let earning = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earning += item.amount
            }
        })

        let patient = []

        appointments.map((item) => {
            if (!patient.includes(item.userId)) {
                patient.push(item.userId)
            }
        })
        const dashData = {
            earning,
            appointments: appointments.length,
            patient: patient.length,
            latestAppointment: appointments.reverse().slice(0, 5)
        }
        res.json({ success: true, dashData })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// api to get doctor profile for doctor panel

const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// api to update doctor profile data from doctor panel

const updateDoctorProfile= async(req,res)=>{
    try {
        const {docId , fees, address , available} = req.body
        await doctorModel.findByIdAndUpdate(docId , {fees, address , available})
        
        res.json({success:true , message:"Profile Updated"})
    } catch (error) {
       console.log(error);
        res.json({ success: false, message: error.message }); 
    }
}

export { changeAvailablity, doctorList, loginDoctor, appointmentDoctor, appointmentComplete, appointmentCancel, doctorDashboard , doctorProfile, updateDoctorProfile };

