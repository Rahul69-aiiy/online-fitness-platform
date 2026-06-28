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

  const trainerTemplates = [
    { name: "Aarav Sharma", spec: "Strength & Conditioning", bio: "Certified strength coach helping athletes and professionals reach their peak physical performance.", location: "Iron Gym, Delhi", certs: ["NSCA-CSCS", "NASM-CPT"], cats: ["STRENGTH", "HIIT"], rating: 4.9, avatar: "/src/assets/pic1.webp" },
    { name: "Priya Patel", spec: "Yoga & Mindfulness", bio: "Passionate yoga instructor focused on flow, breathwork, and mental clarity.", location: "Zen Studio, Mumbai", certs: ["RYT-500", "Yoga Alliance"], cats: ["YOGA", "MEDITATION"], rating: 5.0, avatar: "/src/assets/pic2.jpg" },
    { name: "Vikram Malhotra", spec: "HIIT & Weight Loss", bio: "High-intensity training expert specializing in fat loss and athletic agility.", location: "Speed Box, Bangalore", certs: ["ACE-CPT", "Precision Nutrition"], cats: ["HIIT", "CARDIO"], rating: 4.8, avatar: "/src/assets/pic3.webp" },
    { name: "Ananya Iyer", spec: "Pilates & Core", bio: "Sculpt and strengthen your body with low-impact, high-intensity pilates flows.", location: "Core Centric, Pune", certs: ["PMA-CPT"], cats: ["PILATES", "YOGA"], rating: 4.7, avatar: "/src/assets/pic2.jpg" },
    { name: "Rohan Das", spec: "Calisthenics & Bodyweight", bio: "Master bodyweight control. Specializing in handstands, muscle-ups, and core strength.", location: "Bar Warriors, Kolkata", certs: ["WCO Calisthenics Coach"], cats: ["CROSSFIT", "STRENGTH"], rating: 4.9, avatar: "/src/assets/pic1.webp" },
    { name: "Sarah Connor", spec: "Combat & Boxing", bio: "Former pro boxer teaching athletic combat conditioning and hand-eye coordination.", location: "Fight Club, Mumbai", certs: ["USA Boxing Coach"], cats: ["BOXING", "CARDIO"], rating: 4.6, avatar: "/src/assets/pic3.webp" },
    { name: "Kabir Mehta", spec: "CrossFit & Olympic Lifting", bio: "Push past your boundaries with intense functional fitness and lifting sessions.", location: "CrossFit Colaba, Mumbai", certs: ["CrossFit Level 2"], cats: ["CROSSFIT", "STRENGTH"], rating: 4.8, avatar: "/src/assets/pic1.webp" },
    { name: "Meera Nair", spec: "Dance Fitness & Zumba", bio: "Fun, high-energy dance sessions that burn calories and boost your mood.", location: "Groove & Burn, Bangalore", certs: ["Zumba Certified"], cats: ["CARDIO"], rating: 4.9, avatar: "/src/assets/pic2.jpg" },
    { name: "Arjun Reddy", spec: "Athletic Conditioning", bio: "High performance coaching for speed, endurance, and power generation.", location: "Apex Sports, Hyderabad", certs: ["CSCS", "EXOS Phase 1"], cats: ["STRENGTH", "HIIT"], rating: 4.7, avatar: "/src/assets/pic1.webp" },
    { name: "Neha Gupta", spec: "Pre/Postnatal Fitness", bio: "Specialized fitness guidance for new and expecting mothers to stay strong and healthy.", location: "Mama Fit, Gurgaon", certs: ["NASM Women's Fitness Specialist"], cats: ["YOGA", "PILATES"], rating: 4.9, avatar: "/src/assets/pic2.jpg" },
  ];

  // Seed 25 trainers 
  for (let i = 1; i <= 25; i++) {
    const template = trainerTemplates[(i - 1) % trainerTemplates.length];
    const suffix = i > trainerTemplates.length ? ` (${Math.floor((i - 1) / trainerTemplates.length) + 1})` : "";
    const email = `trainer${i}@example.com`;
    const name = `${template.name}${suffix}`;
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "TRAINER",
        avatar: template.avatar,
      },
    });

    const trainerProfile = await prisma.trainerProfile.create({
      data: {
        userId: user.id,
        specialization: template.spec,
        experience: 5 + (i % 8),
        bio: `${template.bio} Designed to match your unique fitness level and targets.`,
        primaryLocation: template.location,
        certifications: template.certs,
        categories: template.cats,
        rating: parseFloat((4.2 + (i % 9) * 0.1).toFixed(1)),
        studentCount: 10 * i + 15,
      },
    });

    // Create a couple of plans for each trainer
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          trainerId: trainerProfile.id,
          name: "Standard Coaching Pack",
          description: "Monthly plan including weekly video calls and dynamic workout scheduling.",
          price: 29.00 + (i % 5) * 10,
          durationDays: 30,
        },
        {
          trainerId: trainerProfile.id,
          name: "Premium Elite Support",
          description: "Complete full-year fitness planning, diet charts, and priority support.",
          price: 249.00 + (i % 5) * 50,
          durationDays: 365,
        },
      ],
    });

    // Seed a couple of reviews for first 10 trainers
    if (i <= 10) {
      await prisma.review.create({
        data: {
          userId: student1.id,
          trainerId: trainerProfile.id,
          rating: i % 2 === 0 ? 5 : 4,
          comment: `Great training sessions with ${name}! Always on time and extremely motivating.`,
        },
      });
      await prisma.review.create({
        data: {
          userId: student2.id,
          trainerId: trainerProfile.id,
          rating: 5,
          comment: "I have seen massive improvements in my overall physical conditioning. Recommended!",
        },
      });
    }
  }

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