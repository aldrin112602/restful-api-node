import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
const app = express();

console.log("Starting server...");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


app.use("/api", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
