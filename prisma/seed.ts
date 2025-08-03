import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@granttracker.com' },
    update: {},
    create: {
      clerkId: 'admin_clerk_id',
      fullName: 'System Administrator',
      email: 'admin@granttracker.com',
      role: 'ADMIN',
    },
  });

  // Create PI user
  const piUser = await prisma.user.upsert({
    where: { email: 'pi@university.edu' },
    update: {},
    create: {
      clerkId: 'pi_clerk_id',
      fullName: 'Dr. Jane Smith',
      email: 'pi@university.edu',
      role: 'PI',
    },
  });

  // Create Finance user
  const financeUser = await prisma.user.upsert({
    where: { email: 'finance@university.edu' },
    update: {},
    create: {
      clerkId: 'finance_clerk_id',
      fullName: 'John Finance',
      email: 'finance@university.edu',
      role: 'FINANCE',
    },
  });

  // Create sample grant
  const sampleGrant = await prisma.grant.upsert({
    where: { grantNumberMaster: 'EDU-STEM-2024' },
    update: {},
    create: {
      grantTitle: 'Improving STEM Education Through Technology',
      grantNumberMaster: 'EDU-STEM-2024',
      agencyName: 'Department of Education',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2028-12-31'),
      currentYearNumber: 1,
      totalYears: 5,
      status: 'ACTIVE',
      principalInvestigatorId: piUser.id,
      createdById: adminUser.id,
    },
  });

  // Create grant years
  const grantYears = [];
  for (let year = 1; year <= 5; year++) {
    const fiscalYear = `FY${2023 + year}`;
    const grantYear = await prisma.grantYear.upsert({
      where: { grantNumber: `EDU-STEM-${2023 + year}` },
      update: {},
      create: {
        grantId: sampleGrant.id,
        yearNumber: year,
        fiscalYear,
        grantNumber: `EDU-STEM-${2023 + year}`,
        previousGrantNumber: year > 1 ? `EDU-STEM-${2022 + year}` : null,
        awardAmount: 950000,
        renewalStatus: year === 1 ? 'AWARDED' : 'PENDING',
        submissionDueDate: new Date(`${2023 + year}-03-15`),
        notes: `Year ${year} of the STEM Education grant`,
      },
    });
    grantYears.push(grantYear);
  }

  // Create sample budget line items for Year 1
  const budgetCategories = [
    {
      category: 'PERSONNEL',
      description: 'Principal Investigator (50% effort)',
      budgetedAmount: 400000,
    },
    {
      category: 'PERSONNEL',
      description: 'Graduate Research Assistants (2 FTE)',
      budgetedAmount: 120000,
    },
    {
      category: 'EQUIPMENT',
      description: 'Laboratory Equipment and Software',
      budgetedAmount: 200000,
    },
    {
      category: 'SUPPLIES',
      description: 'Research Materials and Supplies',
      budgetedAmount: 50000,
    },
    {
      category: 'TRAVEL',
      description: 'Conference Travel and Dissemination',
      budgetedAmount: 30000,
    },
    {
      category: 'INDIRECT',
      description: 'Indirect Costs (15%)',
      budgetedAmount: 150000,
    },
  ];

  for (const budget of budgetCategories) {
    await prisma.budgetLineItem.upsert({
      where: {
        id: `${grantYears[0].id}-${budget.category}-${budget.description.slice(0, 10)}`,
      },
      update: {},
      create: {
        grantYearId: grantYears[0].id,
        category: budget.category as any,
        description: budget.description,
        budgetedAmount: budget.budgetedAmount,
        actualSpent: Math.floor(budget.budgetedAmount * 0.25), // 25% spent
        encumberedAmount: Math.floor(budget.budgetedAmount * 0.15), // 15% encumbered
        lastUpdatedBy: financeUser.id,
      },
    });
  }

  // Create sample tasks
  const sampleTasks = [
    {
      title: 'Submit Annual Report',
      description:
        'Prepare and submit the annual progress report to the funding agency',
      dueDate: new Date('2024-12-31'),
      priority: 'HIGH',
      status: 'OPEN',
    },
    {
      title: 'Equipment Purchase Approval',
      description: 'Get approval for laboratory equipment purchases',
      dueDate: new Date('2024-06-30'),
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    },
    {
      title: 'Hire Graduate Students',
      description: 'Recruit and hire 2 graduate research assistants',
      dueDate: new Date('2024-08-15'),
      priority: 'HIGH',
      status: 'COMPLETE',
    },
  ];

  for (const task of sampleTasks) {
    await prisma.task.create({
      data: {
        grantYearId: grantYears[0].id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        assignedToId: piUser.id,
        status: task.status as any,
        priority: task.priority as any,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin User: ${adminUser.email}`);
  console.log(`👤 PI User: ${piUser.email}`);
  console.log(`👤 Finance User: ${financeUser.email}`);
  console.log(`📊 Grant: ${sampleGrant.grantTitle}`);
  console.log(`📅 Grant Years: ${grantYears.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
