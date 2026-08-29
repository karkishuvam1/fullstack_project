const Car = require("../models/Car");

// @desc    Get all active cars with filtering, sorting, and search
// @route   GET /api/cars
// @access  Public
async function getCars(req, res) {
  try {
    const { category, search, minPrice, maxPrice, sort, includeInactive } = req.query;
    const filter = {};

    // By default only return active cars for buyers/public, unless requested by admin
    if (includeInactive !== "true") {
      filter.isActive = true;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { blurb: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.startingPrice = {};
      if (minPrice) filter.startingPrice.$gte = Number(minPrice);
      if (maxPrice) filter.startingPrice.$lte = Number(maxPrice);
    }

    let query = Car.find(filter);

    // Sorting
    if (sort === "price-asc") {
      query = query.sort({ startingPrice: 1 });
    } else if (sort === "price-desc") {
      query = query.sort({ startingPrice: -1 });
    } else if (sort === "rating") {
      query = query.sort({ rating: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const cars = await query.exec();
    res.status(200).json(cars);
  } catch (error) {
    console.error("GET CARS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch cars" });
  }
}

// @desc    Get single car by slug
// @route   GET /api/cars/:slug
// @access  Public
async function getCarBySlug(req, res) {
  try {
    const car = await Car.findOne({ slug: req.params.slug });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error("GET CAR BY SLUG ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch car" });
  }
}

// @desc    Get single car by ID
// @route   GET /api/cars/id/:id
// @access  Public
async function getCarById(req, res) {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error("GET CAR BY ID ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch car" });
  }
}

// @desc    Get featured cars
// @route   GET /api/cars/featured
// @access  Public
async function getFeaturedCars(req, res) {
  try {
    const cars = await Car.find({ isActive: true }).limit(3).sort({ createdAt: -1 });
    res.status(200).json(cars);
  } catch (error) {
    console.error("GET FEATURED CARS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch featured cars" });
  }
}

// @desc    Create a new car
// @route   POST /api/cars
// @access  Private/Admin
async function createCar(req, res) {
  try {
    const {
      name,
      slug,
      category,
      year,
      power,
      engine,
      topSpeed,
      zeroToHundred,
      weight,
      transmission,
      drivetrain,
      image,
      gallery,
      blurb,
      description,
      startingPrice,
      features,
      availableColors,
      inStock,
      status,
      isActive,
    } = req.body;

    if (
      !name ||
      !slug ||
      !category ||
      !power ||
      !engine ||
      !topSpeed ||
      !zeroToHundred ||
      !weight ||
      !image ||
      !blurb ||
      !description ||
      startingPrice === undefined
    ) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const existingCar = await Car.findOne({ slug: cleanSlug });
    if (existingCar) {
      return res.status(400).json({ message: "A car with this slug already exists" });
    }

    const car = await Car.create({
      name: name.trim(),
      slug: cleanSlug,
      category,
      year: year || new Date().getFullYear(),
      power,
      engine,
      topSpeed,
      zeroToHundred,
      weight,
      transmission: transmission || "Automatic",
      drivetrain: drivetrain || "AWD",
      image,
      gallery: gallery || [image],
      blurb,
      description,
      startingPrice: Number(startingPrice),
      features: features || [],
      availableColors: availableColors || [],
      inStock: inStock !== undefined ? inStock : true,
      status: status || "Active",
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(car);
  } catch (error) {
    console.error("CREATE CAR ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to create car" });
  }
}

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private/Admin
async function updateCar(req, res) {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (req.body.slug) {
      req.body.slug = req.body.slug.toLowerCase().trim();
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCar);
  } catch (error) {
    console.error("UPDATE CAR ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update car" });
  }
}

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
async function deleteCar(req, res) {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Car removed successfully", id: req.params.id });
  } catch (error) {
    console.error("DELETE CAR ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to delete car" });
  }
}

module.exports = {
  getCars,
  getCarBySlug,
  getCarById,
  getFeaturedCars,
  createCar,
  updateCar,
  deleteCar,
};
