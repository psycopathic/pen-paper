"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getSecret = (key) => {
    const secret = process.env[key];
    if (!secret)
        throw new Error(`${key} is not defined in environment variables`);
    return secret;
};
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ sub: userId }, getSecret("ACCESS_TOKEN_SECRET"), {
        expiresIn: "15m",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ sub: userId }, getSecret("REFRESH_TOKEN_SECRET"), {
        expiresIn: "7d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, getSecret("ACCESS_TOKEN_SECRET"));
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, getSecret("REFRESH_TOKEN_SECRET"));
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=token.js.map