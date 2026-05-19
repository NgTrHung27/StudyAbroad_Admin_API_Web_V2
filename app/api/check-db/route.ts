import { db } from "@/lib/db";

export async function GET() {
  try {
    const schools = await db.school.findMany({
      select: { id: true, name: true, country: true }
    });
    
    const programs = await db.schoolProgram.findMany({
      select: { id: true, name: true, schoolId: true }
    });
    
    return Response.json({ 
      schools, 
      programs,
      message: "Database connected successfully"
    });
  } catch (error: any) {
    return Response.json({ 
      error: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
