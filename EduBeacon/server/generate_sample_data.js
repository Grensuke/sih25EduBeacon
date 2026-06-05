const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User'); 

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to DB');

    const mentor = await User.findOne({ role: 'mentor', name: 'Joseph Joestar' });
    if (!mentor) {
      console.log('Joseph Joestar not found');
      process.exit(1);
    }

    const students = await User.find({ role: 'student', mentorId: mentor._id });
    
    console.log(`Found ${students.length} students to populate.`);

    const now = new Date();

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      
      // Determine baseline performance
      // Give different students different baselines
      let baseline = 80;
      if (i % 3 === 0) baseline = 95; // Excellent
      if (i % 3 === 1) baseline = 65; // Average
      if (i % 3 === 2) baseline = 40; // Poor

      // 1. Generate Attendance Data (Last 4 weeks)
      const history = [];
      let totalClasses = 0;
      let attendedClasses = 0;
      
      for (let daysAgo = 28; daysAgo >= 0; daysAgo--) {
        const d = new Date();
        d.setDate(now.getDate() - daysAgo);
        
        // Skip weekends
        if (d.getDay() === 0 || d.getDay() === 6) continue;
        
        totalClasses++;
        // Random chance based on baseline
        if (Math.random() * 100 < baseline) {
          attendedClasses++;
          history.push({ date: d, status: 'present', subject: 'General' });
        } else {
          history.push({ date: d, status: 'absent', subject: 'General' });
        }
      }

      student.attendanceData = {
        percentage: Math.round((attendedClasses / totalClasses) * 100),
        totalClasses,
        attendedClasses,
        history,
        lastUpdated: now
      };

      // 2. Generate Academic Data
      const testResults = [];
      const testNames = ['Mid-term', 'Quiz 1', 'Lab Test', 'Assignment'];
      let totalPercentage = 0;
      
      testNames.forEach((name, idx) => {
        const d = new Date();
        d.setDate(now.getDate() - (idx * 5 + 2)); // Spread out over past weeks
        
        // Vary performance around baseline
        let score = baseline + (Math.random() * 20 - 10);
        score = Math.max(0, Math.min(100, score));
        
        testResults.push({
          subject: 'Core Subject',
          testName: name,
          maxMarks: 100,
          obtainedMarks: Math.round(score),
          percentage: Math.round(score),
          date: d,
          grade: score > 90 ? 'A' : score > 75 ? 'B' : score > 60 ? 'C' : 'F'
        });
        totalPercentage += score;
      });

      const avgPercentage = totalPercentage / testNames.length;
      const gpa = Math.round((avgPercentage / 25) * 100) / 100;

      student.academicData = {
        overallGrade: avgPercentage > 90 ? 'A' : avgPercentage > 75 ? 'B' : avgPercentage > 60 ? 'C' : 'F',
        gpa: Math.min(4.0, Math.max(0, gpa)),
        testResults,
        subjectWisePerformance: [],
        lastUpdated: now
      };
      
      // 3. Fee Data
      student.feeData = {
        totalFeeAmount: 50000,
        paidAmount: baseline > 60 ? 50000 : 10000,
        pendingAmount: baseline > 60 ? 0 : 40000,
        paymentStatus: baseline > 60 ? 'paid' : 'overdue',
        dueDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        paymentHistory: []
      };

      // 4. Reset Legacy Fields so they don't interfere
      student.attendancePct = student.attendanceData.percentage;
      student.riskLevel = undefined; 

      await student.save();
      console.log(`Populated data for ${student.name} (Attendance: ${student.attendanceData.percentage}%)`);
    }

    console.log(`Successfully populated real data for all ${students.length} students.`);
    process.exit(0);
  } catch (err) {
      console.error(err);
      process.exit(1);
  }
}

run();
