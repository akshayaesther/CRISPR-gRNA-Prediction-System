const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());


/* CONNECT TO MONGODB */
mongoose.connect("mongodb://127.0.0.1:27017/crisprDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/*PREDICTION*/
const Prediction = mongoose.model("Prediction", {
  userId: String,
  sequence: String,
  result: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/* USER MODEL */
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  role: String,
  organization: String,
  country: String
});

/* REGISTER API */
app.post("/register", async (req, res) => {

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    ...req.body,
    password: hashedPassword
  });

  await user.save();
  res.status(201).json({ success: true });
});

/* LOGIN API */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔴 Check DB connection
    if (!mongoose.connection.readyState) {
      return res.status(500).json({
        success: false,
        message: "Database not connected ❌"
      });
    }

    const user = await User.findOne({ email });

    // ❌ User not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌"
      });
    }

    // ❌ Wrong password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password ❌"
      });
    }

    // ✅ Success
    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      token,
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error ❌"
    });
  }
});

/*RESET PASSWORD*/
app.post("/reset-password", async (req, res) => {

  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const bcrypt = require("bcrypt");
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

 res.json({ success: true });
});

/* START SERVER */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

/*USER AND PREDICTION*/
app.get("/stats", async (req, res) => {

  const totalUsers = await User.countDocuments();
  const totalPredictions = await Prediction.countDocuments();

  res.json({
    totalUsers,
    totalPredictions
  });
});

app.post("/save-prediction", async (req, res) => {
  try {
    const { userId, sequence, result } = req.body;

    const newPrediction = new Prediction({
      userId,
      sequence,
      result
    });

    await newPrediction.save();

    res.json({ message: "Prediction Saved ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/prediction/:userId", async (req, res) => {
  try {
    const data = await Prediction.find({
      userId: req.params.userId
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});