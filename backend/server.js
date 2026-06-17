import dotenv from "dotenv";

if(process.env.NODE_ENV !== "production") {     
  dotenv.config();
}

import helmet from "helmet"
import morgan from "morgan";
import express from "express";
import cors from "cors";
import http from "http"
import cookieParser from "cookie-parser";
import prisma from "./config/db.js";
import routes from "./routes/index.js";
import { limiter} from "./middlewares/middleware.js";
import setupSocket from "./lib/socket.js";
import "./config/firebase.js";

const app = express()
const PORT = process.env.PORT || 3000
const server = http.createServer(app);

setupSocket(server);

// security middleware
app.use(helmet())

// Middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(limiter);

// Routes setup
app.use(routes)

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500} = err;
  if(!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).send(err.message);
})

server.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})