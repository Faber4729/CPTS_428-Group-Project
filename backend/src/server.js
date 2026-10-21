import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import indexRouter from "./routes/index.js";
import reviewsRouter from "./routes/reviews.js";
import chatRouter from "./routes/chat.js";

const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));

app.use(express.urlencoded({ extended: true })); // For Form Submission ?
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(here, "../../frontend/views")); // for ejs templates

// page and API routes
app.use("/", indexRouter);
app.use("/review", reviewsRouter);
app.use("/chat", chatRouter);

// frontend files
app.use(express.static(path.resolve(here, "../../frontend")));

// TODO: [Ingrid] configure .env file
const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});