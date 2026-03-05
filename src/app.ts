import { Request, Response } from "express";
import {app} from "./server"
import authRouter from "./routes/auth.route";

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);