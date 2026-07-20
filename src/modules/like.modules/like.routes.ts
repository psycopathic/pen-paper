import { Router } from "express";
import { likeBlog, unlikeBlog } from "./like.controllers";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

const router = Router();

router.post("/blog/:blogId", authenticate, authorize(["admin", "user"]), likeBlog);
router.delete("/blog/:blogId", authenticate, authorize(["admin", "user"]), unlikeBlog);

export default router;
