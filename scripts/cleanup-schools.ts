import { PrismaClient } from "@prisma/client";

const prismaCleanup = new PrismaClient();

async function main(): Promise<void> {
  try {
    const schoolsToDelete = await prismaCleanup.school.findMany({
      where: {
        name: {
          not: {
            contains: "Cornerstone International Community College",
          },
        },
      },
      select: { id: true },
    });

    const schoolIds: string[] = schoolsToDelete.map((s: { id: string }) => s.id);

    if (schoolIds.length === 0) {
      console.log("No schools to delete.");
      return;
    }

    console.log(`Deleting ${schoolIds.length} schools...`);

    // Delete related records manually because they don't have onDelete: Cascade
    await prismaCleanup.schoolScholarship.deleteMany({ where: { schoolId: { in: schoolIds } } });
    await prismaCleanup.schoolProgram.deleteMany({ where: { schoolId: { in: schoolIds } } });
    await prismaCleanup.schoolGallery.deleteMany({ where: { schoolId: { in: schoolIds } } });

    const deletedSchools = await prismaCleanup.school.deleteMany({
      where: { id: { in: schoolIds } },
    });

    console.log(`Successfully deleted ${deletedSchools.count} schools.`);
  } catch (error) {
    console.error("Error deleting schools:", error);
  } finally {
    await prismaCleanup.$disconnect();
  }
}

main();
