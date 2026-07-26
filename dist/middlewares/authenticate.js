"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../utils/token");
const apiError_1 = require("../utils/apiError");
const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
        throw new apiError_1.ApiError(401, "Access token is required");
    }
    try {
        const payload = (0, token_1.verifyAccessToken)(token);
        req.userId = payload.sub;
        next();
    }
    catch {
        throw new apiError_1.ApiError(401, "Invalid or expired access token");
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.js.map