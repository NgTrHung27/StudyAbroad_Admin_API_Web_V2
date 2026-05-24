"use server";

import { db } from "@/lib/db";
import { StudentStatus, DegreeType, CertificateType, GradeType, Gender } from "@prisma/client";

// Helper to sanitize data by removing $undefined values from Next.js serialization
function sanitizeData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    // Handle Next.js Date serialization format: $D2023-12-20T00:00:00.000Z
    if (data === "$undefined" || data === "undefined") {
      return undefined as unknown as T;
    }
    if (data.startsWith("$D")) {
      const dateStr = data.slice(2); // Remove "$D" prefix
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date as unknown as T;
      }
    }
    return data;
  }

  // Handle Date objects - don't convert them
  if (data instanceof Date) {
    return data;
  }

  // Handle empty objects like {} from serialization
  if (typeof data === "object" && Object.keys(data as object).length === 0) {
    return undefined as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === "$undefined" || value === "undefined" || value === undefined) {
        continue;
      }
      // Skip empty objects
      if (typeof value === "object" && value !== null && Object.keys(value).length === 0) {
        continue;
      }
      sanitized[key] = sanitizeData(value);
    }
    return sanitized as T;
  }

  return data;
}

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
    // Sanitize data to handle Next.js undefined serialization
    const sanitizedData = sanitizeData(data);

    const existingAccount = await db.account.findUnique({
      where: { email: sanitizedData.email },
    });

    if (existingAccount) {
      return { error: "Email đã được sử dụng" };
    }

    const account = await db.account.create({
      data: {
        email: sanitizedData.email,
        name: sanitizedData.name,
        password: sanitizedData.password || "",
        phoneNumber: sanitizedData.phoneNumber || "",
        dob: sanitizedData.dob || new Date(),
        address: sanitizedData.address || "",
        idCardNumber: sanitizedData.idCardNumber || "",
        gender: sanitizedData.gender || Gender.MALE,
        emailVerified: new Date(),
        student: sanitizedData.studentCode
          ? {
              create: {
                studentCode: sanitizedData.studentCode,
                status: sanitizedData.status || StudentStatus.AWAITING,
                degreeType: DegreeType.HIGHSCHOOL,
                certificateType: CertificateType.IELTS,
                certificateImg: "",
                gradeType: GradeType.GPA,
                gradeScore: 0,
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
    // Sanitize data to handle Next.js undefined serialization
    const sanitizedData = sanitizeData(data);

    // Update account info
    const account = await db.account.update({
      where: { id },
      data: {
        name: sanitizedData.name,
        phoneNumber: sanitizedData.phoneNumber,
        dob: sanitizedData.dob,
        address: sanitizedData.address,
        idCardNumber: sanitizedData.idCardNumber,
      },
    });

    // Check if student record exists
    const existingStudent = await db.student.findUnique({
      where: { accountId: id },
    });

    if (sanitizedData.status || sanitizedData.studentCode) {
      if (existingStudent) {
        // Update existing student
        await db.student.update({
          where: { accountId: id },
          data: {
            studentCode: sanitizedData.studentCode ?? existingStudent.studentCode,
            status: sanitizedData.status ?? existingStudent.status,
          },
        });
      } else if (sanitizedData.studentCode) {
        // Create new student if studentCode is provided
        await db.student.create({
          data: {
            accountId: id,
            studentCode: sanitizedData.studentCode,
            status: sanitizedData.status || StudentStatus.AWAITING,
            degreeType: DegreeType.HIGHSCHOOL,
            certificateType: CertificateType.IELTS,
            certificateImg: "",
            gradeType: GradeType.GPA,
            gradeScore: 0,
          },
        });
      }
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
