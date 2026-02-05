const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Event = require('./models/Event');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Event.deleteMany({});

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const insurancePassword = await bcrypt.hash('company123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@autoreport.lb',
      password: adminPassword,
      role: 'admin'
    });

    const insurance = await User.create({
      name: 'Beirut Insurance Co.',
      email: 'agent@beirutinsurance.com',
      password: insurancePassword,
      role: 'insurance',
      companyName: 'Beirut Insurance Co.',
      isVerified: true
    });

    console.log('Users created');

    // 2. Create Vehicle
    const vehicle = await Vehicle.create({
      vin: 'WBA1234567890ABCD',
      plateNumber: 'B 987654',
      make: 'BMW',
      model: '320i',
      year: 2018,
      color: 'White'
    });

    console.log('Vehicle created');

    // 3. Create Events
    const events = [
      {
        vehicleId: vehicle._id,
        reporterId: insurance._id,
        eventType: 'import',
        description: 'Vehicle imported from Germany. Customs cleared at Beirut Port.',
        dateOccurred: new Date('2018-05-15')
      },
      {
        vehicleId: vehicle._id,
        reporterId: insurance._id,
        eventType: 'accident',
        description: 'Minor collision at Dora highway. Front bumper damage reported. No injuries.',
        dateOccurred: new Date('2020-11-20')
      },
      {
        vehicleId: vehicle._id,
        reporterId: insurance._id,
        eventType: 'claim',
        description: 'Insurance claim filed for front bumper repair and headlight replacement.',
        dateOccurred: new Date('2020-11-22')
      }
    ];

    await Event.insertMany(events);
    
    // Update vehicle last event date
    vehicle.lastEventDate = new Date('2020-11-22');
    await vehicle.save();

    console.log('Events created');

    console.log('Seeding Complete!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
