import Loading from "@/components/loading";
import { SchoolFeedbacks } from "@/components/schools/feedbacks/school-feedbacks";
import { SchoolGalleries } from "@/components/schools/school-galleries";
import { SchoolInformation } from "@/components/schools/school-information";
import { SchoolLocations } from "@/components/schools/school-locations";
import { SchoolNewsList } from "@/components/schools/school-news-list";
import { SchoolPrograms } from "@/components/schools/school-programs";
import { SchoolTabs } from "@/components/schools/school-tabs";
import { SchoolWrapper } from "@/components/schools/school-wrapper";
import { StudentSchoolTable } from "@/components/tables/schools/student-school-table";
import { GetSchools } from "@/data/schools";
import {
  IconBrandAppgallery,
  IconHeadphones,
  IconProgress,
  IconStar,
} from "@tabler/icons-react";
import { GraduationCap, HouseIcon, InfoIcon, Newspaper } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SchoolScholarships } from "../../../../components/schools/school-scholarships";

export const metadata = {
  title: "Thông tin trường học | CANADA MEDICAL AND EDUCATION",
};

export async function generateStaticParams() {
  const schools = await GetSchools();

  if (!schools) {
    redirect("/schools");
  }

  return schools.map((school) => ({
    schoolId: school.id,
  }));
}

type Props = {
  params: Promise<{
    schoolId: string;
  }>;
};

type TabItem = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
  icon: React.ReactNode | JSX.Element;
};

const SchoolIdPage = async ({ params }: Props) => {
  const { schoolId } = await params;
  const tabs: TabItem[] = [
    {
      title: "Thông tin",
      value: "info",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl shadow-md border">
          <SchoolInformation schoolId={schoolId} />
        </div>
      ),
      icon: <InfoIcon className="size-4" />,
    },
    {
      title: "Học sinh",
      value: "students",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold dark:text-main-foreground bg-main-foreground dark:bg-main-component">
          <StudentSchoolTable schoolId={schoolId} />
        </div>
      ),
      icon: <GraduationCap className="size-4" />,
    },
    {
      title: "Cơ sở",
      value: "teachers",
      content: (
        <div className="w-full overflow-y-scroll relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold dark:text-main-foreground bg-main-foreground dark:bg-main-component">
          <SchoolLocations schoolId={schoolId} />
        </div>
      ),
      icon: <HouseIcon className="size-4" />,
    },
    {
      title: "Chương trình đào tạo",
      value: "courses",
      content: (
        <div className="w-full overflow-y-scroll relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold dark:text-main-foreground bg-main-foreground dark:bg-main-component">
          <SchoolPrograms schoolId={schoolId} />
        </div>
      ),
      icon: <IconProgress className="size-4" />,
    },
    {
      title: "Bộ sưu tập",
      value: "galleries",
      content: (
        <div className="w-full overflow-y-scroll relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold dark:text-main-foreground bg-main-foreground dark:bg-main-component">
          <SchoolGalleries schoolId={schoolId} />
        </div>
      ),
      icon: <IconBrandAppgallery className="size-4" />,
    },
    {
      title: "Học bổng",
      value: "scholarships",
      content: (
        <div className="w-full overflow-y-scroll relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold dark:text-main-foreground bg-main-foreground dark:bg-main-component">
          <SchoolScholarships schoolId={schoolId} />
        </div>
      ),
      icon: <IconStar className="size-4" />,
    },
    {
      title: "Tin tức",
      value: "news",
      content: (
        <div className="w-full overflow-y-scroll relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold dark:text-main-foreground bg-main-foreground dark:bg-main-component">
          <SchoolNewsList schoolId={schoolId} />
        </div>
      ),
      icon: <Newspaper className="size-4" />,
    },
    {
      title: "Phản hồi & Góp ý",
      value: "supports",
      content: (
        <div className="w-full relative h-full rounded-2xl px-8 py-4 dark:text-main-foreground bg-main-foreground dark:bg-main-component">
          <SchoolFeedbacks schoolId={schoolId} />
        </div>
      ),
      icon: <IconHeadphones className="size-4" />,
    },
  ];

  return (
    <>
      <Suspense fallback={<Loading />}>
        <SchoolWrapper schoolId={schoolId}>
          <SchoolTabs tabs={tabs} />
        </SchoolWrapper>
      </Suspense>
    </>
  );
};

export default SchoolIdPage;
