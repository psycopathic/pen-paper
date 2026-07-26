"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const like_controllers_1 = require("./like.controllers");
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const router = (0, express_1.Router)();
router.post("/blog/:blogId", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin", "user"]), like_controllers_1.likeBlog);
router.delete("/blog/:blogId", authenticate_1.authenticate, (0, authorize_1.authorize)(["admin", "user"]), like_controllers_1.unlikeBlog);
exports.default = router;
//# sourceMappingURL=like.routes.js.map