import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

const prisma = new PrismaClient();
app.use(express.json());

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  return res.json(users);
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return res.json(user);
});

app.get("/", (req: Request, res: Response) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
