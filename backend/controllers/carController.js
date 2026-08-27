const Car = require("../models/Car");

async function getCars(req, res) {
  try {
    const { category } = req.query;
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    const cars = await Car.find(filter).sort({ createdAt: -1 });

    res.status(200).json(cars);
  } catch (error) {
    console.error("GET CARS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch cars" });
  }
}

async function getCarBySlug(req, res) {
  try {
    const car = await Car.findOne({ slug: req.params.slug, isActive: true });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(car);
  } catch (error) {
    console.error("GET CAR ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch car" });
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
      !startingPrice
    ) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const existingCar = await Car.findOne({ slug });
    if (existingCar) {
      return res.status(400).json({ message: "A car with this slug already exists" });
    }

    const car = await Car.create({
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
    });

    res.status(201).json(car);
  } catch (error) {
    console.error("CREATE CAR ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to create car" });
  }
}

async function updateCar(req, res) {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
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

async function deleteCar(req, res) {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    await Car.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Car removed successfully" });
  } catch (error) {
    console.error("DELETE CAR ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to delete car" });
  }
}

module.exports = {
  getCars,
  getCarBySlug,
  createCar,
  updateCar,
  deleteCar,
};
