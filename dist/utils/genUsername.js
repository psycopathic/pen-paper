"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUsername = void 0;
const node_crypto_1 = require("node:crypto");
const adjectives = [
    "swift", "brave", "calm", "keen", "bold", "witty", "sharp", "bright",
    "clever", "fierce", "gentle", "happy", "jolly", "lucky", "merry", "noble",
    "proud", "quiet", "rapid", "sunny", "vivid", "wise", "zesty", "eager",
];
const nouns = [
    "panda", "falcon", "tiger", "wolf", "eagle", "otter", "raven", "fox",
    "bear", "hawk", "lion", "deer", "owl", "seal", "dove", "crane",
    "koala", "lyric", "comet", "nova", "quill", "sage", "storm", "flame",
];
const genUsername = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const suffix = (0, node_crypto_1.randomBytes)(2).toString("hex");
    return `${adj}${noun}${suffix}`;
};
exports.genUsername = genUsername;
//# sourceMappingURL=genUsername.js.map