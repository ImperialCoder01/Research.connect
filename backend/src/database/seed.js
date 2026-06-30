import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import ResearcherProfile from './models/ResearcherProfile.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear existing users
    await User.deleteMany({});
    await ResearcherProfile.deleteMany({});
    console.log('Cleared existing User and ResearcherProfile collections.');

    // Create Admin User
    const adminUser = new User({
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@researchconnect.com',
      password: 'AdminPassword123!',
      role: 'admin',
      isVerified: true,
    });
    await adminUser.save();
    console.log('Seeded Admin User.');

    // Create Sample Researchers
    const researchers = [
      {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@university.edu',
        password: 'Password123!',
        role: 'researcher',
        isVerified: true,
        profile: {
          title: 'Associate Professor of Computer Science',
          bio: 'Doing research in Deep Learning and Natural Language Processing.',
          institution: 'Stanford University',
          department: 'Computer Science',
          skills: ['Deep Learning', 'NLP', 'Computer Vision', 'Python'],
          socialLinks: {
            orcid: '0000-0001-2345-6789',
            googleScholar: 'https://scholar.google.com/citations?user=alice',
            linkedin: 'https://linkedin.com/in/alicesmith',
          },
        },
      },
      {
        firstName: 'Robert',
        lastName: 'Chen',
        email: 'robert.chen@lab.org',
        password: 'Password123!',
        role: 'researcher',
        isVerified: true,
        profile: {
          title: 'Senior Researcher',
          bio: 'Investigating quantum algorithms, quantum error correction, and superconducting qubits.',
          institution: 'Quantum Computing Laboratory',
          department: 'Quantum Systems',
          skills: ['Quantum Computing', 'Physics', 'Qiskit', 'Linear Algebra'],
          socialLinks: {
            orcid: '0000-0002-9876-5432',
            googleScholar: 'https://scholar.google.com/citations?user=robert',
            linkedin: 'https://linkedin.com/in/robertchen',
          },
        },
      },
    ];

    for (const r of researchers) {
      const user = new User({
        firstName: r.firstName,
        lastName: r.lastName,
        email: r.email,
        password: r.password,
        role: r.role,
        isVerified: r.isVerified,
      });
      await user.save();

      const profile = new ResearcherProfile({
        user: user._id,
        ...r.profile,
      });
      await profile.save();
      console.log(`Seeded Researcher: ${user.fullName}`);
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
