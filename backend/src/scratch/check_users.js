const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');
    
    const users = await User.find({ isDeleted: { $ne: true } }).lean();
    console.log(`Found ${users.length} active users:`);
    
    for (const u of users) {
      console.log(`- Name: ${u.firstName} ${u.lastName}, Username: ${u.username}, Slug: ${u.profileSlug}, Email: ${u.email}`);
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkUsers();
