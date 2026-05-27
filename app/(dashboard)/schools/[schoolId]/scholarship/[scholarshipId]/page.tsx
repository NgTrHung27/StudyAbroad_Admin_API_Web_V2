import { Navbar } from "@/components/navbar";
import { GetSchoolScholarship } from "@/data/schools";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: {
    schoolId: string;
    scholarshipId: string;
  };
};

export default async function ScholarshipDetailPage({ params }: Props) {
  const scholarship = await GetSchoolScholarship(params.scholarshipId);

  if (!scholarship) {
    notFound();
  }

  return (
    <>
      <Navbar
        title="Chi tiết học bổng"
        description={`Học bổng ${scholarship.name} của trường ${scholarship.school.name}`}
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">{scholarship.name}</h1>
              <Badge className={scholarship.isPublished ? "bg-emerald-500 hover:bg-emerald-600" : "bg-yellow-500 hover:bg-yellow-600"}>
                {scholarship.isPublished ? "Hiển thị" : "Tạm ẩn"}
              </Badge>
            </div>
            
            {scholarship.cover && (
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
                <Image src={scholarship.cover} alt={scholarship.name} fill className="object-cover" />
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">Mô tả</h2>
              <div className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                {scholarship.description || "Không có mô tả."}
              </div>
            </div>
          </div>
          
          {scholarship.images && scholarship.images.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Hình ảnh học bổng</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {scholarship.images.map((img: any) => (
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
