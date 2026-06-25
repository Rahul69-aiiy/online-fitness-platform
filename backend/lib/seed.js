import prisma from "../config/db.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("Cleaning up database...");
  await prisma.review.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.subscriptionPlan.deleteMany({});
  await prisma.trainerProfile.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash("Password123", 10);

  console.log("Seeding users & trainer profiles...");

  // Create Students
  const student1 = await prisma.user.create({
    data: {
      email: "student1@example.com",
      password: hashedPassword,
      name: "Student One",
      role: "STUDENT",
      avatar: "/user.jpg",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "student2@example.com",
      password: hashedPassword,
      name: "Student Two",
      role: "STUDENT",
      avatar: "/user.jpg",
    },
  });

  //  Create Trainer 1
  const trainerUser1 = await prisma.user.create({
    data: {
      email: "aarav.sharma@example.com",
      password: hashedPassword,
      name: "Aarav Sharma",
      role: "TRAINER",
      avatar: "/pic1.webp",
    },
  });

  const trainerProfile1 = await prisma.trainerProfile.create({
    data: {
      userId: trainerUser1.id,
      specialization: "Strength & Conditioning",
      experience: 8,
      bio: "Certified strength coach helping athletes and professionals reach their peak physical performance through science-based training.",
      primaryLocation: "Iron Gym, New York",
      certifications: ["NSCA-CSCS", "NASM-CPT"],
      categories: ["STRENGTH", "HIIT", "CROSSFIT"],
      rating: 4.9,
      studentCount: 120,
    },
  });

  // Create plans for Trainer 1
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        trainerId: trainerProfile1.id,
        name: "Monthly Strength",
        description: "Standard plan with 4 guided weekly strength video calls.",
        price: 49.00,
        durationDays: 30,
      },
      {
        trainerId: trainerProfile1.id,
        name: "Annual Beast Mode",
        description: "Full-year strength coaching plan with weekly check-ins.",
        price: 399.00,
        durationDays: 365,
      },
    ],
  });

  // Create Trainer 2
  const trainerUser2 = await prisma.user.create({
    data: {
      email: "priya.patel@example.com",
      password: hashedPassword,
      name: "Priya Patel",
      role: "TRAINER",
      avatar: "/pic2.jpg",
    },
  });

  const trainerProfile2 = await prisma.trainerProfile.create({
    data: {
      userId: trainerUser2.id,
      specialization: "Yoga & Mindfulness",
      experience: 10,
      bio: "Passionate yoga instructor focused on flow, breathwork, and mental clarity. Let's find your inner peace together.",
      primaryLocation: "Zen Studio, San Francisco",
      certifications: ["RYT-500", "Yoga Alliance Certified"],
      categories: ["YOGA", "MEDITATION", "PILATES"],
      rating: 5.0,
      studentCount: 250,
    },
  });

  await prisma.subscriptionPlan.createMany({
    data: [
      {
        trainerId: trainerProfile2.id,
        name: "Monthly Vinyasa Pack",
        description: "Full access to live daily morning yoga classes.",
        price: 39.00,
        durationDays: 30,
      },
    ],
  });

  // Create Trainer 3
  const trainerUser3 = await prisma.user.create({
    data: {
      email: "vikram.malhotra@example.com",
      password: hashedPassword,
      name: "Vikram Malhotra",
      role: "TRAINER",
      avatar: "/pic3.webp",
    },
  });

  const trainerProfile3 = await prisma.trainerProfile.create({
    data: {
      userId: trainerUser3.id,
      specialization: "HIIT & Weight Loss",
      experience: 6,
      bio: "High-intensity training expert specializing in fat loss and athletic agility. Get ready to push your limits.",
      primaryLocation: "Speed Box, Chicago",
      certifications: ["ACE-CPT", "Precision Nutrition Level 1"],
      categories: ["HIIT", "CARDIO", "BOXING"],
      rating: 4.8,
      studentCount: 85,
    },
  });

  await prisma.subscriptionPlan.createMany({
    data: [
      {
        trainerId: trainerProfile3.id,
        name: "Monthly Cardio Shred",
        description: "Unlimited high intensity cardio intervals coaching.",
        price: 59.00,
        durationDays: 30,
      },
    ],
  });

  // Create Reviews
  console.log("Seeding reviews...");
  await prisma.review.create({
    data: {
      userId: student1.id,
      trainerId: trainerProfile1.id,
      rating: 5,
      comment: "Aarav is an amazing strength trainer! My squat form has improved drastically under his coaching.",
    },
  });

  await prisma.review.create({
    data: {
      userId: student2.id,
      trainerId: trainerProfile1.id,
      rating: 4,
      comment: "Highly functional training sessions. The annual plan is well worth the money.",
    },
  });

  await prisma.review.create({
    data: {
      userId: student1.id,
      trainerId: trainerProfile2.id,
      rating: 5,
      comment: "Priya brings so much peace and energy to her yoga sessions. Highly recommended!",
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });