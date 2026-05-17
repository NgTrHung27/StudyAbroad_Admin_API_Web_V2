"use server";

import { db } from "@/lib/db";
import { Country, NewsType, StudentStatus } from "@prisma/client";
import { z } from "zod";

const searchSchema = z.object({
  searchQuery: z.string().optional(),
});

type SearchQuery = z.infer<typeof searchSchema>;

export type ClientComponentSearch = {
  id: string;
  image: string;
  name: string;
  chipValue: StudentStatus | Country | NewsType | string;
  type: "schools" | "accounts" | "news";
  schoolSub?: "program" | "location" | "scholarship" | "gallery";
  schoolSubId?: string;
};

export const search = async (searchQuery: SearchQuery) => {
  let result: ClientComponentSearch[] = [];
  try {
    const validatedField = searchSchema.safeParse(searchQuery);

    if (!validatedField.success) {
      return result;
    }

    const schools = await db.school.findMany({
      where: {
        name: {
          contains: searchQuery.searchQuery,
        },
      },
      select: {
        id: true,
        name: true,
        logo: true,
        country: true,
      },
      take: 2,
    });

    const accounts = await db.account.findMany({
      where: {
        name: {
          contains: searchQuery.searchQuery,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        student: {
          select: {
            status: true,
          },
        },
      },
      take: 10,
    });

    const programs = await db.schoolProgram.findMany({
      where: {
        name: {
          contains: searchQuery.searchQuery,
        },
      },
      select: {
        id: true,
        name: true,
        cover: true,
        school: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      take: 2,
    });

    const locations = await db.schoolLocation.findMany({
      where: {
        name: {
          contains: searchQuery.searchQuery,
        },
      },
      select: {
        id: true,
        name: true,
        cover: true,
        school: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      take: 2,
    });

    const scholarships = await db.schoolScholarship.findMany({
      where: {
        name: {
          contains: searchQuery.searchQuery,
        },
      },
      select: {
        id: true,
        name: true,
        cover: true,
        school: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      take: 2,
    });

    const galleries = await db.schoolGallery.findMany({
      where: {
        name: {
          contains: searchQuery.searchQuery,
        },
      },
      select: {
        id: true,
        name: true,
        cover: true,
        school: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      take: 2,
    });

    const news = await db.news.findMany({
      where: {
        title: {
          contains: searchQuery.searchQuery,
        },
      },
      select: {
        id: true,
        title: true,
        cover: true,
        type: true,
      },
      take: 2,
    });

    schools.forEach((school) => {
      result.push({
        id: school.id,
        image: school.logo,
        name: school.name,
        chipValue: school.country,
        type: "schools",
      });
    });

    accounts.forEach((account) => {
      if (!account.student) {
        return;
      }
      result.push({
        id: account.id,
        image: account.image ?? "/logo_icon_light.png",
        name: account.name,
        chipValue: account.student.status,
        type: "accounts",
      });
    });

    programs.forEach((program) => {
      result.push({
        id: program.school.id,
        image: program.cover ?? "/logo_icon_light.png",
        name: program.name,
        chipValue: program.school.name,
        type: "schools",
        schoolSub: "program",
        schoolSubId: program.id,
      });
    });

    locations.forEach((location) => {
      result.push({
        id: location.school.id,
        image: location.cover ?? "/logo_icon_light.png",
        name: location.name,
        chipValue: location.school.name,
        type: "schools",
        schoolSub: "location",
        schoolSubId: location.id,
      });
    });

    scholarships.forEach((scholarship) => {
      result.push({
        id: scholarship.school.id,
        image: scholarship.cover ?? "/logo_icon_light.png",
        name: scholarship.name,
        chipValue: scholarship.school.name,
        type: "schools",
        schoolSub: "scholarship",
        schoolSubId: scholarship.id,
      });
    });

    galleries.forEach((gallery) => {
      result.push({
        id: gallery.school.id,
        image: gallery.cover ?? "/logo_icon_light.png",
        name: gallery.name,
        chipValue: gallery.school.name,
        type: "schools",
        schoolSub: "gallery",
        schoolSubId: gallery.id,
      });
    });

    news.forEach((newsItem) => {
      result.push({
        id: newsItem.id,
        image: newsItem.cover ?? "/logo_icon_light.png",
        name: newsItem.title,
        chipValue: newsItem.type,
        type: "news",
      });
    });

    return result;
  } catch (error) {
    console.log("SEARCH ERROR", error);

    return result;
  }
};
