import { prisma } from "@/libs/prisma";

export const GET = async () => {
  try {
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
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return Response.status(500).json({ error: "Internal Server Error" });
  }
};
