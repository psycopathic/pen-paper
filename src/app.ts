import express from "express";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

export default app;