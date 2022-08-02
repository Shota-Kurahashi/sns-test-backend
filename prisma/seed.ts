// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = "ADMIN";
  const hashPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: "testemail@gmail.com",
      name: "test",
      password: hashPassword,
      role: "ADMIN",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
