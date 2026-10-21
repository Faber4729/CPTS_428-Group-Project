import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import indexRouter from "./routes/index.js";
import reviewsRouter from "./routes/reviews.js";

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

// page and API routes
app.use("/", indexRouter);
app.use("/api/reviews", reviewsRouter);

// frontend files
app.use(express.static(path.resolve(here, "../../frontend")));

// TODO: [Ingrid] configure .env file
const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});