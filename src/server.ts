import cors from "cors";
import express, { Request, Response } from "express";
import postRouter from "./routes/post";
import userRouter from "./routes/users";

const app = express();
const port = 5050;

const corsOptions = {
  origin: "https://sns-test-frontend.vercel.app" || "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/users", userRouter);
app.use("/api/post", postRouter);

app.get("/", (req: Request, res: Response) => res.send("Hello World!"));

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${port}!`)
);
