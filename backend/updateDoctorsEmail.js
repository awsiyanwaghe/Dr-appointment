import mongoose from 'mongoose';
import dotenv from 'dotenv';
import doctorModel from './models/doctorModel.js';

dotenv.config();

const updateDoctorsEmail = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        console.log('📊 Database:', mongoose.connection.name);

        // ✅ Sab doctors fetch karo
        const doctors = await doctorModel.find({});
        console.log(`👨‍⚕️ Total doctors found: ${doctors.length}`);

        if (doctors.length === 0) {
            console.log('❌ No doctors found');
            process.exit(0);
        }

        // ✅ Doctor name se email mapping
        const emailUpdates = [
            { currentEmail: 'patrick@gmail.com', newEmail: 'patrick@gmail.com' },
            { currentEmail: 'evans@gmail.com', newEmail: 'chloe@gmail.com' },
            { currentEmail: 'ryan@gmail.com', newEmail: 'ryan@gmail.com' },
            { currentEmail: 'patel@gmail.com', newEmail: 'sarah@gmail.com' },
            { currentEmail: 'jennifer@gmail.com', newEmail: 'jennifer@gmail.com' },
            { currentEmail: 'andrew@gmail.com', newEmail: 'andrew@gmail.com' },
            { currentEmail: 'timothy@gmail.com', newEmail: 'timothy@gmail.com' },
            { currentEmail: 'jeffrey@gmail.com', newEmail: 'jeffrey@gmail.com' },
            { currentEmail: 'zoe@gmail.com', newEmail: 'zoe@gmail.com' },
            { currentEmail: 'christopher@gmail.com', newEmail: 'christopher@gmail.com' },
            { currentEmail: 'amelia@gmail.com', newEmail: 'amelia@gmail.com' },
            { currentEmail: 'richard@gmail.com', newEmail: 'richard@gmail.com' },
            { currentEmail: 'emily@gmail.com', newEmail: 'emily@gmail.com' },
            { currentEmail: 'lee@gmail.com', newEmail: 'christopherlee@gmail.com' },
            { currentEmail: 'ava@gmail.com', newEmail: 'ava@gmail.com' }
        ];

        let updatedCount = 0;

        for (const update of emailUpdates) {
            // ✅ Doctor ko current email se find karo
            const doctor = await doctorModel.findOne({ email: update.currentEmail });
            
            if (doctor) {
                // ✅ Email update karo
                await doctorModel.findByIdAndUpdate(doctor._id, {
                    email: update.newEmail
                });
                updatedCount++;
                console.log(`✅ ${updatedCount}. ${doctor.name} - ${update.currentEmail} → ${update.newEmail}`);
            } else {
                console.log(`❌ Doctor not found with email: ${update.currentEmail}`);
            }
        }

        console.log('\n✅ ========================================');
        console.log(`✅ ${updatedCount} doctors email updated successfully!`);
        console.log('✅ ========================================');

        // ✅ Updated doctors list
        const updatedDoctors = await doctorModel.find({});
        console.log('\n📧 Updated Doctors List:');
        updatedDoctors.forEach((doc, i) => {
            console.log(`   ${i+1}. ${doc.name} → ${doc.email}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

updateDoctorsEmail();