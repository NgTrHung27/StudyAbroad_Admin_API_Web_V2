import { Navbar } from "@/components/navbar";
import { GetSchoolProgram } from "@/data/schools";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: {
    schoolId: string;
    programId: string;
  };
};

export default async function ProgramDetailPage({ params }: Props) {
  const program = await GetSchoolProgram(params.programId);

  if (!program) {
    notFound();
  }

  return (
    <>
      <Navbar
        title="Chi tiết chương trình đào tạo"
        description={`Chương trình ${program.name} của trường ${program.school.name}`}
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">{program.name}</h1>
              <Badge className={program.isPublished ? "bg-emerald-500 hover:bg-emerald-600" : "bg-yellow-500 hover:bg-yellow-600"}>
                {program.isPublished ? "Hiển thị" : "Tạm ẩn"}
              </Badge>
            </div>
            
            {program.cover && (
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
                <Image src={program.cover} alt={program.name} fill className="object-cover" />
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Mô tả</h2>
              <div className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                {program.description || "Không có mô tả."}
              </div>
            </div>
          </div>
          
          {program.images && program.images.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Hình ảnh chương trình</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {program.images.map((img: any) => (
                  <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image src={img.url} alt="Image" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
