require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Car = require("./models/Car");

const seedCars = [
  {
    name: "Revuelto",
    slug: "revuelto",
    category: "Super Sports",
    power: "1015 CV",
    engine: "V12 Hybrid",
    topSpeed: "> 350 km/h",
    zeroToHundred: "2.5 s",
    weight: "1,772 kg",
    transmission: "8-speed Dual-clutch",
    drivetrain: "AWD",
    image:
      "https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1920&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1920&q=80",
      "https://images.unsplash.com/photo-1526297293668-36b3f33a373b?auto=format&fit=crop&w=1920&q=80",
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
      { name: "Giallo Countach", hex: "#F9E000" },
      { name: "Rosso Efesto", hex: "#C41E3A" },
      { name: "Nero Aldebaran", hex: "#0A0A0A" },
      { name: "Blu Caelum", hex: "#003366" },
      { name: "Verde Mantis", hex: "#228B22" },
      { name: "Arancio Xanto", hex: "#FF4500" },
    ],
    isActive: true,
  },
  {
    name: "Urus SE",
    slug: "urus-se",
    category: "Super SUV",
    power: "800 CV",
    engine: "V8 Twin-Turbo Hybrid",
    topSpeed: "312 km/h",
    zeroToHundred: "3.4 s",
    weight: "2,150 kg",
    transmission: "8-speed Automatic",
    drivetrain: "AWD",
    image:
      "https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=1920&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=1920&q=80",
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
      { name: "Nero Noctis", hex: "#000000" },
      { name: "Grigio Keres", hex: "#696969" },
      { name: "Verde Selvans", hex: "#006B3C" },
      { name: "Giallo Auge", hex: "#FFCC00" },
      { name: "Blu Eleos", hex: "#1D2951" },
      { name: "Bianco Monocerus", hex: "#FFFFFF" },
    ],
    isActive: true,
  },
  {
    name: "Temerario",
    slug: "temerario",
    category: "Super Sports",
    power: "920 CV",
    engine: "V8 Hybrid",
    topSpeed: "343 km/h",
    zeroToHundred: "2.7 s",
    weight: "1,690 kg",
    transmission: "8-speed Dual-clutch",
    drivetrain: "AWD",
    image:
      "https://images.unsplash.com/photo-1776690061399-d2e7f7e88751?auto=format&fit=crop&w=1920&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1776690061399-d2e7f7e88751?auto=format&fit=crop&w=1920&q=80",
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
      { name: "Arancio Borealis", hex: "#FF6600" },
      { name: "Verde Mantis", hex: "#228B22" },
      { name: "Grigio Titans", hex: "#808080" },
      { name: "Giallo Evros", hex: "#FFD700" },
      { name: "Rosso Mars", hex: "#C40234" },
      { name: "Nero Nemesis", hex: "#0C0C0C" },
    ],
    isActive: true,
  },
];

async function seedData() {
  try {
    await connectDB();

    console.log("Clearing existing car data...");
    await Car.deleteMany({});

    console.log("Seeding car data...");
    const createdCars = await Car.insertMany(seedCars);

    console.log(`Successfully seeded ${createdCars.length} cars:`);
    createdCars.forEach((car) => {
      console.log(`  - ${car.name} (${car.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seedData();
