const Newsletter = require("../models/Newsletter");

async function subscribeNewsletter(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "This email is already subscribed" });
    }

    const subscriber = await Newsletter.create({ email });

    res.status(201).json({
      message: "Successfully subscribed to newsletter",
      email: subscriber.email,
    });
  } catch (error) {
    console.error("NEWSLETTER ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to subscribe" });
  }
}

async function getAllSubscribers(req, res) {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("GET SUBSCRIBERS ERROR:", error);
    res.status(500).json({ message: error.message || "Failed to fetch subscribers" });
  }
}

module.exports = { subscribeNewsletter, getAllSubscribers };
