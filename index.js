require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./src/middlewares/errorHandler");
const connectDB = require("./src/config/dbConfig");
const userRoutes = require("./src/routes/userRoutes");
const officeRoutes = require("./src/routes/officeRoutes");
const { createDefaultAdmin } = require("./src/controllers/adminController");
const contactRoutes = require("./src/routes/contactRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const promoRoutes = require("./src/routes/promoRoutes");

const app = express();

//Enable This when you are using local host
// Proper CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE,PATCH",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.options(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Body parser
app.use(bodyParser.json());
app.use(express.json());

// Connect to the database
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// User Routes
app.use("/api/user", userRoutes);
//Office Route
app.use("/api/office", officeRoutes);
//constact Route
app.use("/api/contact", contactRoutes);
//payment Route
app.use("/api/payment", paymentRoutes);
app.use("/api/promocode", promoRoutes);

const initializeApp = async () => {
  try {
    await connectDB(); // Ensure DB is connected first
    await createDefaultAdmin(); // Ensure a default admin exists
    console.log("✅ Default admin checked/created.");
  } catch (error) {
    console.error(" Error initializing app:", error);
  }
};

initializeApp();

// Error handling middleware
app.use(errorHandler);

// Export the app for use in server.js
module.exports = app;

// Start the server if this file is executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
