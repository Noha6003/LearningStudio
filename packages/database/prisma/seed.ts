import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records
  console.log('🗑 Cleaning existing database...');
  await prisma.userOrgLink.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.shopItem.deleteMany({});
  await prisma.quest.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.marketplaceListing.deleteMany({});

  // 2. Create Default Organization & structure
  console.log('🏢 Creating default Organization...');
  const org = await prisma.organization.create({
    data: {
      name: 'Global Discovery Academy',
      slug: 'global-discovery-academy',
      billingPlan: 'ENTERPRISE',
      campuses: {
        create: {
          name: 'Primary Campus',
          departments: {
            create: [
              { name: 'STEM Department' },
              { name: 'Humanities Department' }
            ]
          }
        }
      }
    },
    include: {
      campuses: {
        include: {
          departments: true
        }
      }
    }
  });

  const department = org.campuses[0].departments[0]; // STEM

  // 3. Create Users
  console.log('👥 Creating default users...');
  
  // Super Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@learning.com',
      name: 'Super Admin',
      password: 'password123', // In production, this will be hashed
      role: 'SUPER_ADMIN',
    }
  });

  // Teacher
  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@learning.com',
      name: 'Professor Sarah',
      password: 'password123',
      role: 'TEACHER',
      teacherProfile: {
        create: {
          approved: true,
          bio: 'Math & Science Educator dedicated to interactive learning.',
        }
      }
    },
    include: {
      teacherProfile: true
    }
  });

  // Student
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@learning.com',
      name: 'Sammy Star',
      password: 'password123',
      role: 'STUDENT',
      studentProfile: {
        create: {
          xp: 120,
          level: 1,
          coins: 250,
          streak: 3,
          avatarId: 'avatar-robot',
          frameId: 'frame-gold',
          petId: 'pet-dragon',
        }
      },
      aiMemory: {
        create: {
          learningStyle: 'interactive',
          readingLevel: 5,
          attentionSpan: 12,
          weakTopics: JSON.stringify(['fractions', 'prehistory']),
          strongTopics: JSON.stringify(['addition', 'planets']),
          mistakeLog: JSON.stringify([])
        }
      }
    },
    include: {
      studentProfile: true
    }
  });

  // Parent
  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@learning.com',
      name: 'Helen Star (Parent)',
      password: 'password123',
      role: 'PARENT',
      parentProfile: {
        create: {}
      }
    },
    include: {
      parentProfile: true
    }
  });

  // Link Parent & Student
  if (studentUser.studentProfile && parentUser.parentProfile) {
    await prisma.studentProfile.update({
      where: { id: studentUser.studentProfile.id },
      data: { parentId: parentUser.parentProfile.id }
    });
  }

  // Link users to Org
  await prisma.userOrgLink.createMany({
    data: [
      { userId: adminUser.id, organizationId: org.id, roleInOrg: 'SUPER_ADMIN' },
      { userId: teacherUser.id, organizationId: org.id, roleInOrg: 'TEACHER' },
      { userId: studentUser.id, organizationId: org.id, roleInOrg: 'STUDENT' },
      { userId: parentUser.id, organizationId: org.id, roleInOrg: 'PARENT' },
    ]
  });

  // 4. Create Shop Items
  console.log('🛍 Creating cosmetic shop items...');
  await prisma.shopItem.createMany({
    data: [
      // Avatars
      {
        id: 'avatar-robot',
        name: 'Robo Buddy',
        description: 'A cute futuristic metal assistant!',
        price: 50,
        type: 'AVATAR',
        imageUrl: '/avatars/robot.png'
      },
      {
        id: 'avatar-cat',
        name: 'Wizard Cat',
        description: 'Spells and whiskers combined.',
        price: 100,
        type: 'AVATAR',
        imageUrl: '/avatars/cat.png'
      },
      {
        id: 'avatar-dino',
        name: 'Rexy Dino',
        description: 'T-Rex with a studying cap.',
        price: 150,
        type: 'AVATAR',
        imageUrl: '/avatars/dino.png'
      },
      // Frames
      {
        id: 'frame-gold',
        name: 'Glittering Gold',
        description: 'Show everyone your stellar grades.',
        price: 75,
        type: 'FRAME',
        imageUrl: '/frames/gold.png',
        styleConfig: 'border-amber-400 shadow-[0_0_10px_#f59e0b]'
      },
      {
        id: 'frame-neon',
        name: 'Neon Cyber',
        description: 'Light up the leaderboard.',
        price: 120,
        type: 'FRAME',
        imageUrl: '/frames/neon.png',
        styleConfig: 'border-cyan-400 shadow-[0_0_12px_#06b6d4]'
      },
      // Pets
      {
        id: 'pet-dragon',
        name: 'Sparky Dragon',
        description: 'Breaths tiny sparks when you answer correctly!',
        price: 200,
        type: 'PET',
        imageUrl: '/pets/dragon.png'
      },
      {
        id: 'pet-dog',
        name: 'Pixel Dog',
        description: 'An old-school retro puppy companion.',
        price: 120,
        type: 'PET',
        imageUrl: '/pets/dog.png'
      }
    ]
  });

  // 5. Create Quests
  console.log('📜 Creating gamification quests...');
  await prisma.quest.createMany({
    data: [
      {
        title: 'Morning Mentalist',
        description: 'Attempt your first math quiz of the day.',
        type: 'DAILY',
        xpReward: 50,
        coinReward: 20,
        targetCount: 1,
        actionType: 'ATTEMPT_QUIZ'
      },
      {
        title: 'Weekly Warrior',
        description: 'Complete 5 homework assignments with score > 80%.',
        type: 'WEEKLY',
        xpReward: 300,
        coinReward: 150,
        targetCount: 5,
        actionType: 'COMPLETE_LESSON'
      },
      {
        title: 'Ultimate Champion',
        description: 'Earn 1000 total XP in the current season.',
        type: 'SEASONAL',
        xpReward: 1000,
        coinReward: 500,
        targetCount: 1000,
        actionType: 'GAIN_XP'
      }
    ]
  });

  // 6. Create Achievements
  console.log('🏆 Creating achievement badges...');
  await prisma.achievement.createMany({
    data: [
      {
        title: 'Quick Thinker',
        description: 'Answered a quiz question in under 2 seconds.',
        badgeUrl: '/badges/quick.png',
        xpReward: 100,
        coinReward: 50
      },
      {
        title: 'Streak Starter',
        description: 'Achieved a 3-day learning streak.',
        badgeUrl: '/badges/streak3.png',
        xpReward: 150,
        coinReward: 75
      },
      {
        title: 'Perfect Score',
        description: 'Earned 100% on any quiz.',
        badgeUrl: '/badges/perfect.png',
        xpReward: 200,
        coinReward: 100
      }
    ]
  });

  // 7. Create Marketplace Items
  console.log('🏪 Seeding marketplace listings...');
  await prisma.marketplaceListing.createMany({
    data: [
      {
        title: 'Minecraft Learning Theme',
        description: 'A blocky, pixelated green-and-brown theme for kids.',
        type: 'THEME',
        price: 0, // Free
        downloads: 2420,
        rating: 4.8
      },
      {
        title: 'Math Whiz AI Tutor Agent',
        description: 'An AI study assistant specialized in secondary school algebra tutoring.',
        type: 'AI_AGENT',
        price: 15, // $15 premium agent
        downloads: 312,
        rating: 4.9
      },
      {
        title: 'SAT Grammar Mastery Course Package',
        description: 'Includes 10 modules, interactive slides, and 100+ review questions.',
        type: 'COURSE',
        price: 25,
        downloads: 98,
        rating: 4.7
      }
    ]
  });

  // 8. Create a default Classroom
  console.log('🏫 Creating a default Classroom...');
  if (teacherUser.teacherProfile && studentUser.studentProfile) {
    const defaultClass = await prisma.class.create({
      data: {
        name: 'Grade 6 Science - Space & Planets',
        description: 'Exploring the solar system, galaxies, and the physics of space.',
        code: 'SPACE6',
        teacherId: teacherUser.teacherProfile.id,
        enrollments: {
          create: {
            studentId: studentUser.studentProfile.id
          }
        },
        courses: {
          create: {
            title: 'Journey Through the Cosmos',
            description: 'A comprehensive curriculum detailing planets, stars, and space flights.',
            teacherId: teacherUser.teacherProfile.id,
            published: true,
            modules: {
              create: [
                {
                  title: 'Module 1: The Inner Planets',
                  description: 'Mercury, Venus, Earth, and Mars.',
                  order: 1,
                  lessons: {
                    create: [
                      {
                        title: 'Lesson 1: The Red Planet (Mars)',
                        content: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System...',
                        order: 1
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    });

    console.log(`✅ Default Class created with JOIN CODE: ${defaultClass.code}`);
  }

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
