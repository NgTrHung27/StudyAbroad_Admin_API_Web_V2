"use server";

import { db } from "@/lib/db";
import { StudentStatus, DegreeType, CertificateType, GradeType, Gender } from "@prisma/client";

export const createAccount = async (data: {
  email: string;
  name: string;
  password?: string;
  phoneNumber?: string;
  dob?: Date;
  address?: string;
  idCardNumber?: string;
  gender?: Gender;
  studentCode?: string;
  status?: StudentStatus;
}) => {
  try {
    const existingAccount = await db.account.findUnique({
      where: { email: data.email },
    });

    if (existingAccount) {
      return { error: "Email đã được sử dụng" };
    }

    const account = await db.account.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password || "",
        phoneNumber: data.phoneNumber || "",
        dob: data.dob || new Date(),
        address: data.address || "",
        idCardNumber: data.idCardNumber || "",
        gender: data.gender || Gender.MALE,
        emailVerified: new Date(),
        student: data.studentCode
          ? {
              create: {
                studentCode: data.studentCode,
                status: data.status || StudentStatus.AWAITING,
                degreeType: DegreeType.HIGHSCHOOL,
                certificateType: CertificateType.IELTS,
                certificateImg: "",
                gradeType: GradeType.GPA,
                gradeScore: 0,
                schoolId: "",
              },
            }
          : undefined,
      },
    });

    return { success: "Tạo tài khoản thành công", account };
  } catch (error) {
    console.error("Error creating account:", error);
    return { error: "Có lỗi xảy ra khi tạo tài khoản" };
  }
};

export const updateAccount = async (
  id: string,
  data: {
    name?: string;
    phoneNumber?: string;
    dob?: Date;
    address?: string;
    idCardNumber?: string;
    studentCode?: string;
    status?: StudentStatus;
  }
) => {
  try {
    const account = await db.account.update({
      where: { id },
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        dob: data.dob,
        address: data.address,
        idCardNumber: data.idCardNumber,
      },
    });

    if (data.status) {
      await db.student.update({
        where: { accountId: id },
        data: {
          studentCode: data.studentCode,
          status: data.status,
        },
      });
    }

    return { success: "Cập nhật tài khoản thành công", account };
  } catch (error) {
    console.error("Error updating account:", error);
    return { error: "Có lỗi xảy ra khi cập nhật tài khoản" };
  }
};

export const deleteAccount = async (id: string) => {
  try {
    await db.student.deleteMany({
      where: { accountId: id },
    });

    await db.account.delete({
      where: { id },
    });

    return { success: "Xóa tài khoản thành công" };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { error: "Có lỗi xảy ra khi xóa tài khoản" };
  }
};
