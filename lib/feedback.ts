import { db } from "./db";

export const GetAllFeedback = async () => {
  const feedbacks = await db.feedback.findMany({
    include: {
      school: {
        select: {
          id: true,
          name: true,
          logo: true,
          country: true,
        },
      },
    },
  });

  return feedbacks;
};

export const GetFeedbackById = async (id: string) => {
  const feedback = await db.feedback.findUnique({
    where: { id },
    include: {
      school: {
        select: {
          id: true,
          name: true,
          logo: true,
          country: true,
        },
      },
      replies: true,
    },
  });

  return feedback;
};

export const GetFeedbackBySchoolId = async (schoolId: string) => {
  const feedbacks = await db.feedback.findMany({
    where: { schoolId },
    include: {
      school: {
        select: {
          id: true,
          name: true,
          logo: true,
          country: true,
        },
      },
    },
  });

  return feedbacks;
};
