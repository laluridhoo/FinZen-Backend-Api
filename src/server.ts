import express, { Request, Response } from "express";
import authRouter from "./routes/auth.route";

export const app = express();
const port = 3000;

// Middleware
app.use(express.json());

app.listen(port, () => {
  console.log(`Server Express berhasil berjalan di port ${port}`);
});
