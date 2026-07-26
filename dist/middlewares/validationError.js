"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationError = void 0;
const express_validator_1 = require("express-validator");
const validationError = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: errors.array()[0]?.msg ?? "Validation error",
            errors: errors.array(),
        });
        return;
    }
    next();
};
exports.validationError = validationError;
//# sourceMappingURL=validationError.js.map