import { Navbar } from "@/components/navbar";

export default function CreateNewsPage() {
  return (
    <>
      <Navbar title="Thêm tin tức" />
      <main className="py-20 px-10 text-main dark:text-main-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Thêm tin tức</h1>
          <p className="text-muted-foreground mt-2">
            Trang thêm tin tức đang được phát triển
          </p>
        </div>
      </main>
    </>
  );
}
