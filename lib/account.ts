import { db } from "@/lib/db";
import { AccountLib } from "@/types/auth";

export const GetAccountLib = async (): Promise<AccountLib[]> => {
  const accounts = await db.account.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      dob: true,
      emailVerified: true,
      phoneNumber: true,
      address: true,
      idCardNumber: true,
      isTwoFactorEnabled: true,
      student: {
        select: {
          id: true,
          studentCode: true,
          status: true,
        },
      },
      isLocked: true,
    },
  });

  return accounts;
};

export const GetAccountById = async (id: string) => {
  try {
    const account = await db.account.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        dob: true,
        emailVerified: true,
        phoneNumber: true,
        address: true,
        idCardNumber: true,
        isTwoFactorEnabled: true,
        isLocked: true,
        student: {
          select: {
            id: true,
            studentCode: true,
            status: true,
            degreeType: true,
            certificateType: true,
            certificateImg: true,
            gradeType: true,
            gradeScore: true,
            cover: true,
            schoolId: true,
            school: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    return account;
  } catch (error) {
    console.error("GetAccountById error:", error);
    return null;
  }
};

export const GetAccountByEmail = async (email: string) => {
  try {
    const account = await db.account.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        dob: true,
        emailVerified: true,
        phoneNumber: true,
        address: true,
        idCardNumber: true,
        password: true,
        isTwoFactorEnabled: true,
        isLocked: true,
        student: {
          select: {
            id: true,
            studentCode: true,
            status: true,
            degreeType: true,
            certificateType: true,
            certificateImg: true,
            gradeType: true,
            gradeScore: true,
            cover: true,
            schoolId: true,
            profile: {
              select: {
                id: true,
              },
            },
            school: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    return account;
  } catch (error) {
    console.error("GetAccountByEmail error:", error);
    return null;
  }
};
