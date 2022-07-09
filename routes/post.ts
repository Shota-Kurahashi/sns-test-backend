import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const router = express.Router();
const prisma = new PrismaClient();

// 全員の記事の取得
router.get("/", async (req: Request, res: Response) => {
  const allPosts = await prisma.post.findMany();

  return res.json(allPosts);
});

// 記事の投稿
router.post("/", async (req: Request, res: Response) => {
  const { title, content, body, authorId } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        body,
        authorId,
      },
    });

    return res.json(post);
  } catch (e) {
    return res.status(400).json(e);
  }
});

// 特定のユーザーの記事をすべて取得
router.get("/target/:userId", async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: req.params.userId },
    });

    return res.json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 特定の記事を取得
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    return res.json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 記事の更新
router.put("/:id", async (req: Request, res: Response) => {
  const { title, content, body, userId } = req.body;

  try {
    const targetPost = await prisma.post.findUnique({
      where: { id: req.params.id },
    });
    if (targetPost?.authorId === userId) {
      const updatePost = await prisma.post.update({
        where: { id: req.params.id },
        data: { title, content, body },
      });

      return res.json(updatePost);
    }

    return res.status(403).json("自分以外の記事を編集できません");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 特定のuserの記事をすべて消去
router.delete("/allPostDelete/:userId", async (req: Request, res: Response) => {
  if (req.params.userId === req.body.userId) {
    try {
      const deletePost = await prisma.post.deleteMany({
        where: { authorId: req.params.userId },
      });

      return res.status(200).json(deletePost);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分以外のアカウントを削除できません");
  }
});

// 特定の記事の消去
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const targetPost = await prisma.post.findUnique({
      where: { id: req.params.id },
    });
    if (targetPost?.authorId === req.body.userId) {
      const deletePost = await prisma.post.delete({
        where: { id: req.params.id },
      });

      return res.status(200).json(deletePost);
    }

    return res.status(403).json("自分以外の記事を削除できません");
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
