import { Router, type IRouter } from "express";

const router: IRouter = Router();

const OWNER_PASSWORD = process.env.OWNER_PASSWORD ?? "bytech2024";

router.post("/owner-login", (req, res) => {
  const { password } = req.body;

  if (password === OWNER_PASSWORD) {
    (req.session as Record<string, unknown>).isOwner = true;
    (req.session as Record<string, unknown>).role = "owner";
    res.json({ success: true, role: "owner" });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

router.get("/me", (req, res) => {
  const session = req.session as Record<string, unknown>;
  const isOwner = session.isOwner === true;
  res.json({ isOwner, role: isOwner ? "owner" : "guest" });
});

export default router;
