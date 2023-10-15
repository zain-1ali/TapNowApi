import express from "express";
// import userRoute from "./routes/user.js";
// import ErrorMiddleware from "./middleware/errorMiddleware.js";
// import { connectDb } from "./config/database.js";
// import ejs from "ejs";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDb from "./config/database.js";
import ErrorMiddleware from "./middlewares/errorMiddleware.js";
import authroutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bodyParser from "body-parser";

dotenv.config();
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/public/Images", express.static("public/Images"));
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authroutes);
app.use("/api/user", userRoutes);

connectDb();

app.use(ErrorMiddleware);

app.listen(4000, () => {
  console.log("server is working");
});
