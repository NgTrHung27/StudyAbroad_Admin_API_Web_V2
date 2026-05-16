import { db } from "./db";

export const GetAllSchools = async () => {
  const schools = await db.school.findMany({
    where: {
      isPublished: true,
    },
    include: {
      programs: {
        select: {
          name: true,
        },
      },
    },
  });

  return schools;
};

export const GetSchoolById = async (id: string) => {
  const school = await db.school.findUnique({
    where: { id },
    include: {
      locations: {
        include: {
          contacts: true,
          images: true,
        },
      },
      programs: {
        include: {
          images: true,
        },
      },
      galleries: {
        include: {
          images: true,
        },
      },
      scholarships: {
        include: {
          images: true,
        },
      },
      news: true,
      feedbacks: true,
    },
  });

  return school;
};

export const GetSchoolsByIdApi = async (id: string) => {
  const school = await db.school.findUnique({
    where: { id },
    include: {
      locations: {
        include: {
          contacts: true,
          images: true,
        },
      },
      programs: {
        include: {
          studentPrograms: {
            select: {
              student: {
                select: {
                  id: true,
                  studentCode: true,
                  account: {
                    select: {
                      name: true,
                    },
                  },
                  cover: true,
                  degreeType: true,
                  certificateType: true,
                  gradeType: true,
                  gradeScore: true,
                  status: true,
                },
              },
            },
          },
          images: true,
        },
      },
      galleries: {
        include: {
          images: true,
        },
      },
      scholarships: {
        include: {
          images: true,
          owners: {
            include: {
              student: true,
            },
          },
        },
      },
      news: true,
    },
  });

  return school;
};

export const GetSchoolNames = async () => {
  const schools = await db.school.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return schools;
};
