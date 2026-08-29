require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Car = require("./models/Car");
const User = require("./models/User");

const seedCars = [
  {
    name: "Revuelto",
    slug: "revuelto",
    category: "Super Sports",
    power: "1015 CV",
    engine: "V12 Hybrid",
    topSpeed: "> 350 km/h",
    zeroToHundred: "2.5 s",
    zeroToSixty: "2.3 s",
    weight: "1,772 kg",
    transmission: "8-speed Dual-clutch",
    drivetrain: "AWD",
    image:
      "https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1920&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1526297293668-36b3f33a373b?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1920&q=80",
    ],
    blurb:
      "The first V12 hybrid super sports car — three electric motors and a naturally-aspirated heart working as one.",
    description:
      "The Lamborghini Revuelto is a masterpiece of engineering, combining the legendary naturally aspirated V12 engine with three electric motors to deliver a combined output of 1015 horsepower. This High Performance Electrified Vehicle (HPEV) represents a new era for Lamborghini, delivering thrilling performance while embracing hybrid technology. The iconic V12 soundtrack is preserved, amplified, and complemented by instantaneous electric torque for an unmatched driving experience.",
    startingPrice: 608358,
    features: [
      "Naturally Aspirated V12 Engine",
      "Three Electric Motors (Tri-Motor HPEV)",
      "1015 CV Combined Output",
      "Carbon Fiber Monocoque Chassis",
      "Active Aerodynamics & Rear Wing",
      "ADAS Advanced Driver Assistance",
      "Torque Vectoring All-Wheel Drive",
      "3.8 kWh Lithium-Ion Battery Pack",
    ],
    availableColors: [
      { name: "Giallo Countach", hex: "#F9E000", price: 0 },
      { name: "Rosso Efesto", hex: "#C41E3A", price: 8800 },
      { name: "Nero Aldebaran", hex: "#0A0A0A", price: 0 },
      { name: "Blu Caelum", hex: "#003366", price: 12500 },
      { name: "Verde Mantis", hex: "#228B22", price: 10200 },
      { name: "Arancio Xanto", hex: "#FF4500", price: 9600 },
    ],
    rating: 5.0,
    numReviews: 8,
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Urus SE",
    slug: "urus-se",
    category: "Super SUV",
    power: "800 CV",
    engine: "V8 Twin-Turbo Hybrid",
    topSpeed: "312 km/h",
    zeroToHundred: "3.4 s",
    zeroToSixty: "3.1 s",
    weight: "2,150 kg",
    transmission: "8-speed Automatic",
    drivetrain: "AWD",
    image:
      "https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=1920&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    ],
    blurb:
      "The world's first Super SUV, now plug-in hybrid — everyday usability with a super sports car soul.",
    description:
      "The Lamborghini Urus SE is the most powerful version of the world's first Super SUV. Combining a 4.0L V8 twin-turbo engine with a plug-in hybrid system, it delivers 800 horsepower while offering up to 60 km of pure electric range. The Urus SE retains all the versatility of an SUV — seating for five, generous luggage space, and off-road capability — while delivering super sports car performance that redefines what an SUV can be.",
    startingPrice: 280000,
    features: [
      "4.0L V8 Twin-Turbo + Plug-in Hybrid",
      "800 CV Combined Power",
      "60 km Pure Electric Range",
      "Adaptive Air Suspension",
      "Rear-Wheel Steering System",
      "Carbon Ceramic Braking System",
      "5-Seat Luxury Leather Interior",
      "6 Off-Road & Track Driving Modes (ANIMA)",
    ],
    availableColors: [
      { name: "Nero Noctis", hex: "#000000", price: 0 },
      { name: "Grigio Keres", hex: "#696969", price: 4200 },
      { name: "Verde Selvans", hex: "#006B3C", price: 8500 },
      { name: "Giallo Auge", hex: "#FFCC00", price: 0 },
      { name: "Blu Eleos", hex: "#1D2951", price: 7800 },
      { name: "Bianco Monocerus", hex: "#FFFFFF", price: 0 },
    ],
    rating: 4.9,
    numReviews: 12,
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Temerario",
    slug: "temerario",
    category: "Super Sports",
    power: "920 CV",
    engine: "V8 Hybrid Twin-Turbo",
    topSpeed: "343 km/h",
    zeroToHundred: "2.7 s",
    zeroToSixty: "2.5 s",
    weight: "1,690 kg",
    transmission: "8-speed Dual-clutch",
    drivetrain: "AWD",
    image:
      "https://images.unsplash.com/photo-1776690061399-d2e7f7e88751?auto=format&fit=crop&w=1920&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1776690061399-d2e7f7e88751?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1920&q=80",
    ],
    blurb:
      "A new twin-turbo V8 paired with three electric motors — the next chapter of the V8 Huracán line.",
    description:
      "The Lamborghini Temerario introduces a new era for the V8 super sports car. Featuring an all-new twin-turbocharged V8 engine capable of revving to 10,000 RPM, paired with three electric motors, the Temerario produces 920 horsepower. Designed for extreme track precision and open road exhilaration, this AWD masterpiece carries forward the racing DNA of Sant'Agata Bolognese.",
    startingPrice: 360000,
    features: [
      "Twin-Turbo V8 Revving to 10,000 RPM",
      "920 CV Combined HPEV Output",
      "Rear-Biased Electric AWD",
      "Active Aerodynamic Downforce",
      "Carbon Ceramic Brakes",
      "Magnetorheological Dampers",
      "Track Telemetry & Driving Dynamics",
      "Full Digital Cockpit Display",
    ],
    availableColors: [
      { name: "Arancio Borealis", hex: "#FF6600", price: 6500 },
      { name: "Verde Mantis", hex: "#228B22", price: 8200 },
      { name: "Grigio Titans", hex: "#808080", price: 0 },
      { name: "Giallo Evros", hex: "#FFD700", price: 0 },
      { name: "Rosso Mars", hex: "#C40234", price: 7400 },
      { name: "Nero Nemesis", hex: "#0C0C0C", price: 9500 },
    ],
    rating: 5.0,
    numReviews: 6,
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Sián FKP 37",
    slug: "sian-fkp-37",
    category: "Limited Edition",
    power: "819 CV",
    engine: "V12 Supercapacitor Hybrid",
    topSpeed: "355 km/h",
    zeroToHundred: "2.8 s",
    zeroToSixty: "2.6 s",
    weight: "1,620 kg",
    transmission: "7-speed ISR",
    drivetrain: "AWD",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1920&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1920&q=80",
    ],
    blurb:
      "The first super sports car powered by a V12 engine and hybrid technology based on supercapacitors.",
    description:
      "Sián, meaning 'flash of lightning' in Bolognese dialect, is the first hybrid production Lamborghini. Utilizing an innovative supercapacitor system three times more powerful than a battery of the same weight, the Sián FKP 37 is limited to only 63 units worldwide.",
    startingPrice: 3200000,
    features: [
      "Naturally Aspirated V12 Engine",
      "World-First Supercapacitor Hybrid Tech",
      "819 CV Total System Power",
      "Limited Production of 63 Units",
      "Full Carbon Fiber Monocoque & Body",
      "Autonomous Active Cooling Vanes",
    ],
    availableColors: [
      { name: "Verde Gea", hex: "#4A5D4E", price: 0 },
      { name: "Oro Electrum", hex: "#CFB53B", price: 15000 },
      { name: "Nero Aldebaran", hex: "#0A0A0A", price: 0 },
    ],
    rating: 5.0,
    numReviews: 4,
    isActive: true,
    isFeatured: true,
  },
];

async function seedData() {
  try {
    await connectDB();

    console.log("Seeding Cars...");
    await Car.deleteMany({});
    const createdCars = await Car.insertMany(seedCars);
    console.log(`✓ Seeded ${createdCars.length} cars successfully.`);

    console.log("Seeding Default Admin & Client Users...");
    await User.deleteMany({});
    
    const adminUser = await User.create({
      name: "Lamborghini Administrator",
      email: "admin@lamborghini.it",
      password: "Lamborghini2024!",
      role: "admin",
      phone: "+39 051 6817611",
      address: {
        street: "Via Modena 12",
        city: "Sant'Agata Bolognese",
        country: "Italy",
        postalCode: "40019",
      },
    });

    const clientUser = await User.create({
      name: "Marco Rossi",
      email: "client@lamborghini.it",
      password: "Lamborghini2024!",
      role: "user",
      phone: "+39 02 8901 2345",
      address: {
        street: "Via Montenapoleone 8",
        city: "Milano",
        country: "Italy",
        postalCode: "20121",
      },
    });

    console.log(`✓ Admin User created: ${adminUser.email} / Lamborghini2024!`);
    console.log(`✓ Client User created: ${clientUser.email} / Lamborghini2024!`);

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seedData();
