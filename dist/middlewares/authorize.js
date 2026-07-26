"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const apiError_1 = require("../utils/apiError");
const auth_service_1 = require("../modules/auth.modules/auth.service");
const authorize = (roles) => {
    return async (req, _res, next) => {
        try {
            const userId = req.userId;
            if (!userId) {
                throw new apiError_1.ApiError(401, "Not authenticated");
            }
            const userRole = await (0, auth_service_1.findUserRole)(userId);
            if (!userRole || !roles.includes(userRole)) {
                throw new apiError_1.ApiError(403, "Access denied, insufficient permissions");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map