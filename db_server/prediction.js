prediction.js

const express = require("express");
const router = express.Router();

// TEMP TEST API
router.get("/prediction/:userId", async (req, res) => {
  try {
     res.json({ message: "Working ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;