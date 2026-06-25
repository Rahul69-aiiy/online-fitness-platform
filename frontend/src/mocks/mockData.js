import pic1 from "@/assets/pic1.webp";
import pic2 from "@/assets/pic2.jpg";
import pic3 from "@/assets/pic3.webp";

export const TRAINERS = [
  {
    id: "1",
    name: "Aarav Sharma",
    specialization: "Strength & Conditioning",
    experience: "8 years",
    rating: 4.9,
    studentCount: 120,
    monthlyPrice: 49,
    primaryLocation: "Iron Gym, New York",
    photo: pic1,
    bio: "Certified strength coach helping athletes and professionals reach their peak physical performance through science-based training.",
    certifications: ["NSCA-CSCS", "NASM-CPT"],
    locations: [
      { gymName: "Iron Gym", address: "123 Muscle Ave", city: "New York", availability: "Mon-Fri, 6am-2pm" }
    ],
    categories: ["Strength", "Bodybuilding"]
  },
  {
    id: "2",
    name: "Priya Patel",
    specialization: "Yoga & Mindfulness",
    experience: "10 years",
    rating: 5.0,
    studentCount: 250,
    monthlyPrice: 39,
    primaryLocation: "Zen Studio, San Francisco",
    photo: pic2,
    bio: "Passionate yoga instructor focused on flow, breathwork, and mental clarity. Let's find your inner peace together.",
    certifications: ["RYT-500", "Yoga Alliance Certified"],
    locations: [
      { gymName: "Zen Studio", address: "456 Peace St", city: "San Francisco", availability: "Tue-Sat, 8am-6pm" }
    ],
    categories: ["Yoga", "Meditation"]
  },
  {
    id: "3",
    name: "Vikram Malhotra",
    specialization: "HIIT & Weight Loss",
    experience: "6 years",
    rating: 4.8,
    studentCount: 85,
    monthlyPrice: 59,
    primaryLocation: "Speed Box, Chicago",
    photo: pic3,
    bio: "High-intensity training expert specializing in fat loss and athletic agility. Get ready to push your limits.",
    certifications: ["ACE-CPT", "Precision Nutrition Level 1"],
    locations: [
      { gymName: "Speed Box", address: "789 Rapid Way", city: "Chicago", availability: "Mon-Sat, 5am-10am, 4pm-8pm" }
    ],
    categories: ["HIIT", "Weight Loss"]
  }
];

export const REVIEWS = [
  {
    id: "r1",
    trainerId: "1",
    userName: "Rohan Das",
    rating: 5,
    comment: "Aarav is an amazing coach! My deadlift went up by 50lbs in 3 months.",
    date: "2026-05-20"
  },
  {
    id: "r2",
    trainerId: "2",
    userName: "Anjali Gupta",
    rating: 5,
    comment: "The most relaxing and professional yoga sessions I've ever had.",
    date: "2026-05-25"
  }
];
