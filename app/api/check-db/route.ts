import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const schools = await db.school.findMany({
      select: { id: true, name: true, country: true }
    });
    
    const programs = await db.schoolProgram.findMany({
      select: { id: true, name: true, schoolId: true }
    });
    
    return responses.ok({ schools, programs }, "Database connected successfully");
  } catch (error: any) {
    console.error("[CHECK DB ERROR]", error);
    return responses.serverError(error.message);
  }
}
