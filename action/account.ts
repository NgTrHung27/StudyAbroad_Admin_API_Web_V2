"use server";

import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs";
import { StudentStatus } from "@prisma/client";

export const createAccount = async (data: {
  email: string;
  name: string;
  password?: string;
  phoneNumber?: string;
  dob?: Date;
  address?: string;
  idCardNumber?: string;
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

    const user = await clerkClient.users.createUser({
      emailAddress: [data.email],
      username: data.email.split("@")[0],
      firstName: data.name.split(" ")[0],
      lastName: data.name.split(" ").slice(1).join(" ") || undefined,
      publicMetadata: {
        role: "STUDENT",
      },
    });

    const account = await db.account.create({
      data: {
        id: user.id,
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber || "",
        dob: data.dob || new Date(),
        address: data.address || "",
        idCardNumber: data.idCardNumber || "",
        emailVerified: new Date(),
        student: data.studentCode
          ? {
              create: {
                studentCode: data.studentCode,
                status: data.status || StudentStatus.AWAITING,
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
    await clerkClient.users.deleteUser(id);

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
