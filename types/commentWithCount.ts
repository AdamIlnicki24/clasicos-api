import { Comment } from "@prisma/client";

export type CommentWithCount = Comment & {
  _count: {
    recommendations: number;
  };
};
