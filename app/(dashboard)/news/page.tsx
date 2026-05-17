import { Navbar } from "@/components/navbar";
import { GetAllNews } from "@/lib/news";
import { NewsTable } from "@/components/news/news-table";
import { News } from "@prisma/client";

export default async function NewsPage() {
  let news: (News & {
    school: { id: string; name: string } | null;
  })[] = [];

  try {
    const result = await GetAllNews();
    news = result ?? [];
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <>
      <Navbar title="Quản lý tin tức" />
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-main dark:text-main-foreground">
              Quản lý tin tức
            </h1>
            <p className="text-muted-foreground">
              Quản lý danh sách tin tức, thông báo và sự kiện
            </p>
          </div>
          <NewsTable news={news} />
        </div>
      </main>
    </>
  );
}
