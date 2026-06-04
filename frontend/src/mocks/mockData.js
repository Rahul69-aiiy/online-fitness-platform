export const TRAINERS = [
  {
    id: "1",
    name: "Alex Rivers",
    specialization: "Strength & Conditioning",
    experience: "8 years",
    rating: 4.9,
    studentCount: 120,
    monthlyPrice: 49,
    primaryLocation: "Iron Gym, New York",
    photo: "https://images.unsplash.com/photo-1567013127542-490d757e51fe?w=400&h=400&fit=crop",
    bio: "Certified strength coach helping athletes and professionals reach their peak physical performance through science-based training.",
    certifications: ["NSCA-CSCS", "NASM-CPT"],
    locations: [
      { gymName: "Iron Gym", address: "123 Muscle Ave", city: "New York", availability: "Mon-Fri, 6am-2pm" }
    ],
    categories: ["Strength", "Bodybuilding"]
  },
  {
    id: "2",
    name: "Sarah Chen",
    specialization: "Yoga & Mindfulness",
    experience: "10 years",
    rating: 5.0,
    studentCount: 250,
    monthlyPrice: 39,
    primaryLocation: "Zen Studio, San Francisco",
    photo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    bio: "Passionate yoga instructor focused on flow, breathwork, and mental clarity. Let's find your inner peace together.",
    certifications: ["RYT-500", "Yoga Alliance Certified"],
    locations: [
      { gymName: "Zen Studio", address: "456 Peace St", city: "San Francisco", availability: "Tue-Sat, 8am-6pm" }
    ],
    categories: ["Yoga", "Meditation"]
  },
  {
    id: "3",
    name: "Marcus Thorne",
    specialization: "HIIT & Weight Loss",
    experience: "6 years",
    rating: 4.8,
    studentCount: 85,
    monthlyPrice: 59,
    primaryLocation: "Speed Box, Chicago",
    photo: "https://images.unsplash.com/photo-1583454110551-21f2fa29617c?w=400&h=400&fit=crop",
    bio: "High-intensity training expert specializing in fat loss and athletic agility. Get ready to push your limits.",
    certifications: ["ACE-CPT", "Precision Nutrition Level 1"],
    locations: [
      { gymName: "Speed Box", address: "789 Rapid Way", city: "Chicago", availability: "Mon-Sat, 5am-10am, 4pm-8pm" }
    ],
    categories: ["HIIT", "Weight Loss"]
  }
];

export const SESSIONS = [
  {
    id: "s1",
    trainerId: "1",
    title: "Morning Power Lift",
    description: "A high-intensity compound movement session focusing on squats, deadlifts, and bench press.",
    date: "2026-06-05",
    time: "07:00 AM",
    duration: "60 min",
    capacity: 5,
    bookedCount: 3,
    price: 25,
    type: "In Person",
    location: "Iron Gym, New York",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop"
  },
  {
    id: "s2",
    trainerId: "2",
    title: "Sunset Vinyasa Flow",
    description: "A calming yet challenging yoga flow to end your day with balance and strength.",
    date: "2026-06-05",
    time: "06:00 PM",
    duration: "75 min",
    capacity: 20,
    bookedCount: 12,
    price: 15,
    type: "Online",
    location: "Zoom",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop"
  }
];

export const REVIEWS = [
  {
    id: "r1",
    trainerId: "1",
    userName: "John Doe",
    rating: 5,
    comment: "Alex is an amazing coach! My deadlift went up by 50lbs in 3 months.",
    date: "2026-05-20"
  },
  {
    id: "r2",
    trainerId: "2",
    userName: "Emily Smith",
    rating: 5,
    comment: "The most relaxing and professional yoga sessions I've ever had.",
    date: "2026-05-25"
  }
];
