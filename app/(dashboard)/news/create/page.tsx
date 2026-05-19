import { Navbar } from "@/components/navbar";
import { NewsForm } from "@/components/news/news-form";

export default function CreateNewsPage() {
  return (
    <>
      <Navbar title="Thêm tin tức" />
      <main className="flex-1 overflow-auto p-6">
        <NewsForm />
      </main>
    </>
  );
}
