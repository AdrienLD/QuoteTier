const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      name: "test",
      email: "alice@example.com",
      password: "test",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "admin",
      email: "bob@example.com",
      password: "admin",
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
