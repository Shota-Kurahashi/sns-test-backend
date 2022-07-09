import { Prisma, PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

// すべてのユーザを取得
router.get("/", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();

  return res.json(users);
});

// userの登録
router.post("/", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const createUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    return res.json(createUser);
  } catch (err) {
    return res.status(400).json(err);
  }
});

// 特定のユーザを取得
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: req.params.userId },
    });

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// user情報を更新
router.put("/:userId", async (req: Request, res: Response) => {
  const { name, email, userId } = req.body;
  if (userId === req.params.userId) {
    try {
      const updateUser = await prisma.user.update({
        where: { userId },
        data: { name, email },
      });

      res.status(200).json(updateUser);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          res.status(500).json("そのメールアドレスはすでに登録されています");
        }
      }
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("自分以外のアカウントを編集できません");
  }
});

// 特定のユーザを削除
router.delete("/:userId", async (req: Request, res: Response) => {
  const sendUserId = req.body.userId;
  if (sendUserId === req.params.userId) {
    try {
      // postがあるときは削除できないのでpostもすべて削除する
      const deleteAllPosts = prisma.post.deleteMany({
        where: {
          authorId: req.params.userId,
        },
      });
      const deleteUser = prisma.user.delete({
        where: { userId: req.params.userId },
      });

      const deleteAll = await prisma.$transaction([deleteAllPosts, deleteUser]);

      return res.json(deleteAll);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分以外のアカウントを消去できません");
  }
});

export default router;
