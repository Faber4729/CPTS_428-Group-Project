import { Router } from "express";
import { fileURLToPath } from "node:url";

const router = Router();
const frontendIndex = fileURLToPath(
  new URL("../../../frontend/index.html", import.meta.url),
);

router.get("/", (_req, res) => {
  res.sendFile(frontendIndex);
});

export default router;
