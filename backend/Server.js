require("dotenv").config();
const express = require("express")
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/Authroutes");
const { notFound, errorHandler } = require("./middleware/Errormiddleware");

connectDB();

const app = express();

app.use(cors())
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("API is running...");
});

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server running on the ${PORT}`);
});