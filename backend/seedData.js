require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Car = require("./models/Car");
const User = require("./models/User");

const seedUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "adminpassword123",
    role: "admin",
    phone: "+1 (555) 019-2834",
  },
  {
    name: "Alex Whitfield",
    email: "alex@example.com",
    password: "password123",
    role: "buyer",
    phone: "+1 (555) 234-5678",
  },
  {
    name: "Priya Nair",
    email: "priya@example.com",
    password: "password123",
    role: "buyer",
    phone: "+1 (555) 876-5432",
  },
];

const seedCars = [
  {
    name: "Revuelto",
    slug: "revuelto",
    category: "Super Sports",
    year: 2026,
    power: "1015 CV",
    engine: "V12 Hybrid",
    topSpeed: "> 350 km/h",
    zeroToHundred: "2.5 s",
    weight: "1,772 kg",
    transmission: "8-speed Dual-clutch",
    drivetrain: "AWD",
    image: "/uploads/revuelto.jpg",
    gallery: [
      "/uploads/revuelto.jpg",
      "/uploads/revuelto-gallery-1.jpg",
    ],
    blurb:
      "The first V12 hybrid super sports car — three electric motors and a naturally-aspirated heart working as one.",
    description:
      "The Lamborghini Revuelto is a masterpiece of engineering, combining the legendary naturally aspirated V12 engine with three electric motors to deliver a combined output of 1015 horsepower. This High Performance Electrified Vehicle (HPEV) represents a new era for Lamborghini, delivering thrilling performance while embracing hybrid technology. The iconic V12 soundtrack is preserved, amplified, and complemented by instantaneous electric torque for an unmatched driving experience.",
    startingPrice: 608358,
    features: [
      "Naturally Aspirated V12 Engine",
      "Three Electric Motors",
      "1015 CV Combined Power",
      "Carbon Fiber Monocoque",
      "Active Aerodynamics",
      "ADAS Advanced Driver Assistance",
      "All-Wheel Drive",
      "Plug-in Hybrid System",
    ],
    availableColors: [
      { name: "Giallo Countach", hex: "#F9E000", price: 0 },
      { name: "Rosso Efesto", hex: "#C41E3A", price: 8800 },
      { name: "Nero Aldebaran", hex: "#0A0A0A", price: 0 },
      { name: "Blu Caelum", hex: "#003366", price: 12500 },
      { name: "Verde Mantis", hex: "#228B22", price: 10200 },
      { name: "Arancio Xanto", hex: "#FF4500", price: 9600 },
    ],
    rating: 4.9,
    numReviews: 14,
    inStock: true,
    status: "Active",
    isActive: true,
  },
  {
    name: "Urus SE",
    slug: "urus-se",
    category: "Super SUV",
    year: 2026,
    power: "800 CV",
    engine: "V8 Twin-Turbo Hybrid",
    topSpeed: "312 km/h",
    zeroToHundred: "3.4 s",
    weight: "2,150 kg",
    transmission: "8-speed Automatic",
    drivetrain: "AWD",
    image: "/uploads/urus-se.jpg",
    gallery: [
      "/uploads/urus-se.jpg",
      "/uploads/urus-se-gallery-1.jpg",
    ],
    blurb:
      "The world's first Super SUV, now plug-in hybrid — everyday usability with a super sports car soul.",
    description:
      "The Lamborghini Urus SE is the most powerful version of the world's first Super SUV. Combining a 4.0L V8 twin-turbo engine with a plug-in hybrid system, it delivers 800 horsepower while offering up to 60 km of pure electric range. The Urus SE retains all the versatility of an SUV — seating for five, generous luggage space, and off-road capability — while delivering super sports car performance that redefines what an SUV can be.",
    startingPrice: 280000,
    features: [
      "4.0L V8 Twin-Turbo + PHEV",
      "800 CV Combined Power",
      "60 km Electric Range",
      "Active Air Suspension",
      "Rear-Wheel Steering",
      "Carbon Ceramic Brakes",
      "5-Seat Luxury Interior",
      "Off-Road Driving Modes",
    ],
    availableColors: [
      { name: "Nero Noctis", hex: "#000000", price: 0 },
      { name: "Grigio Keres", hex: "#696969", price: 4200 },
      { name: "Verde Selvans", hex: "#006B3C", price: 9500 },
      { name: "Giallo Auge", hex: "#FFCC00", price: 0 },
      { name: "Blu Eleos", hex: "#1D2951", price: 6800 },
      { name: "Bianco Monocerus", hex: "#FFFFFF", price: 0 },
    ],
    rating: 4.8,
    numReviews: 22,
    inStock: true,
    status: "Active",
    isActive: true,
  },
  {
    name: "Temerario",
    slug: "temerario",
    category: "Super Sports",
    year: 2026,
    power: "920 CV",
    engine: "V8 Hybrid",
    topSpeed: "343 km/h",
    zeroToHundred: "2.7 s",
    weight: "1,690 kg",
    transmission: "8-speed Dual-clutch",
    drivetrain: "AWD",
    image: "/uploads/temerario.jpg",
    gallery: [
      "/uploads/temerario.jpg",
      "/uploads/temerario-gallery-1.jpg",
    ],
    blurb:
      "A new twin-turbo V8 paired with three electric motors — the next chapter of the V8 Huracán line.",
    description:
      "The Lamborghini Temerario introduces a new era for the V8 super sports car. Featuring an all-new twin-turbocharged V8 engine paired with three electric motors, the Temerario produces 920 horsepower and features a plug-in hybrid system capable of pure electric driving. Designed for both track and road, this rear-biased all-wheel drive masterpiece carries forward the DNA of the Huracán line while propelling it into the hybrid future.",
    startingPrice: 360000,
    features: [
      "Twin-Turbo V8 + Tri-Motor PHEV",
      "920 CV Combined Output",
      "Rear-Biased AWD",
      "Active Aerodynamics",
      "Carbon Ceramic Brakes",
      "Magnetorheological Suspension",
      "Rear-Wheel Steering",
      "Track Performance Mode",
    ],
    availableColors: [
      { name: "Arancio Borealis", hex: "#FF6600", price: 8200 },
      { name: "Verde Mantis", hex: "#228B22", price: 10200 },
      { name: "Grigio Titans", hex: "#808080", price: 5400 },
      { name: "Giallo Evros", hex: "#FFD700", price: 0 },
      { name: "Rosso Mars", hex: "#C40234", price: 7600 },
      { name: "Nero Nemesis", hex: "#0C0C0C", price: 6200 },
    ],
    rating: 5.0,
    numReviews: 9,
    inStock: true,
    status: "Active",
    isActive: true,
  },
  {
    name: "Huracán Tecnica",
    slug: "huracan-tecnica",
    category: "Super Sports",
    year: 2025,
    power: "640 CV",
    engine: "5.2L V10 Naturally Aspirated",
    topSpeed: "325 km/h",
    zeroToHundred: "3.2 s",
    weight: "1,379 kg",
    transmission: "7-speed LDF Dual-clutch",
    drivetrain: "RWD",
    image: "/uploads/huracan-tecnica.jpg",
    gallery: [
      "/uploads/huracan-tecnica.jpg",
    ],
    blurb:
      "Pure naturally-aspirated V10 rear-wheel drive emotion, developed for both track precision and road pleasure.",
    description:
      "The Huracán Tecnica is designed as a bridge between the track-focused STO and the road-going EVO. Powered by the same 640 CV naturally aspirated V10 from the STO, the Tecnica directs all power to the rear wheels with specialized rear-wheel steering and LDVI (Lamborghini Dinamica Veicolo Integrata) calibrated for peak fun and driver involvement.",
    startingPrice: 239000,
    features: [
      "Naturally Aspirated 5.2L V10",
      "Rear-Wheel Drive & Steering",
      "Carbon Ceramic Brakes",
      "Fixed Rear Wing",
      "Lightweight Door Panels",
      "Aerodynamic Brake Cooling Ducts",
    ],
    availableColors: [
      { name: "Verde Selvans", hex: "#006B3C", price: 9500 },
      { name: "Bianco Monocerus", hex: "#FFFFFF", price: 0 },
      { name: "Nero Noctis", hex: "#000000", price: 0 },
      { name: "Arancio Xanto", hex: "#FF4500", price: 8500 },
    ],
    rating: 4.9,
    numReviews: 18,
    inStock: true,
    status: "Active",
    isActive: true,
  },
  {
    name: "Sián FKP 37",
    slug: "sian-fkp-37",
    category: "Limited Edition",
    year: 2024,
    power: "819 CV",
    engine: "V12 + Supercapacitor Hybrid",
    topSpeed: "> 355 km/h",
    zeroToHundred: "2.8 s",
    weight: "1,620 kg",
    transmission: "7-speed ISR",
    drivetrain: "AWD",
    image: "/uploads/sian-fkp37.jpg",
    gallery: [
      "/uploads/sian-fkp37.jpg",
    ],
    blurb:
      "A limited-series hybrid masterpiece utilizing revolutionary supercapacitor technology.",
    description:
      "The Sián FKP 37 is the first super sports car powered by a V12 engine and hybrid technology based on supercapacitors. Its powerful V12 engine, coupled with electric boost, creates an unrivaled gem of engineering and technology. Only 63 units were produced worldwide.",
    startingPrice: 3300000,
    features: [
      "V12 + Supercapacitor Hybrid",
      "819 CV Combined Output",
      "Carbon Fiber Monocoque & Bodywork",
      "Autonomous Vane Cooling",
      "Exclusive Terzo Millennio Design Language",
      "Ultra-Limited Production (63 units)",
    ],
    availableColors: [
      { name: "Verde Gea", hex: "#4B5320", price: 0 },
      { name: "Oro Electrum", hex: "#D4AF37", price: 25000 },
      { name: "Nero Aldebaran", hex: "#0A0A0A", price: 0 },
    ],
    rating: 5.0,
    numReviews: 6,
    inStock: true,
    status: "Active",
    isActive: true,
  },
  {
    name: "Countach LPI 800-4",
    slug: "countach-lpi-800-4",
    category: "Limited Edition",
    year: 2024,
    power: "814 CV",
    engine: "V12 + 48V Supercapacitor",
    topSpeed: "355 km/h",
    zeroToHundred: "2.8 s",
    weight: "1,595 kg",
    transmission: "7-speed ISR",
    drivetrain: "AWD",
    image: "/uploads/countach-lpi800.jpg",
    gallery: [
      "/uploads/countach-lpi800.jpg",
    ],
    blurb:
      "A tribute to the iconic Countach, reimagined with modern V12 hybrid performance.",
    description:
      "The Countach LPI 800-4 pays homage to the legendary silhouette that shaped supercar design for generations. Featuring a 6.5-liter V12 combined with a 48V electric motor powered by supercapacitor technology, it delivers 814 horsepower through permanent all-wheel drive.",
    startingPrice: 2640000,
    features: [
      "Periscopio Roof Line",
      "Naturally Aspirated V12 + 48V Supercapacitor",
      "Carbon Fiber Chassis & Panels",
      "Iconic Phone-Dial Wheels",
      "Limited Run of 112 Units Worldwide",
    ],
    availableColors: [
      { name: "Bianco Siderale", hex: "#F5F5F5", price: 0 },
      { name: "Impact White", hex: "#FFFFFF", price: 0 },
      { name: "Giallo Countach", hex: "#F9E000", price: 15000 },
    ],
    rating: 5.0,
    numReviews: 4,
    inStock: true,
    status: "Active",
    isActive: true,
  },
];

async function seedData() {
  try {
    await connectDB();

    console.log("Clearing existing User & Car data...");
    await User.deleteMany({});
    await Car.deleteMany({});

    console.log("Seeding Users...");
    for (const userData of seedUsers) {
      await User.create(userData);
    }
    console.log(`Successfully seeded ${seedUsers.length} users (Admin & Buyers).`);

    console.log("Seeding Cars...");
    const createdCars = await Car.insertMany(seedCars);
    console.log(`Successfully seeded ${createdCars.length} cars:`);
    createdCars.forEach((car) => {
      console.log(`  - [${car.category}] ${car.name} (${car.slug}) -> ${car.image}`);
    });

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedData();
}

module.exports = { seedUsers, seedCars };
