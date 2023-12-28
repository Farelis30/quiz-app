import { prisma } from "@/libs/prisma";

export const GET = async () => {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      score: true,
    },
    orderBy: {
      score: "desc",
    },
  });

  const leaderboard = users.map((user, index) => ({
    ...user,
    position: index + 1,
  }));
  return Response.json(leaderboard);
};
