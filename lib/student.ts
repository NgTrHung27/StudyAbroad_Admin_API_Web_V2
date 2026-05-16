import { db } from "./db";
import { DegreeType } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const getStudentByAccountId = async (accountId: string) => {
  const student = await db.student.findUnique({
    where: { accountId },
    include: {
      account: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          dob: true,
          phoneNumber: true,
          address: true,
          idCardNumber: true,
        },
      },
      school: {
        select: {
          id: true,
          name: true,
          logo: true,
          background: true,
        },
      },
      program: {
        include: {
          program: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
      location: {
        include: {
          location: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
      scholarship: {
        include: {
          scholarship: {
            select: {
              id: true,
              name: true,
              cover: true,
              description: true,
            },
          },
        },
      },
      tuitions: true,
      requirements: {
        include: {
          replies: true,
          images: true,
        },
      },
    },
  });

  return student;
};

export const getStudentById = async (id: string) => {
  const student = await db.student.findUnique({
    where: { id },
    include: {
      account: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          dob: true,
          phoneNumber: true,
          address: true,
          idCardNumber: true,
        },
      },
      school: true,
      program: {
        include: {
          program: true,
        },
      },
      location: {
        include: {
          location: true,
        },
      },
      scholarship: {
        include: {
          scholarship: true,
        },
      },
      tuitions: true,
      requirements: {
        include: {
          replies: true,
          images: true,
        },
      },
    },
  });

  return student;
};

export const generateStudentCode = (degreeType: DegreeType) => {
  const currentYear: number = new Date().getFullYear();
  const year: number = currentYear % 100;
  const yearCode = year.toString();

  const degreeCode = degreeType === DegreeType.HIGHSCHOOL ? "PT" : "DH";

  const token = crypto.randomInt(100_000, 1_000_000).toString();

  return `${yearCode}${degreeCode}${token}`;
};
