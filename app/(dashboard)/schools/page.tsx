import { Navbar } from "@/components/navbar";
import { GetSchoolsCard, SchoolCard } from "@/data/schools";
import { SchoolsTable } from "@/components/schools/schools-table";

export default async function SchoolsPage() {
  let schools: SchoolCard[] = [];

  try {
    const result = await GetSchoolsCard();
    schools = result ?? [];
  } catch (error) {
    console.error("Error fetching schools:", error);
  }

  return (
    <>
      <Navbar title="Quản lý trường học" />
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-main dark:text-main-foreground">
              Quản lý trường học
            </h1>
            <p className="text-muted-foreground">
              Quản lý danh sách trường học và thông tin liên quan
            </p>
          </div>
          <SchoolsTable schools={schools} />
        </div>
      </main>
    </>
  );
}
