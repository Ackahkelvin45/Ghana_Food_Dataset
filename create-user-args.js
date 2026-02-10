#!/usr/bin/env node

/**
 * Command Line User Creation Script
 * Creates a user with provided arguments
 * Usage: node create-user-args.js "Full Name" "email@example.com" "password" "USER_TYPE" "phone"
 */

import { config } from 'dotenv';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';

// Load environment variables
config();

let prisma;
try {
  console.log('🔌 Connecting to database...');

  // Create database connection
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  // We'll use raw SQL queries instead of Prisma client
  prisma = {
    user: {
      findUnique: async (query) => {
        const result = await client.query(
          'SELECT id, email, "fullName" FROM "User" WHERE email = $1',
          [query.where.email]
        );
        return result.rows[0] || null;
      },
      create: async (query) => {
        const hashedPassword = await bcrypt.hash(query.data.password, 10);
        const now = new Date();
        const result = await client.query(
          'INSERT INTO "User" ("fullName", email, password, "userType", phone, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING *',
          [query.data.fullName, query.data.email, hashedPassword, query.data.userType, query.data.phone, now]
        );
        return result.rows[0];
      }
    },
    $connect: () => client.connect(),
    $disconnect: () => client.end()
  };

  await prisma.$connect();
  console.log('✅ Database connected successfully!');
} catch (error) {
  console.error('❌ Failed to create database connection:', error.message);
  console.error('❌ Full error:', error);
  console.log('💡 Make sure DATABASE_URL is set in .env file');
  console.log('💡 Make sure PostgreSQL is running');
  console.log('💡 Try: docker-compose up -d');
  process.exit(1);
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('❌ Usage: node create-user-args.js "Full Name" "email@example.com" "password" [USER_TYPE] [phone]');
  console.error('❌ Examples:');
  console.error('   node create-user-args.js "John Doe" "john@example.com" "password123"');
  console.error('   node create-user-args.js "Jane Admin" "jane@example.com" "password123" "ADMIN" "+1234567890"');
  process.exit(1);
}

const [fullName, email, password, userType = 'USER', phone] = args;

// Validate inputs
if (!fullName || !email || !password) {
  console.error('❌ Full name, email, and password are required');
  process.exit(1);
}

if (!email.includes('@')) {
  console.error('❌ Please provide a valid email address');
  process.exit(1);
}

if (password.length < 6) {
  console.error('❌ Password must be at least 6 characters long');
  process.exit(1);
}

if (!['USER', 'ADMIN'].includes(userType.toUpperCase())) {
  console.error('❌ User type must be either "USER" or "ADMIN"');
  process.exit(1);
}

async function createUser() {
  try {
    console.log('🧑‍💻 Creating user...');

    const userData = {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      userType: userType.toUpperCase(),
      phone: phone ? phone.trim() : null,
    };

    console.log(`   Name: ${userData.fullName}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Role: ${userData.userType}`);
    if (userData.phone) {
      console.log(`   Phone: ${userData.phone}`);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      console.log('❌ User with this email already exists!');
      return;
    }

    // Create user
    const user = await prisma.user.create({
      data: userData
    });

    console.log('\n✅ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name: ${user.fullname || user.fullName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.usertype || user.userType}`);
    if (user.phone) {
      console.log(`Phone: ${user.phone}`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🎉 User credentials:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${password}`);
    console.log('\n💡 You can now log in with these credentials!');

  } catch (error) {
    console.error('❌ Error creating user:', error.message);

    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Database connection failed!');
      console.log('   Make sure your database is running.');
      console.log('   Try: docker-compose up -d');
      console.log('   Check: docker-compose logs db');
    } else if (error.message.includes('relation "User" does not exist')) {
      console.log('\n💡 Database tables not created!');
      console.log('   Run: npx prisma migrate deploy');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle script interruption
process.on('SIGINT', async () => {
  console.log('\n\n👋 Script interrupted. Cleaning up...');
  await prisma.$disconnect();
  process.exit(0);
});

// Run the script
createUser().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});