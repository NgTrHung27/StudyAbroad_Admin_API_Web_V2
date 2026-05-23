import { Navbar } from "@/components/navbar";
import { GetSchoolInformation } from "@/data/schools";
import { InformationForm } from "@/components/forms/school/update/information-form";
import { redirect, notFound } from "next/navigation";

type Props = {
  params: {
    schoolId: string;
  };
};

export default async function EditSchoolPage({ params }: Props) {
  const school = await GetSchoolInformation(params.schoolId);

  if (!school) {
    notFound();
  }

  return (
    <>
      <Navbar
        title="Chỉnh sửa trường học"
        description={`Chỉnh sửa thông tin trường ${school.name}`}
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          <InformationForm school={school} asModal={false} defaultIsUpdating={true} />
        </div>
      </main>
    </>
  );
}
