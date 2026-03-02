import express, { Request, Response } from "express";
import authRouter from "./routes/auth.route";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server Express berhasil berjalan di port ${port}`);
});
