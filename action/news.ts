"use server";

import { db } from "@/lib/db";
import { NewsType } from "@prisma/client";

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

export const createNews = async (data: {
  title: string;
  content: string;
  cover?: string;
  isPublished?: boolean;
  type?: NewsType;
  schoolId?: string;
}) => {
  try {
    // Sanitize data to handle Next.js undefined serialization
    const sanitizedData = sanitizeData(data);

    const news = await db.news.create({
      data: {
        title: sanitizedData.title,
        content: sanitizedData.content,
        cover: sanitizedData.cover || "",
        isPublished: sanitizedData.isPublished ?? false,
        type: sanitizedData.type ?? NewsType.ANNOUNCEMENT,
        schoolId: sanitizedData.schoolId || null,
      },
    });

    return { success: "Tạo tin tức thành công", news };
  } catch (error) {
    console.error("Error creating news:", error);
    return { error: "Có lỗi xảy ra khi tạo tin tức" };
  }
};

export const updateNews = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    cover?: string;
    isPublished?: boolean;
    type?: NewsType;
    schoolId?: string | null;
  }
) => {
  try {
    // Sanitize data to handle Next.js undefined serialization
    const sanitizedData = sanitizeData(data);

    const news = await db.news.update({
      where: { id },
      data: {
        title: sanitizedData.title,
        content: sanitizedData.content,
        cover: sanitizedData.cover,
        isPublished: sanitizedData.isPublished,
        type: sanitizedData.type,
        schoolId: sanitizedData.schoolId,
      },
    });

    return { success: "Cập nhật tin tức thành công", news };
  } catch (error) {
    console.error("Error updating news:", error);
    return { error: "Có lỗi xảy ra khi cập nhật tin tức" };
  }
};

export const deleteNews = async (id: string) => {
  try {
    await db.news.delete({
      where: { id },
    });

    return { success: "Xóa tin tức thành công" };
  } catch (error) {
    console.error("Error deleting news:", error);
    return { error: "Có lỗi xảy ra khi xóa tin tức" };
  }
};
