import prisma from "@/db/db";

export const likeComment = async (
  articleId: number,
  userId: number,
  commentId: number,
  shouldLike: boolean
): Promise<boolean> => {
  try {
    if (shouldLike) {
      const existing = await prisma.interaction.findFirst({
        where: {
          userId,
          articleId,
          commentId,
          type: "LIKE",
        },
      });

      if (!existing) {
        const trx = await prisma.$transaction([
          prisma.interaction.upsert({
            where: {
              userId_commentId_type: {
                userId,
                commentId,
                type: "LIKE",
              },
            },
            update: {},
            create: {
              userId,
              commentId,
              type: "LIKE",
            },
          }),
          prisma.comment.update({
            where: { id: commentId },
            data: {
              likeCount: {
                increment: 1,
              },
            },
          }),
        ]);
        return true;
      }
      return false;
    } else {
      // Remove user from set (returns 1 if user was in set)

      const { count } = await prisma.interaction.deleteMany({
        where: {
          userId,
          articleId,
          type: "LIKE",
        },
      });

      if (count > 0) {
        await prisma.article.update({
          where: { id: articleId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        });
        return true;
      } else {
        return false;
      }
    }
  } catch (e) {
    console.log("error occured == ", e);
    return false;
  }
};
