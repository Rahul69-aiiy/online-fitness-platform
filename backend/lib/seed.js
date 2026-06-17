import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create trainer user
  const trainerUser = await prisma.user.create({
    data: {
      firebaseUid: 'trainer-firebase-uid',
      email: 'trainer@example.com',
      name: 'Rahul Trainer',
      role: 'TRAINER',
    },
  })

  // Create trainer profile
  const trainerProfile = await prisma.trainerProfile.create({
    data: {
      userId: trainerUser.id,
      specialization: 'Strength Training',
      experience: '5 Years',
      bio: 'Certified fitness trainer helping clients build strength.',
      primaryLocation: 'Gurgaon',
      certifications: ['ACE', 'NASM'],
      categories: ['Strength', 'Weight Loss'],
    },
  })

  // Create subscription plans
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        trainerId: trainerProfile.id,
        name: 'Monthly',
        description: 'Monthly coaching plan',
        price: 1999,
        durationDays: 30,
      },
      {
        trainerId: trainerProfile.id,
        name: 'Quarterly',
        description: 'Quarterly coaching plan',
        price: 4999,
        durationDays: 90,
      },
    ],
  })

  // Create student
  const student = await prisma.user.create({
    data: {
      firebaseUid: 'student-firebase-uid',
      email: 'student@example.com',
      name: 'Rahul Student',
      role: 'STUDENT',
    },
  })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })