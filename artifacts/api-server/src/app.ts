import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import fs from "fs";
import router from "./routes";

const app: Express = express();
const projectRoot = process.cwd();
const uploadsDir = path.join(projectRoot, "artifacts", "api-server", "uploads");

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "bytech-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use("/api/uploads", express.static(uploadsDir));
app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(projectRoot, "artifacts", "bytech", "dist", "public");
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(frontendDist, "index.html"));
    });
  }
}

export default app;
