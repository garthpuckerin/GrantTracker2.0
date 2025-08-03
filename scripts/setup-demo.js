#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function setupDemo() {
  console.log('🚀 Setting up GrantTracker2.0 Demo...');
  
  try {
    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Push database schema
    console.log('🗄️  Setting up database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    // Seed with demo data
    console.log('🌱 Seeding demo data...');
    await seedDemoData();
    
    console.log('✅ Demo setup complete!');
    console.log('📝 Demo credentials: demo@university.edu / demo123');
    console.log('🔄 Database will auto-reset every 24 hours');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedDemoData() {
  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'demo@university.edu' },
    update: {},
    create: {
      clerkId: 'demo-admin-123',
      fullName: 'Demo Administrator',
      email: 'demo@university.edu',
      role: 'ADMIN',
    },
  });

  const piUser = await prisma.user.upsert({
    where: { email: 'pi@university.edu' },
    update: {},
    create: {
      clerkId: 'demo-pi-456',
      fullName: 'Dr. Jane Smith',
      email: 'pi@university.edu',
      role: 'PI',
    },
  });

  const financeUser = await prisma.user.upsert({
    where: { email: 'finance@university.edu' },
    update: {},
    create: {
      clerkId: 'demo-finance-789',
      fullName: 'Finance Manager',
      email: 'finance@university.edu',
      role: 'FINANCE',
    },
  });

  // Create demo grant
  const demoGrant = await prisma.grant.upsert({
    where: { grantNumberMaster: 'NSF-2024-001' },
    update: {},
    create: {
      grantTitle: 'Advanced Research in Computer Science',
      grantNumberMaster: 'NSF-2024-001',
      agencyName: 'National Science Foundation',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      currentYearNumber: 1,
      totalYears: 3,
      status: 'ACTIVE',
      principalInvestigatorId: piUser.id,
      createdById: adminUser.id,
    },
  });

  // Create grant years
  const year1 = await prisma.grantYear.upsert({
    where: { grantNumber: 'NSF-2024-001-Y1' },
    update: {},
    create: {
      grantId: demoGrant.id,
      yearNumber: 1,
      fiscalYear: '2024',
      grantNumber: 'NSF-2024-001-Y1',
      awardAmount: 500000.00,
      renewalStatus: 'AWARDED',
      submissionDueDate: new Date('2024-12-15'),
      notes: 'First year of funding - research phase',
    },
  });

  const year2 = await prisma.grantYear.upsert({
    where: { grantNumber: 'NSF-2024-001-Y2' },
    update: {},
    create: {
      grantId: demoGrant.id,
      yearNumber: 2,
      fiscalYear: '2025',
      grantNumber: 'NSF-2024-001-Y2',
      previousGrantNumber: 'NSF-2024-001-Y1',
      awardAmount: 450000.00,
      renewalStatus: 'PENDING',
      submissionDueDate: new Date('2025-01-15'),
      notes: 'Second year - implementation phase',
    },
  });

  // Create budget line items
  await prisma.budgetLineItem.createMany({
    skipDuplicates: true,
    data: [
      {
        grantYearId: year1.id,
        category: 'PERSONNEL',
        description: 'Principal Investigator Salary',
        budgetedAmount: 150000.00,
        actualSpent: 75000.00,
        encumberedAmount: 80000.00,
        lastUpdatedBy: financeUser.id,
      },
      {
        grantYearId: year1.id,
        category: 'SUPPLIES',
        description: 'Research Materials and Equipment',
        budgetedAmount: 100000.00,
        actualSpent: 45000.00,
        encumberedAmount: 50000.00,
        lastUpdatedBy: financeUser.id,
      },
      {
        grantYearId: year1.id,
        category: 'TRAVEL',
        description: 'Conference Travel and Presentations',
        budgetedAmount: 25000.00,
        actualSpent: 12000.00,
        encumberedAmount: 15000.00,
        lastUpdatedBy: financeUser.id,
      },
    ],
  });

  // Create demo tasks
  await prisma.task.createMany({
    skipDuplicates: true,
    data: [
      {
        grantYearId: year1.id,
        title: 'Submit Quarterly Report',
        description: 'Prepare and submit Q4 progress report to NSF',
        dueDate: new Date('2024-12-31'),
        assignedToId: piUser.id,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
      },
      {
        grantYearId: year1.id,
        title: 'Review Budget Allocation',
        description: 'Review current spending vs budgeted amounts',
        dueDate: new Date('2024-11-15'),
        assignedToId: financeUser.id,
        status: 'OPEN',
        priority: 'MEDIUM',
      },
      {
        grantYearId: year2.id,
        title: 'Prepare Renewal Application',
        description: 'Begin preparation for Year 2 renewal',
        dueDate: new Date('2024-12-01'),
        assignedToId: piUser.id,
        status: 'OPEN',
        priority: 'URGENT',
      },
    ],
  });

  console.log('✅ Demo data seeded successfully!');
}

// Auto-reset function for demo purposes
async function resetDemo() {
  console.log('🔄 Resetting demo data...');
  
  try {
    // Clear all data
    await prisma.task.deleteMany();
    await prisma.budgetLineItem.deleteMany();
    await prisma.document.deleteMany();
    await prisma.grantYear.deleteMany();
    await prisma.grant.deleteMany();
    await prisma.user.deleteMany();
    
    // Re-seed
    await seedDemoData();
    
    console.log('✅ Demo reset complete!');
  } catch (error) {
    console.error('❌ Reset failed:', error);
  }
}

// Handle command line arguments
const command = process.argv[2];

if (command === 'reset') {
  resetDemo().then(() => process.exit(0));
} else {
  setupDemo();
}

module.exports = { setupDemo, resetDemo, seedDemoData }; 