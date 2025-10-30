import { Comment } from "@prisma/client";

export type CommentWithCount = Comment & {
  _count: {
    recommendations: number;
  };
  user: {
    uuid: string;
    visitor?: {
      nick?: string;
    };
  };
};

export type CommentWithInclude = CommentWithCount & {
  recommendations?: { uuid: string }[];
};
