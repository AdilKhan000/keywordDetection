import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";  // Import FormData for server-side use

dotenv.config();

const corsOptions = {
  origin: ["http://localhost:5173"],
};

const app = express();
app.use(cors(corsOptions));

// Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Use FormData from the 'form-data' package to send file buffer
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    // Set appropriate headers for form-data
    const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Send back the Flask server response to the React frontend
    return res.status(200).json({ message: response.data.message });
  } catch (error) {
    console.error("Error forwarding file to Flask server:", error.message);
    const errorMessage = error.response.data.message;
    return res.status(500).json({ message: errorMessage });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
