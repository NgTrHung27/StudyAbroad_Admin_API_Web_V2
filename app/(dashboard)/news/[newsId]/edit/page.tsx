import { Navbar } from "@/components/navbar";
import { GetNewsById } from "@/lib/news";
import { EditNewsForm } from "@/components/news/edit-news-form";
import { notFound } from "next/navigation";

type Props = {
  params: {
    newsId: string;
  };
};

export default async function EditNewsPage({ params }: Props) {
  const news = await GetNewsById(params.newsId);

  if (!news) {
    notFound();
  }

  return (
    <>
      <Navbar
        title="Chỉnh sửa tin tức"
        description={`Chỉnh sửa tin tức "${news.title}"`}
      />
      <main className="flex-1 overflow-auto p-6">
        <EditNewsForm news={news} />
      </main>
    </>
  );
}
