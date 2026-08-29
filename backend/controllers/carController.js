const Car = require("../models/Car");
const Review = require("../models/Review");

async function getCars(req, res) {
  try {
    const { category, search, sort, maxPrice, minPower } = req.query;
    const filter = { isActive: true };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { engine: { $regex: search, $options: "i" } },
        { blurb: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (maxPrice) {
      filter.startingPrice = { $lte: Number(maxPrice) };
    }

    let query = Car.find(filter);

    if (sort === "price-asc") query = query.sort({ startingPrice: 1 });
    else if (sort === "price-desc") query = query.sort({ startingPrice: -1 });
    else if (sort === "name-asc") query = query.sort({ name: 1 });
    else query = query.sort({ createdAt: -1 });

    const cars = await query;
    res.status(200).json(cars);
  } catch (error) {
    console.error("GET CARS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch cars" });
  }
}

async function getFeaturedCars(req, res) {
  try {
    const cars = await Car.find({ isActive: true, isFeatured: true }).limit(6);
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch featured cars" });
  }
}

async function getCarBySlug(req, res) {
  try {
    const car = await Car.findOne({ slug: req.params.slug.toLowerCase(), isActive: true });

    if (!car) {
      return res.status(404).json({ message: "Lamborghini model not found" });
    }

    // Get reviews for this car
    const reviews = await Review.find({ car: car._id }).sort({ createdAt: -1 });

    res.status(200).json({
      ...car.toObject(),
      reviews,
    });
  } catch (error) {
    console.error("GET CAR ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch model details" });
  }
}

async function createCar(req, res) {
  try {
    const {
      name,
      slug,
      category,
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
      isFeatured,
    } = req.body;

    if (!name || !slug || !category || !power || !engine || !topSpeed || !zeroToHundred || !image || !startingPrice) {
      return res.status(400).json({ message: "Please fill in all required car fields" });
    }

    const cleanSlug = slug.toLowerCase().trim();
    const existing = await Car.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({ message: "A model with this slug already exists" });
    }

    const car = await Car.create({
      name,
      slug: cleanSlug,
      category,
      power,
      engine,
      topSpeed,
      zeroToHundred,
      weight: weight || "1,700 kg",
      transmission: transmission || "8-speed Dual-clutch",
      drivetrain: drivetrain || "AWD",
      image,
      gallery: Array.isArray(gallery) ? gallery : [],
      blurb: blurb || description?.slice(0, 120) || name,
      description: description || blurb,
      startingPrice: Number(startingPrice),
      features: Array.isArray(features) ? features : [],
      availableColors: Array.isArray(availableColors) ? availableColors : [],
      isFeatured: isFeatured !== false,
      isActive: true,
    });

    res.status(201).json(car);
  } catch (error) {
    console.error("CREATE CAR ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to create car listing" });
  }
}

async function updateCar(req, res) {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const updated = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("UPDATE CAR ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to update car" });
  }
}

async function deleteCar(req, res) {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Car removed from inventory successfully" });
  } catch (error) {
    console.error("DELETE CAR ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to delete car" });
  }
}

async function addCarReview(req, res) {
  try {
    const { rating, comment } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (!rating || !comment) {
      return res.status(400).json({ message: "Please provide both a rating and comment" });
    }

    const alreadyReviewed = await Review.findOne({
      car: car._id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();
    } else {
      await Review.create({
        car: car._id,
        user: req.user._id,
        userName: req.user.name,
        rating: Number(rating),
        comment,
      });
    }

    // Recalculate car average rating
    const reviews = await Review.find({ car: car._id });
    car.numReviews = reviews.length;
    car.rating = Number(
      (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    );
    await car.save();

    res.status(201).json({ message: "Review submitted successfully", reviews });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to submit review" });
  }
}

async function getCarReviews(req, res) {
  try {
    const reviews = await Review.find({ car: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch reviews" });
  }
}

module.exports = {
  getCars,
  getFeaturedCars,
  getCarBySlug,
  createCar,
  updateCar,
  deleteCar,
  addCarReview,
  getCarReviews,
};
