const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User'); // Mongoose model

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to DB');

    // Find Joseph Joestar or any mentor if Joseph is missing
    let mentor = await User.findOne({ role: 'mentor', name: 'Joseph Joestar' });
    if (!mentor) {
        console.log('Joseph Joestar not found, picking first available mentor...');
        mentor = await User.findOne({ role: 'mentor' });
    }
    
    if (!mentor) {
      console.log('No mentors found in the database!');
      process.exit(1);
    }

    console.log(`Assigning students to: ${mentor.name} (${mentor._id})`);

    const unassignedStudents = await User.find({ 
        role: 'student', 
        $or: [
            { mentorId: null }, 
            { mentorId: { $exists: false } }
        ] 
    });
    
    console.log(`Found ${unassignedStudents.length} unassigned students`);

    let count = 0;
    for (const student of unassignedStudents) {
      student.mentorId = mentor._id;
      // Also sync organizationId if missing
      if (!student.organizationId) {
          student.organizationId = mentor.organizationId;
      }
      await student.save();
      console.log(`Assigned ${student.name} to ${mentor.name}`);
      count++;
    }

    console.log(`Successfully assigned ${count} students.`);
    process.exit(0);
  } catch (err) {
      console.error(err);
      process.exit(1);
  }
}

run();
