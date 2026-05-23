import { db } from "./db";

export const GetAllNews = async () => {
  const news = await db.news.findMany({
    include: {
      school: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return news;
};

export const GetNewsById = async (id: string) => {
  const news = await db.news.findUnique({
    where: { id },
    include: {
      school: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return news;
};

export const GetNewsBySchoolId = async (schoolId: string) => {
  const news = await db.news.findMany({
    where: { schoolId },
    include: {
      school: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return news;
};
