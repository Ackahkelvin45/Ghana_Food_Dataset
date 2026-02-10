#!/usr/bin/env node

/**
 * Quick User Creation Script for Testing
 * Creates a test user with predefined credentials
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

async function createTestUser() {
  try {
    console.log('🧑‍💻 Creating test user...');

    // Test user credentials
    const testUser = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      userType: 'USER',
      phone: '+1234567890'
    };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email }
    });

    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Password: ${testUser.password}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName: testUser.fullName,
        email: testUser.email.toLowerCase(),
        password: hashedPassword,
        userType: testUser.userType,
        phone: testUser.phone || null,
      }
    });

    console.log('\n✅ Test user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name: ${user.fullname || user.fullName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.usertype || user.userType}`);
    if (user.phone) {
      console.log(`Phone: ${user.phone}`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🎉 Test user credentials:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${testUser.password}`);
    console.log('\n💡 You can now test the forgot password functionality!');

  } catch (error) {
    console.error('❌ Error creating test user:', error.message);

    if (error.message.includes('connect') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Database connection failed!');
      console.log('   Make sure your database is running.');
      console.log('   Try: docker-compose up -d');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createTestUser();