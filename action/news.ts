"use server";

import { db } from "@/lib/db";
import { NewsType } from "@prisma/client";

export const createNews = async (data: {
  title: string;
  content: string;
  cover?: string;
  isPublished?: boolean;
  type?: NewsType;
  schoolId?: string;
}) => {
  try {
    const news = await db.news.create({
      data: {
        title: data.title,
        content: data.content,
        cover: data.cover || "",
        isPublished: data.isPublished ?? false,
        type: data.type ?? NewsType.ANNOUNCEMENT,
        schoolId: data.schoolId || null,
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
    const news = await db.news.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        cover: data.cover,
        isPublished: data.isPublished,
        type: data.type,
        schoolId: data.schoolId,
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
