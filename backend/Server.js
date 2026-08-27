require("dotenv").config();
const express = require("express")
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/Authroutes");
const carRoutes = require("./routes/carRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const testDriveRoutes = require("./routes/testDriveRoutes");
const { notFound, errorHandler } = require("./middleware/Errormiddleware");

connectDB();

const app = express();

app.use(cors())
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Lamborghini API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/testdrive", testDriveRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});